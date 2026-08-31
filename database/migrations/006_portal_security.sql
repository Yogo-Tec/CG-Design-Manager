ALTER TABLE portal_tokens ADD COLUMN proof_id UUID REFERENCES proofs(id);
ALTER TABLE portal_tokens ADD COLUMN created_by UUID REFERENCES users(id);
CREATE INDEX portal_tokens_active_idx ON portal_tokens(token_hash,expires_at) WHERE revoked_at IS NULL;
