-- FRAMA AUTO: ajustes editables de contacto y redes.
create table if not exists public.frama_contact_settings (
  id integer primary key default 1 check (id = 1),
  email text not null default 'javispot@gmail.com' check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  whatsapp text not null default '' check (whatsapp = '' or whatsapp ~ '^\+[1-9][0-9]{7,14}$'),
  instagram_url text not null default '' check (instagram_url = '' or instagram_url ~ '^https://(www\.)?instagram\.com/'),
  facebook_url text not null default '' check (facebook_url = '' or facebook_url ~ '^https://(www\.)?facebook\.com/'),
  updated_at timestamptz not null default now()
);
alter table public.frama_contact_settings enable row level security;
grant select on public.frama_contact_settings to anon, authenticated;
grant update on public.frama_contact_settings to authenticated;
drop policy if exists frama_contact_settings_public_read on public.frama_contact_settings;
create policy frama_contact_settings_public_read
  on public.frama_contact_settings for select to anon, authenticated using (true);
drop policy if exists frama_contact_settings_admin_update on public.frama_contact_settings;
create policy frama_contact_settings_admin_update
  on public.frama_contact_settings for update to authenticated
  using ((select frama_private.is_admin()))
  with check ((select frama_private.is_admin()));
insert into public.frama_contact_settings (id,email,instagram_url)
values (1,'javispot@gmail.com','https://www.instagram.com/p/DZ46npwiNPD/')
on conflict (id) do nothing;
