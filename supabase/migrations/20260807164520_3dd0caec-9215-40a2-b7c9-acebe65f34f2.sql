-- 1. Enums
create type public.property_type as enum ('apartment', 'house', 'studio', 'kitnet');
create type public.apartment_status as enum ('available', 'rented', 'pending', 'inactive');
create type public.user_role as enum ('tenant', 'owner', 'admin');
create type public.verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
create type public.notification_kind as enum ('proposal_received', 'proposal_accepted', 'proposal_rejected', 'message_received', 'kyc_update', 'system');
create type public.proposal_status as enum ('pending', 'accepted', 'rejected', 'canceled');

-- 2. Profiles
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  name text not null,
  email text,
  phone text,
  avatar_url text,
  avatar_path text,
  role public.user_role not null default 'tenant',
  score integer default 850,
  score_factors jsonb default '[]'::jsonb,
  verified boolean default false,
  verification public.verification_status default 'unverified',
  member_since timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

grant select, insert, update on public.profiles to authenticated;
grant select on public.profiles to anon;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);
create policy "Users can update own profile" on public.profiles
  for update to authenticated using (auth_user_id = auth.uid());

-- 3. Neighborhoods
create table public.neighborhoods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  city text not null,
  state text not null,
  average_rent numeric(10,2) default 0,
  highlights text[] default '{}',
  created_at timestamptz default now()
);

grant select on public.neighborhoods to authenticated, anon;
grant all on public.neighborhoods to service_role;
alter table public.neighborhoods enable row level security;

create policy "Neighborhoods are viewable by everyone" on public.neighborhoods
  for select using (true);

-- 4. Apartments
create table public.apartments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) not null,
  neighborhood_id uuid references public.neighborhoods(id),
  title text not null,
  slug text not null unique,
  description text,
  property_type public.property_type not null default 'apartment',
  status public.apartment_status not null default 'available',
  rent numeric(10,2) not null,
  condo_fee numeric(10,2) default 0,
  iptu numeric(10,2) default 0,
  area_m2 integer not null,
  bedrooms integer not null default 1,
  bathrooms integer not null default 1,
  parking_spots integer default 0,
  floor integer,
  furnished boolean default false,
  pet_friendly boolean default false,
  amenities text[] default '{}',
  street text not null,
  number text,
  zip_code text,
  city text not null,
  state text not null,
  metro_distance_m integer,
  published boolean default true,
  rating numeric(3,2) default 5.00,
  reviews_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

grant select on public.apartments to authenticated, anon;
grant insert, update, delete on public.apartments to authenticated;
grant all on public.apartments to service_role;
alter table public.apartments enable row level security;

create policy "Apartments are viewable by everyone" on public.apartments
  for select using (published = true);
create policy "Owners can manage own apartments" on public.apartments
  for all to authenticated using (
    owner_id in (select id from public.profiles where auth_user_id = auth.uid())
  );

-- 5. Apartment Images
create table public.apartment_images (
  id uuid primary key default gen_random_uuid(),
  apartment_id uuid references public.apartments(id) on delete cascade not null,
  storage_path text,
  external_url text,
  alt text,
  position integer default 0,
  width integer,
  height integer,
  created_at timestamptz default now()
);

grant select on public.apartment_images to authenticated, anon;
grant all on public.apartment_images to service_role;
alter table public.apartment_images enable row level security;

create policy "Images are viewable by everyone" on public.apartment_images
  for select using (true);

-- 6. Favorites
create table public.favorites (
  profile_id uuid references public.profiles(id) on delete cascade not null,
  apartment_id uuid references public.apartments(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (profile_id, apartment_id)
);

grant select, insert, delete on public.favorites to authenticated;
grant all on public.favorites to service_role;
alter table public.favorites enable row level security;

create policy "Users can manage own favorites" on public.favorites
  for all to authenticated using (
    profile_id in (select id from public.profiles where auth_user_id = auth.uid())
  );

-- 7. Seed initial data
insert into public.neighborhoods (name, slug, city, state, average_rent, highlights)
values 
('Savassi', 'savassi', 'Belo Horizonte', 'MG', 2800.00, ARRAY['Perto do Metrô', 'Vida Noturna', 'Gastronomia']),
('Vila Mariana', 'vila-mariana', 'São Paulo', 'SP', 3500.00, ARRAY['Perto do Metrô', 'Parque Ibirapuera', 'Universidades']),
('Botafogo', 'botafogo', 'Rio de Janeiro', 'RJ', 3800.00, ARRAY['Vista para o Mar', 'Perto do Metrô', 'Comércio']);

insert into public.profiles (name, email, role, score, verified)
values ('Proprietário Exemplo', 'proprietario@exemplo.com', 'owner', 900, true);

insert into public.apartments (owner_id, neighborhood_id, title, slug, description, rent, area_m2, bedrooms, bathrooms, city, state, street)
select p.id, n.id, 'Kitnet Mobiliada na Savassi', 'kitnet-mobiliada-savassi', 'Kitnet charmosa e completa no coração da Savassi.', 2200.00, 35, 1, 1, 'Belo Horizonte', 'MG', 'Rua Sergipe'
from public.profiles p, public.neighborhoods n
where p.email = 'proprietario@exemplo.com' and n.slug = 'savassi'
limit 1;
