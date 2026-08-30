CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TYPE user_role AS ENUM ('ADMIN', 'DESIGNER');
CREATE TYPE record_status AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TABLE users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email VARCHAR(254) NOT NULL UNIQUE, password_hash TEXT NOT NULL, display_name VARCHAR(120) NOT NULL, role user_role NOT NULL, status record_status NOT NULL DEFAULT 'ACTIVE', last_login_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE activity_logs (id BIGSERIAL PRIMARY KEY, actor_user_id UUID REFERENCES users(id), action VARCHAR(100) NOT NULL, entity_type VARCHAR(80), entity_id VARCHAR(100), metadata JSONB NOT NULL DEFAULT '{}'::jsonb, ip_address INET, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX activity_logs_actor_idx ON activity_logs(actor_user_id, created_at DESC);
CREATE INDEX activity_logs_entity_idx ON activity_logs(entity_type, entity_id, created_at DESC);
