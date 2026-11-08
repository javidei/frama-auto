-- FRAMA AUTO · Esquema independiente en Supabase compartido.
-- NO transforma coches ficticios en inventario real.
-- La primera cuenta de administrador debe asignarse a un usuario de auth.users verificado.
begin;

create schema if not exists frama_internal;
revoke all on schema frama_internal from public, anon;
grant usage on schema frama_internal to authenticated;

create table if not exists public.frama_user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('administrador','gestor')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.frama_vehicles (
  id uuid primary key default gen_random_uuid(),
  brand text not null check (length(trim(brand)) between 1 and 60),
  model text not null check (length(trim(model)) between 1 and 90),
  trim text,
  year integer check (year between 1900 and 2100),
  mileage integer check (mileage >= 0),
  price_cents bigint check (price_cents >= 0),
  power_cv integer check (power_cv >= 0),
  sale_state text not null default 'disponible'
    check (sale_state in ('disponible','reservado','vendido','en_importacion')),
  publication_state text not null default 'borrador'
    check (publication_state in ('borrador','publicado','archivado')),
  fuel text,
  transmission text,
  body text,
  color text,
  doors integer check (doors between 1 and 9),
  seats integer check (seats between 1 and 99),
  eco_label text,
  origin text,
  equipment text[] not null default '{}',
  description text,
  is_demo boolean not null default false,
  created_by uuid default auth.uid() references auth.users(id),
  updated_by uuid references auth.users(id),
  version integer not null default 1 check (version >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.frama_vehicle_photos (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.frama_vehicles(id) on delete cascade,
  storage_path text not null unique,
  photo_type text not null check (length(trim(photo_type)) between 1 and 80),
  description text,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists frama_one_cover_per_vehicle
  on public.frama_vehicle_photos(vehicle_id) where is_cover;
create index if not exists frama_vehicles_public_filter
  on public.frama_vehicles(publication_state, sale_state, updated_at desc);
create index if not exists frama_photos_order
  on public.frama_vehicle_photos(vehicle_id, sort_order, id);

create or replace function frama_internal.is_staff()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (
  select 1 from public.frama_user_roles r
  where r.user_id = (select auth.uid()) and r.active
  and r.role in ('administrador','gestor')
) $$;

create or replace function frama_internal.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (
  select 1 from public.frama_user_roles r
  where r.user_id = (select auth.uid()) and r.active
  and r.role = 'administrador'
) $$;

revoke all on function frama_internal.is_staff() from public, anon;
revoke all on function frama_internal.is_admin() from public, anon;
grant execute on function frama_internal.is_staff() to authenticated;
grant execute on function frama_internal.is_admin() to authenticated;

create or replace function frama_internal.touch_vehicle()
returns trigger language plpgsql security invoker set search_path = ''
as $$
begin
  new.version := old.version + 1;
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;
drop trigger if exists frama_vehicle_updated on public.frama_vehicles;
create trigger frama_vehicle_updated before update on public.frama_vehicles
for each row execute function frama_internal.touch_vehicle();

alter table public.frama_user_roles enable row level security;
alter table public.frama_vehicles enable row level security;
alter table public.frama_vehicle_photos enable row level security;

grant select on public.frama_user_roles to authenticated;
grant insert,update,delete on public.frama_user_roles to authenticated;
grant select on public.frama_vehicles to anon,authenticated;
grant insert,delete on public.frama_vehicles to authenticated;
grant update (
  brand,model,trim,year,mileage,price_cents,power_cv,sale_state,publication_state,
  fuel,transmission,body,color,doors,seats,eco_label,origin,equipment,description,is_demo
) on public.frama_vehicles to authenticated;
grant select on public.frama_vehicle_photos to anon,authenticated;
grant insert,delete on public.frama_vehicle_photos to authenticated;
grant update (photo_type,description,sort_order,is_cover) on public.frama_vehicle_photos to authenticated;

create policy frama_role_read on public.frama_user_roles for select to authenticated
using (user_id = (select auth.uid()) or (select frama_internal.is_admin()));
create policy frama_role_insert on public.frama_user_roles for insert to authenticated
with check ((select frama_internal.is_admin()));
create policy frama_role_update on public.frama_user_roles for update to authenticated
using ((select frama_internal.is_admin()))
with check ((select frama_internal.is_admin()));
create policy frama_role_delete on public.frama_user_roles for delete to authenticated
using ((select frama_internal.is_admin()));

create policy frama_vehicle_read on public.frama_vehicles for select to anon, authenticated
using (publication_state = 'publicado' or (select frama_internal.is_staff()));
create policy frama_vehicle_insert on public.frama_vehicles for insert to authenticated
with check ((select frama_internal.is_staff()) and created_by = (select auth.uid()));
create policy frama_vehicle_update on public.frama_vehicles for update to authenticated
using ((select frama_internal.is_staff()))
with check ((select frama_internal.is_staff()));
create policy frama_vehicle_delete on public.frama_vehicles for delete to authenticated
using ((select frama_internal.is_admin()));

create policy frama_photo_read on public.frama_vehicle_photos for select to anon,authenticated
using (exists (
  select 1 from public.frama_vehicles v where v.id = vehicle_id
    and (v.publication_state = 'publicado' or (select frama_internal.is_staff()))
));
create policy frama_photo_insert on public.frama_vehicle_photos for insert to authenticated
with check ((select frama_internal.is_staff()));
create policy frama_photo_update on public.frama_vehicle_photos for update to authenticated
using ((select frama_internal.is_staff()))
with check ((select frama_internal.is_staff()));
create policy frama_photo_delete on public.frama_vehicle_photos for delete to authenticated
using ((select frama_internal.is_staff()));

-- Fotos privadas: descargables únicamente con sesión/autorización o si el coche está publicado.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('frama-auto-vehiculos','frama-auto-vehiculos',false,12582912,array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy frama_storage_read on storage.objects for select to anon,authenticated
using (bucket_id = 'frama-auto-vehiculos' and exists (
  select 1 from public.frama_vehicles v
  where v.id::text = split_part(name,'/',1)
  and (v.publication_state = 'publicado' or (select frama_internal.is_staff()))
));
create policy frama_storage_insert on storage.objects for insert to authenticated
with check (bucket_id = 'frama-auto-vehiculos' and (select frama_internal.is_staff())
  and exists (select 1 from public.frama_vehicles v where v.id::text = split_part(name,'/',1)));
create policy frama_storage_update on storage.objects for update to authenticated
using (bucket_id = 'frama-auto-vehiculos' and (select frama_internal.is_staff()))
with check (bucket_id = 'frama-auto-vehiculos' and (select frama_internal.is_staff()));
create policy frama_storage_delete on storage.objects for delete to authenticated
using (bucket_id = 'frama-auto-vehiculos' and (select frama_internal.is_staff()));

commit;

-- Primero crear/invitar al usuario en Supabase Auth y verificar su identidad.
-- Después, asignarle administrador por id, no por coincidencias ambiguas:
-- insert into public.frama_user_roles(user_id,role)
-- values ('UUID-VERIFICADO-DE-TU-USUARIO-AUTH','administrador');
