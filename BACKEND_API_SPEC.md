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
  l.display_name,
  l.profile_pic_url,
  l.profile_url,
  l.follower_count,
  l.following_count,
  l.post_count,
  l.platform,
  l.created_at,
  l.updated_at,

  -- From lead_analyses (most recent analysis)
  la.analysis_type,
  la.status as analysis_status,
  la.completed_at as analysis_completed_at,
  la.overall_score,

  -- Extract from ai_response JSONB
  la.ai_response->>'summary' as summary,
  (la.ai_response->>'confidence')::integer as confidence

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
        // Primary lead data (from leads table)
        "id": "uuid",
        "account_id": "uuid",
        "business_profile_id": "uuid" | null,
        "username": "@nike",
        "display_name": "Nike" | null,
        "profile_pic_url": "https://..." | null,
        "profile_url": "https://instagram.com/nike" | null,
        "follower_count": 250000000 | null,
        "following_count": 150 | null,
        "post_count": 1200 | null,
        "platform": "instagram" | null,
        "created_at": "2025-01-15T10:00:00Z",
        "updated_at": "2025-01-15T12:00:00Z",

        // Analysis data (from lead_analyses table - null if not analyzed)
        "analysis_type": "deep" | "light" | "xray" | null,
        "analysis_status": "pending" | "processing" | "complete" | "failed" | null,
        "analysis_completed_at": "2025-01-15T10:00:00Z" | null,
        "overall_score": 87 | null,
        "summary": "Nike is a globally recognized sports brand..." | null,
        "confidence": 92 | null
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

1. **Field Names:**
   - All fields are returned with their exact database column names (no renaming needed)
   - Example: `display_name` (DB) → `display_name` (API)
   - Example: `follower_count` (DB) → `follower_count` (API)

2. **JSONB Extraction:**
   - The `ai_response` field in `lead_analyses` contains nested JSON
   - Extract `summary` field: `ai_response->>'summary'`
   - Extract `confidence` field: `(ai_response->>'confidence')::integer`

3. **Default Values:**
   - If no analysis exists for a lead, return `null` for all analysis-related fields:
     - `analysis_type`: null
     - `analysis_status`: null
     - `analysis_completed_at`: null
     - `overall_score`: null
     - `summary`: null
     - `confidence`: null

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
