-- Secure RPC Functions for Anonymous Portal Access

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
security definer
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
