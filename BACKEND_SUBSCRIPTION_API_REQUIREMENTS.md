# Backend API Requirements for Subscription Display

## Overview
The frontend now fetches subscription data from the backend and caches it in Zustand store. This document specifies the required backend endpoint and data format.

---

## 🔌 Required Endpoint

### **GET /api/billing/subscription**

**Authentication:** Required (Bearer token)

**Description:** Returns the current user's subscription information

---

## 📥 Request

```http
GET /api/billing/subscription HTTP/1.1
Host: api.oslira.com
Authorization: Bearer <access_token>
```

**Headers:**
- `Authorization: Bearer <jwt_token>` (required)

**Query Parameters:** None

---

## 📤 Response Format

### Success Response (200 OK)

```json
{
  "id": "sub_abc123",
  "accountId": "acc_xyz789",
  "stripeSubscriptionId": "sub_stripe_123",
  "stripeCustomerId": "cus_stripe_456",
  "tier": "growth",
  "status": "active",
  "currentPeriodStart": "2025-11-01T00:00:00.000Z",
  "currentPeriodEnd": "2025-12-01T00:00:00.000Z",
  "creditsRemaining": 250,
  "lightRemaining": 250,
  "createdAt": "2025-10-01T00:00:00.000Z",
  "updatedAt": "2025-11-24T12:00:00.000Z"
}
```

### Response Fields

| Field | Type | Required | Description | Possible Values |
|-------|------|----------|-------------|----------------|
| `id` | string | ✅ | Subscription record ID | UUID or custom ID |
| `accountId` | string | ✅ | Account/User ID | UUID |
| `stripeSubscriptionId` | string \| null | ✅ | Stripe subscription ID | `sub_*` or null for free |
| `stripeCustomerId` | string \| null | ✅ | Stripe customer ID | `cus_*` or null for free |
| `tier` | string | ✅ | Plan tier name | `free`, `growth`, `pro`, `agency`, `enterprise` |
| `status` | string | ✅ | Subscription status | `active`, `canceled`, `past_due`, `unpaid`, `trialing` |
| `currentPeriodStart` | string | ✅ | Billing period start | ISO 8601 timestamp |
| `currentPeriodEnd` | string | ✅ | Billing period end | ISO 8601 timestamp |
| `creditsRemaining` | number | ✅ | Credits left this period | Integer >= 0 |
| `lightRemaining` | number | ✅ | Light analyses left | Integer >= 0 |
| `createdAt` | string | ✅ | Record creation time | ISO 8601 timestamp |
| `updatedAt` | string | ✅ | Last update time | ISO 8601 timestamp |

---

## 🗄️ Database Schema (Expected)

The backend should query from a `subscriptions` table (or similar) with these columns:

