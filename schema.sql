-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Clients
create table if not exists clients (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text,
  company_name text,
  phone text,
  notes text,
  created_at timestamptz default now()
);

-- Projects
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete cascade not null,
  title text not null,
  description text,
  status text not null default 'draft',
  portal_token text not null unique,
  created_at timestamptz default now()
);

-- Project Contents (Fixed MVP Form)
create table if not exists project_contents (
  id uuid default gen_random_uuid() primary key,
  project_id uuid not null unique references public.projects(id) on delete cascade,
  business_name text,
  business_description text,
  about_text text,
  services text,
  phone text,
  email text,
  address text,
  instagram text,
  facebook text,
  linkedin text,
  updated_at timestamptz default now()
);

-- RLS Policies
alter table profiles enable row level security;
alter table clients enable row level security;
alter table projects enable row level security;
alter table project_contents enable row level security;

-- Profiles
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Clients
drop policy if exists "Users can view own clients" on clients;
create policy "Users can view own clients" on clients for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own clients" on clients;
create policy "Users can insert own clients" on clients for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own clients" on clients;
create policy "Users can update own clients" on clients for update using (auth.uid() = user_id);
drop policy if exists "Users can delete own clients" on clients;
create policy "Users can delete own clients" on clients for delete using (auth.uid() = user_id);

-- Projects
drop policy if exists "Users can view own projects" on projects;
create policy "Users can view own projects" on projects for select using (auth.uid() = user_id);
drop policy if exists "Public can view project by token" on projects;
create policy "Public can view project by token" on projects for select using (true);
drop policy if exists "Users can insert own projects" on projects;
create policy "Users can insert own projects" on projects for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own projects" on projects;
create policy "Users can update own projects" on projects for update using (auth.uid() = user_id);
drop policy if exists "Users can delete own projects" on projects;
create policy "Users can delete own projects" on projects for delete using (auth.uid() = user_id);

-- Project Contents
drop policy if exists "Users can view own project contents" on project_contents;
create policy "Users can view own project contents" on project_contents for select using (
  exists (select 1 from projects where projects.id = project_contents.project_id and projects.user_id = auth.uid())
);
-- Remove public RLS policies to prevent unrestricted access
drop policy if exists "Public can view project contents" on project_contents;
drop policy if exists "Public can insert project contents" on project_contents;
drop policy if exists "Public can update project contents" on project_contents;

-- Secure RPC Functions (Acts like a Serverless Route Handler)
-- 1. Fetch project, client, and content by token
-- SECURITY DEFINER allows it to bypass RLS as the owner
create or replace function get_portal_data(p_token text)
returns json
language plpgsql
security definer
as $$
declare
  v_project record;
  v_client record;
  v_content record;
begin
  -- Find project by token
  select * into v_project from projects where portal_token = p_token;
  
  if not found then
    return null;
  end if;

  -- Find client details
  select name, company_name into v_client from clients where id = v_project.client_id;

  -- Find project content
  select * into v_content from project_contents where project_id = v_project.id;

  return json_build_object(
    'id', v_project.id,
    'title', v_project.title,
    'description', v_project.description,
    'status', v_project.status,
    'client', v_client,
    'content', v_content
  );
end;
$$;

-- 2. Save project content securely and update status
create or replace function save_portal_content(
  p_token text,
  p_business_name text,
  p_business_description text,
  p_about_text text,
  p_services text,
  p_phone text,
  p_email text,
  p_address text,
  p_instagram text,
  p_facebook text,
  p_linkedin text
)
returns void
language plpgsql
security definer -- Bypasses RLS to act as a secure server-side function
as $$
declare
  v_project_id uuid;
begin
  -- Find project by token
  select id into v_project_id from projects where portal_token = p_token;
  
  if not found then
    raise exception 'Project not found or link is invalid.';
  end if;

  -- Upsert content
  insert into project_contents (
    project_id, business_name, business_description, about_text, services,
    phone, email, address, instagram, facebook, linkedin, updated_at
  ) values (
    v_project_id, p_business_name, p_business_description, p_about_text, p_services,
    p_phone, p_email, p_address, p_instagram, p_facebook, p_linkedin, now()
  )
  on conflict (project_id) do update set
    business_name = excluded.business_name,
    business_description = excluded.business_description,
    about_text = excluded.about_text,
    services = excluded.services,
    phone = excluded.phone,
    email = excluded.email,
    address = excluded.address,
    instagram = excluded.instagram,
    facebook = excluded.facebook,
    linkedin = excluded.linkedin,
    updated_at = now();

  -- CRITICAL: Update project status to 'completed' so agency knows content is ready
  update public.projects 
  set status = 'completed' 
  where id = v_project_id;
end;
$$;

-- Grant permissions to anonymous and authenticated users
grant execute on function get_portal_data(text) to anon, authenticated;
grant execute on function save_portal_content(text, text, text, text, text, text, text, text, text, text, text) to anon, authenticated;

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
