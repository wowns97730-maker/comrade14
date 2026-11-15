-- comrade 14 — 제품 저장소 설정
-- 제품 표, 관리자 목록, 사진 저장소, 권한 규칙을 만든다.
-- 누구나 제품을 볼 수 있고, admins 표에 등록된 계정만 등록·수정·삭제할 수 있다.

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;
create policy "admins can see themselves" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

create table public.products (
  id uuid primary key default gen_random_uuid(),
  no text not null unique,
  name text not null,
  status text not null default 'available'
    check (status in ('available', 'soldout', 'archive', 'upcoming')),
  price integer,
  material text not null default '',
  color text not null default '',
  sizes text[] not null default '{OS}',
  dims text,
  description text not null default '',
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;

create policy "anyone can read products" on public.products
  for select to anon, authenticated using (true);
create policy "admins insert products" on public.products
  for insert to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));
create policy "admins update products" on public.products
  for update to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));
create policy "admins delete products" on public.products
  for delete to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

-- 사진 저장소 (공개 읽기, 관리자만 쓰기)
insert into storage.buckets (id, name, public) values ('products', 'products', true);

create policy "admins upload product images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'products' and exists (select 1 from public.admins a where a.user_id = (select auth.uid())));
create policy "admins update product images" on storage.objects
  for update to authenticated
  using (bucket_id = 'products' and exists (select 1 from public.admins a where a.user_id = (select auth.uid())));
create policy "admins delete product images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'products' and exists (select 1 from public.admins a where a.user_id = (select auth.uid())));
