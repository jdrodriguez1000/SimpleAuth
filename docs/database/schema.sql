-- PROYECTO: SimpleAuth - Database Schema Source of Truth (PostgreSQL 16)
-- Versión: 1.5.0
-- Última Actualización: 2026-04-01

-- ==========================================
-- 1. Definición de Tipos Nativos (ENUMs)
-- ==========================================

CREATE TYPE user_status AS ENUM ('Pending', 'Active', 'Inactive');
CREATE TYPE gender_type AS ENUM ('Masculino', 'Femenino', 'Otro');
CREATE TYPE country_type AS ENUM ('CO', 'US', 'CA', 'MX', 'VE', 'Other');
CREATE TYPE auth_token_type AS ENUM ('Verification', 'Reset');

-- ==========================================
-- 2. Tablas Principales (Persistencia)
-- ==========================================

-- Tabla: users
CREATE TABLE IF NOT EXISTS public.users (
    id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email                VARCHAR     UNIQUE NOT NULL,
    password_hash        VARCHAR     NOT NULL,
    first_name           VARCHAR     NOT NULL,
    last_name            VARCHAR     NOT NULL,
    birth_date           DATE        NOT NULL CHECK (birth_date <= CURRENT_DATE - INTERVAL '18 years'),
    gender               gender_type NOT NULL,
    country              country_type NOT NULL,
    status               user_status DEFAULT 'Pending',
    created_at           TIMESTAMPTZ DEFAULT NOW(),
    password_changed_at  TIMESTAMPTZ DEFAULT NOW(),
    last_login_at        TIMESTAMPTZ,
    deleted_at           TIMESTAMPTZ -- Inicio de ventana GDPR (30 días)
);

-- Tabla: auth_locks (Rate Limiting)
CREATE TABLE IF NOT EXISTS public.auth_locks (
    id                   SERIAL      PRIMARY KEY,
    identifier           VARCHAR     UNIQUE NOT NULL, -- Formato ip:email o ip:global
    attempts             INTEGER     DEFAULT 0,
    locked_until         TIMESTAMPTZ
);

-- Tabla: token_denylist (Revocación de JWT)
CREATE TABLE IF NOT EXISTS public.token_denylist (
    jti                  VARCHAR     PRIMARY KEY,
    user_id              UUID        REFERENCES public.users(id),
    revoked_at           TIMESTAMPTZ,
    expires_at           TIMESTAMPTZ NOT NULL
);

-- Tabla: auth_tokens (OTP Verification & Reset)
CREATE TABLE IF NOT EXISTS public.auth_tokens (
    id                   SERIAL      PRIMARY KEY,
    user_id              UUID        REFERENCES public.users(id),
    token_hash           VARCHAR     UNIQUE NOT NULL,
    type                 auth_token_type NOT NULL,
    expires_at           TIMESTAMPTZ NOT NULL,
    used_at              TIMESTAMPTZ
);

-- ==========================================
-- 3. Índices de Performance
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_token_denylist_user_id ON public.token_denylist(user_id);
CREATE INDEX IF NOT EXISTS idx_token_denylist_expires_at ON public.token_denylist(expires_at);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_user_id ON public.auth_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_token_hash ON public.auth_tokens(token_hash);

-- ==========================================
-- 4. Notas de Implementación (Alembic)
-- ==========================================
-- Toda alteración a este esquema debe realizarse mediante migraciones versionadas.
-- Las restricciones CHECK y los tipos ENUM nativos deben ser respetados por SQLModel.
