CREATE TABLE clients (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), client_code VARCHAR(30) NOT NULL UNIQUE, client_name VARCHAR(120) NOT NULL, company_name VARCHAR(160), phone VARCHAR(30), whatsapp VARCHAR(30), email VARCHAR(254), address TEXT, city VARCHAR(100), state VARCHAR(100), postal_code VARCHAR(20), notes TEXT, status record_status NOT NULL DEFAULT 'ACTIVE', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX clients_name_idx ON clients(LOWER(client_name));
CREATE INDEX clients_company_idx ON clients(LOWER(company_name));
CREATE INDEX clients_status_idx ON clients(status, updated_at DESC);
CREATE SEQUENCE clients_code_seq START 1001;
