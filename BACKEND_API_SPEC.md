# Backend API Specification for Leads

## Overview
This document specifies the backend API endpoint needed to fetch real leads data from the database.

## Database Schema

### `leads` table
```sql
- id: uuid (PK)
- account_id: uuid (FK - identifies which user account owns this lead)
- business_profile_id: uuid (nullable)
- username: text (Instagram username, e.g., "@nike")
- display_name: text (nullable)
- profile_pic_url: text (nullable)
- profile_url: text (nullable)
- follower_count: integer (nullable)
- following_count: integer (nullable)
- post_count: integer (nullable)
- external_url: text (nullable)
- is_verified: boolean (nullable)
- is_private: boolean (nullable)
- is_business_account: boolean (nullable)
- platform: text (nullable - e.g., "instagram")
- first_analyzed_at: timestamp (nullable)
- last_analyzed_at: timestamp (nullable)
- deleted_at: timestamp (nullable)
- created_at: timestamp
- updated_at: timestamp
```

### `lead_analyses` table
```sql
- id: uuid (PK)
- lead_id: uuid (FK -> leads.id)
- account_id: uuid
- business_profile_id: uuid (nullable)
- analysis_type: text ("light", "deep", or "xray")
- status: text ("pending", "processing", "complete", "failed")
- ai_response: jsonb (contains scores, summary, psychographics)
- overall_score: integer (0-100, nullable)
- started_at: timestamp (nullable)
- completed_at: timestamp (nullable)
- deleted_at: timestamp (nullable)
- created_at: timestamp
- run_id: text (nullable)
- error_message: text (nullable)
- updated_at: timestamp
```

## Required API Endpoint

### GET /api/leads

**Description:** Fetch all leads for the authenticated user

**Authentication:** Required (Bearer token in Authorization header)

**Query Parameters:**
- `page` (optional, number): Page number for pagination (default: 1)
- `pageSize` (optional, number): Number of items per page (default: 100)
- `sortBy` (optional, string): Field to sort by - "created_at", "updated_at", or "overall_score" (default: "created_at")
- `sortOrder` (optional, string): "asc" or "desc" (default: "desc")
- `platform` (optional, string): Filter by platform (e.g., "instagram")
- `analysisStatus` (optional, string): Filter by analysis status - "pending", "processing", "complete", "failed"

**SQL Query Logic:**

```sql
-- 1. Get account_id from the authenticated user's JWT token
-- 2. Perform LEFT JOIN to get the most recent analysis for each lead

SELECT
  l.id,
  l.account_id,
  l.business_profile_id,
  l.username,
  l.display_name as full_name,
  l.profile_pic_url as avatar_url,
  l.profile_url,
  l.follower_count as followers_count,
  l.following_count,
  l.post_count as posts_count,
  l.external_url,
  l.platform,
  l.created_at,
  l.updated_at,

  -- From lead_analyses (most recent analysis)
  la.analysis_type,
  la.status as analysis_status,
  la.completed_at as analysis_completed_at,
  la.overall_score,
  la.run_id,

  -- Extract from ai_response JSONB
  la.ai_response->>'niche_fit_score' as niche_fit_score,
  la.ai_response->>'engagement_score' as engagement_score,
  la.ai_response->>'confidence_level' as confidence_level,
  la.ai_response->>'bio' as bio,
  la.ai_response->>'summary_text' as summary_text,
  la.ai_response->>'outreach_message' as outreach_message,
  la.ai_response->'psychographics' as psychographics,

  -- Metadata
  CASE WHEN la.id IS NOT NULL THEN 0 ELSE 0 END as credits_charged,
  false as cache_hit

FROM leads l
LEFT JOIN LATERAL (
  SELECT *
  FROM lead_analyses
  WHERE lead_id = l.id
    AND deleted_at IS NULL
  ORDER BY created_at DESC
  LIMIT 1
) la ON true

WHERE l.account_id = :authenticated_user_account_id
  AND l.deleted_at IS NULL

ORDER BY l.created_at DESC
LIMIT :pageSize OFFSET :offset;
```

**Response Format:**

```typescript
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": "uuid",
        "account_id": "uuid",
        "business_profile_id": "uuid",
        "username": "@nike",
        "full_name": "Nike",
        "platform": "instagram",
        "profile_url": "https://instagram.com/nike",
        "avatar_url": "https://...",

        // Analysis results (null if not analyzed yet)
        "analysis_type": "deep" | "light" | "xray" | null,
        "analysis_status": "pending" | "processing" | "complete" | "failed",
        "analysis_completed_at": "2025-01-15T10:00:00Z" | null,

        // Scores (0-100, null if not analyzed)
        "overall_score": 87 | null,
        "niche_fit_score": 85 | null,
        "engagement_score": 89 | null,
        "confidence_level": 92 | null,

        // Profile data
        "bio": "Just Do It. Official Nike account.",
        "followers_count": 250000000,
        "following_count": 150,
        "posts_count": 1200,

        // AI-generated content (null if not analyzed)
        "summary_text": "Nike is a globally recognized..." | null,
        "outreach_message": "Hi Nike team!..." | null,
        "psychographics": {
          "disc_profile": {
            "dominance": 75,
            "influence": 85,
            "steadiness": 60,
            "conscientiousness": 70,
            "primary_type": "I"
          },
          "copywriter_profile": {
            "is_copywriter": false,
            "specialization": null,
            "experience_level": null
          },
          "motivation_drivers": ["Innovation", "Excellence"],
          "communication_style": "Bold, inspirational",
          "recommended_proof_elements": ["Social proof"],
          "outreach_strategy": "Lead with shared values",
          "hook_style_suggestions": ["Challenge-based hooks"]
        } | null,

        // Metadata
        "cache_hit": false,
        "credits_charged": 2,
        "run_id": "run_abc123" | null,
        "created_at": "2025-01-15T10:00:00Z"
      }
    ],
    "total": 42,
    "page": 1,
    "pageSize": 100
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Unauthorized" | "Internal server error"
}
```

## Data Mapping Notes

1. **Field Name Mappings:**
   - `display_name` (DB) → `full_name` (API)
   - `profile_pic_url` (DB) → `avatar_url` (API)
   - `follower_count` (DB) → `followers_count` (API)
   - `post_count` (DB) → `posts_count` (API)
   - `status` (DB) → `analysis_status` (API)

2. **JSONB Extraction:**
   - The `ai_response` field in `lead_analyses` contains nested JSON with scores, summary, and psychographics
   - Extract these fields and flatten them in the API response

3. **Default Values:**
   - If no analysis exists for a lead, return `null` for all analysis-related fields
   - `analysis_status` should be `"pending"` if no analysis record exists

4. **Authentication:**
   - Extract `account_id` from the JWT token
   - Only return leads where `leads.account_id` matches the authenticated user's account

5. **Performance:**
   - Use LEFT JOIN LATERAL for efficient "most recent analysis" lookup
   - Add indexes on: `leads.account_id`, `leads.created_at`, `lead_analyses.lead_id`

## Testing Checklist

- [ ] Endpoint returns empty array when user has no leads
- [ ] Endpoint returns leads with no analysis (all analysis fields null)
- [ ] Endpoint returns leads with completed analysis (all fields populated)
- [ ] Endpoint respects pagination parameters
- [ ] Endpoint filters by `account_id` from authenticated user
- [ ] Endpoint handles invalid/expired JWT tokens (returns 401)
- [ ] Endpoint doesn't leak leads from other accounts
- [ ] Endpoint returns proper CORS headers for frontend
