-- FRAMA AUTO · PROPUESTA DE ESQUEMA PostgreSQL, NO desplegada en esta demo.
-- Cada cambio futuro requiere autenticación, autorización en backend, validación y auditoría.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_subject TEXT NOT NULL UNIQUE, -- ID del proveedor de identidad, NUNCA una contraseña
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer','editor','admin')),
  disabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  year INTEGER CHECK (year BETWEEN 1950 AND 2100),
  mileage_km INTEGER CHECK (mileage_km >= 0),
  price_eur NUMERIC(12,2) CHECK (price_eur >= 0),
  fuel TEXT, gearbox TEXT, body_type TEXT, color TEXT,
  technical_specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  equipment JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','sold','archived')),
  created_by UUID REFERENCES app_users(id),
  updated_by UUID REFERENCES app_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE vehicle_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  view_type TEXT NOT NULL CHECK (view_type IN ('main','front','rear','left','right','interior','wheel','other')),
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX vehicle_photos_vehicle_position ON vehicle_photos(vehicle_id, position);
CREATE INDEX vehicles_status_brand ON vehicles(status, brand);

CREATE TABLE audit_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id UUID REFERENCES app_users(id),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  operation TEXT NOT NULL CHECK (operation IN ('create','update','publish','unpublish','delete','upload','login')),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  happened_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- El backend debe exigir sesiones autenticadas y permisos:
-- viewer: lectura de vehículos publicados (sin escritura).
-- editor: crear/editar borradores y subir fotos; publicar según política acordada.
-- admin: publicar/retirar/eliminar y administrar usuarios y roles.
-- Prohibido confiar en un role almacenado en localStorage o enviado por el navegador.
-- Si se emplea Supabase, añadir políticas RLS específicas antes de producción.
