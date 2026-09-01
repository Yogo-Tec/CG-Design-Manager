# Supabase production setup

CGDM uses Supabase Auth for identity and PostgreSQL for application data. Secrets belong only in the ignored local `.env` or the deployment platform's secret manager.

## Required environment values

Copy `.env.example` to `.env` and configure `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DATABASE_URL`, and a long random `SESSION_SECRET`. Use the project root URL for `SUPABASE_URL`; do not append `/rest/v1/`. URL-encode special characters in the database password.

The public Supabase root certificate is included at `certs/prod-ca-2021.crt`. Set `DATABASE_SSL_CA_PATH` to that file. CGDM verifies the certificate and hostname rather than disabling TLS verification.

If the direct Supabase database hostname is IPv6-only on your network, keep `DATABASE_URL` as the credential source and set `DATABASE_HOST`, `DATABASE_PORT`, and `DATABASE_USER` to the values shown by Supabase under **Connect → Session pooler**. These optional overrides let CGDM use the IPv4-compatible pooler without duplicating the password.

For local UI work only, `LOCAL_AUTH_BYPASS=true` supplies a development administrator and synchronizes that identity with the application database. The bypass is ignored whenever `NODE_ENV=production`; leave it `false` in every deployed environment.

## Initialize the database

Run `npm run db:migrate`. The migration runner records every applied file in `schema_migrations` and safely skips completed migrations.

## Create the first administrator

Create the user in Supabase Authentication, then run `npm run user:make-admin -- user@example.com`. This assigns the authorization role in trusted `app_metadata`. CGDM intentionally ignores roles stored in user-editable metadata. Users without trusted Admin metadata receive the Designer role.

## Verify production dependencies

Run `npm run verify:production`. It checks required configuration, the live Supabase Auth endpoint, PostgreSQL connectivity, and migration completion without printing credentials.

Rotate any credential shared in messages or logs before production use.
