---
name: Margea Members loyalty program
description: Public loyalty program with signup (/members), sign in (/members/login), authenticated dashboard (/members/dashboard), and admin console (/admin/members) for activation and credits management
type: feature
---

## Routes
- `/members` — public landing + signup form (creates members row + auth account, sends welcome email)
- `/members/login` — Supabase Auth sign-in + password reset
- `/members/dashboard` — protected: shows profile card, status (pending/active), credits, locked benefits when pending
- `/admin/members` — protected by `user_roles` table (role = 'admin'). Lists all members with search, Activate button (pending→active), Add Credits input (active members)

## Database
- `members` table: first_name, last_name, email, phone, country, agreed_to_marketing, status (pending|active), credits_balance, user_id (linked to auth.users via `link_member_to_auth_user` trigger on auth.users insert)
- `user_roles` table with `app_role` enum ('admin'|'user') + `has_role(uuid, app_role)` security definer function
- RLS: members can SELECT/UPDATE own record; admins (via has_role) can SELECT/UPDATE all members

## Welcome email
- Edge function `send-member-welcome` sends branded HTML email via Resend connector (uses RESEND_API_KEY + LOVABLE_API_KEY through connector-gateway.lovable.dev/resend)
- Sender: `Margea Members <admin@margeatravel.com>` (must be verified in Resend)
- Subject: "Welcome to Margea Members 🌊"
- Triggered fire-and-forget after successful signup at /members

## Granting admin access
Insert into `user_roles` with the user's auth.uid() and role='admin'. There is no UI to grant admin — it's a manual DB operation by design.