```sql
-- Table: subscriptions (or user_subscriptions)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES accounts(id),
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  plan_type VARCHAR(50) NOT NULL,  -- ⚠️ Maps to 'tier' in response
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**CRITICAL:** The database column is named `plan_type`, but the API response should use `tier`.

---

## 🔄 Backend Implementation Guide

### Field Mapping (Database → API Response)

```typescript
// Database columns (snake_case) → API response (camelCase)
{
  id: row.id,
  accountId: row.account_id,              // snake_case → camelCase
  stripeSubscriptionId: row.stripe_subscription_id,
  stripeCustomerId: row.stripe_customer_id,
  tier: row.plan_type,                    // ⚠️ plan_type → tier
  status: row.status,
  currentPeriodStart: row.current_period_start,
  currentPeriodEnd: row.current_period_end,
  creditsRemaining: row.credits_remaining,
  lightRemaining: row.light_remaining,
  createdAt: row.created_at,
  updatedAt: row.updated_at
}
```

### Example Implementation (Cloudflare Workers / Node.js)

```typescript
// GET /api/billing/subscription
export async function getSubscription(request: Request, env: Env) {
  // 1. Authenticate user from Bearer token
  const userId = await authenticateRequest(request);

  // 2. Query subscription from database
  const result = await env.DB.prepare(`
    SELECT
      id,
      account_id,
      stripe_subscription_id,
      stripe_customer_id,
      plan_type,
      status,
      current_period_start,
      current_period_end,
      created_at,
      updated_at
    FROM subscriptions
    WHERE account_id = ?
    LIMIT 1
  `).bind(userId).first();

  // 3. Handle no subscription found (new user)
  if (!result) {
    // Return default free tier
    return Response.json({
      id: crypto.randomUUID(),
      accountId: userId,
      stripeSubscriptionId: null,
      stripeCustomerId: null,
      tier: 'free',
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
      creditsRemaining: 10,
      lightRemaining: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  // 4. Get credits remaining from credit_balances table
  const credits = await env.DB.prepare(`
    SELECT credit_balance, light_analyses_balance
    FROM credit_balances
    WHERE account_id = ?
  `).bind(userId).first();

  // 5. Format response (map database fields to API format)
  return Response.json({
    id: result.id,
    accountId: result.account_id,
    stripeSubscriptionId: result.stripe_subscription_id,
    stripeCustomerId: result.stripe_customer_id,
    tier: result.plan_type,  // ⚠️ Map plan_type to tier
    status: result.status,
    currentPeriodStart: result.current_period_start,
    currentPeriodEnd: result.current_period_end,
    creditsRemaining: credits?.credit_balance ?? 0,
    lightRemaining: credits?.light_analyses_balance ?? 0,
    createdAt: result.created_at,
    updatedAt: result.updated_at
  });
}
```

---

## ⚠️ Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 403 Forbidden (Onboarding Incomplete)
```json
{
  "error": "Forbidden",
  "message": "Onboarding not completed"
}
```
*Frontend will handle this gracefully and default to 'free' tier*

### 404 Not Found (No Subscription)
```json
{
  "error": "Not Found",
  "message": "Subscription not found"
}
```
*Backend should return default free tier instead of 404*

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Failed to fetch subscription"
}
```

---

## 🔍 Frontend Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User logs in                                             │
│    AuthProvider sets isFullyReady = true                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. SubscriptionInitializer triggers                         │
│    GET /api/billing/subscription                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Backend returns JSON (camelCase)                         │
│    { tier: "growth", status: "active", ... }               │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Frontend maps to Zustand store (snake_case)             │
│    setSubscription({ plan_type: "growth", ... })           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Components read from store                               │
│    useSubscriptionPlan() → "growth"                         │
│    Sidebar shows: "Growth Plan"                             │
│    UpgradePage marks Growth card as "Current Plan"          │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Testing Checklist

### Backend Tests

- [ ] Endpoint returns 401 when no auth token provided
- [ ] Endpoint returns 200 with valid JWT token
- [ ] Response includes all required fields
- [ ] `tier` field correctly maps from database `plan_type`
- [ ] Response uses camelCase (not snake_case)
- [ ] Returns default free tier for new users
- [ ] Handles users with no subscription record
- [ ] Credits/light balances are accurate

### Integration Tests

- [ ] Frontend can fetch subscription on login
- [ ] Sidebar displays correct plan name
- [ ] UpgradePage shows correct "Current Plan" badge
- [ ] UpgradePage disables purchase button for current tier
- [ ] Free tier users see "Free Plan"
- [ ] Paid tier users see their actual plan
- [ ] Handles API errors gracefully (falls back to 'free')

---

## 🚀 Deployment Steps

1. **Database Migration (if needed)**
   - Ensure `subscriptions` table exists
   - Verify `plan_type` column has correct enum values
   - Add indexes: `account_id`, `stripe_subscription_id`

2. **Backend Deployment**
   - Implement `/api/billing/subscription` endpoint
   - Test with Postman/curl
   - Verify field mapping (plan_type → tier)

3. **Frontend Deployment**
   - Already implemented ✅
   - SubscriptionInitializer is live
   - Components updated to use Zustand store

4. **Verification**
   - Log in to app
   - Check browser DevTools → Network tab
   - Verify `/api/billing/subscription` returns 200 OK
   - Check Zustand DevTools for subscription data
   - Confirm Sidebar shows correct plan

---

## 📞 Questions?

If the backend doesn't exist yet, you'll need to:

1. Create the `/api/billing/subscription` endpoint
2. Query the `subscriptions` table
3. Map `plan_type` → `tier` in response
4. Use camelCase for JSON response fields

The frontend is **ready to go** and will work as soon as the backend endpoint is available.
