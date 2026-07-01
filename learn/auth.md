now it is time to create auth guard for churnly and prevent users from using it unnecessarily.

so here we give two seperate access.
- API for technical clients
- dashboard for non-technical ones.

so here we build,
1. Supabase auth on the dashboard (signup/login)
2. API key generation tied to each user — for programmatic access

Soon — Dashboard already mostly exists (you built it). Just needs to be gated behind auth and connected to real history.
Later — Usage-based billing, rate limiting per API key, proper API documentation for technical clients.


#### one design question before we touch code: when a user signs up, should they immediately get API access, or do we want a manual approval step (common for early-stage products to control quality and prevent abuse)?

Recommended approach: Auto-approval with rate limiting, not manual approval.
Here's why — manual approval creates friction that kills signups, and at your stage you want to learn from real usage, not gatekeep. Instead, control abuse through:

- Rate limiting (e.g., 50 predictions/month on free tier)
- API key required for every request
- Usage tracking per user

*This is exactly how Stripe, OpenAI, and most API-first SaaS products work at launch.*



### The auth architecture we're building:

1. Supabase Auth — handles signup/login, email verification, password reset (built-in, you don't write this)
1. Supabase Database table — api_keys table: user_id, api_key, created_at, requests_used, requests_limit
3. FastAPI dependency — a function that checks the API key on every /predict request before processing
4. Frontend — dashboard shows the user's API key, usage stats, and lets them test predictions directly in UI


**when your backend receives a request, where should the API key be sent? Standard options:**

1. Header: `Authorization: Bearer YOUR_KEY`
2. Header: `X-API-Key: YOUR_KEY`
3. Query parameter: `?api_key=YOUR_KEY`

`Authorization` header is the answer, but the reason isn't that headers "drop" — it's about where the data ends up and gets logged.
Query parameters (`?api_key=YOUR_KEY`) get logged everywhere — server access logs, browser history, proxy logs, even shared accidentally when someone copies a URL to share a page. The key becomes part of the URL string, which travels through systems that weren't designed to handle secrets.

Headers aren't logged by default in most systems and don't appear in browser history or shared URLs. That's the real security difference.

Between `Authorization: Bearer` and `X-API-Key — Authorization`: Bearer is the actual industry standard (same pattern used by Stripe, OpenAI, GitHub). We'll use that.

## SQLAlchemy + Alembic
we will use Alembic with SQLAlchemy for controlling our cloud db. so we can simply upgrade and downgrade our db when we want

SQLAlchemy + Alembic gives us:

- Schema defined in Python — readable, reviewable, type-checked
- Every migration is a versioned file — you can roll back any change
- Works with Supabase because Supabase is just managed Postgres underneath — you connect via the standard Postgres connection string, completely bypassing Supabase's client library

