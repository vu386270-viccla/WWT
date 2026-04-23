-- ============================================================
-- VICC WWT Self-Assessment — Supabase Schema
-- ============================================================

-- SITES
create table public.sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,  -- 'long-an' | 'tay-ninh' | 'phan-thiet'
  color_hex text not null,    -- '#E30613' | '#F39200' | '#0072B5'
  created_at timestamptz default now()
);

insert into public.sites (name, code, color_hex) values
  ('Long An',    'long-an',    '#E30613'),
  ('Tây Ninh',   'tay-ninh',   '#F39200'),
  ('Phan Thiết', 'phan-thiet', '#0072B5');

-- PROFILES (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null check (role in ('operator', 'manager', 'admin')),
  site_id uuid references public.sites(id),  -- null = access all sites (manager/admin)
  created_at timestamptz default now()
);

-- KEA CATEGORIES (6 KEAs from Excel)
create table public.kea_categories (
  id serial primary key,
  code text not null unique,  -- 'I', 'II', ... 'VI'
  name_vi text not null,
  name_en text not null,
  weight numeric default 1.0
);

insert into public.kea_categories (code, name_vi, name_en) values
  ('I',   'Hệ thống quản lý & Trách nhiệm vận hành HTXLNT', 'Management System & WWT Operation Responsibility'),
  ('II',  'Vận hành thiết bị & Hoá chất', 'Equipment Operation & Chemicals'),
  ('III', 'An toàn, PPE & Kiểm tra định kỳ', 'Safety, PPE & Periodic Inspection'),
  ('IV',  'Giám sát chỉ tiêu nước thải & Ứng phó sự cố', 'Effluent Monitoring & Incident Response'),
  ('V',   'Hồ sơ, tài liệu & Đào tạo', 'Records, Documentation & Training'),
  ('VI',  'Hiệu suất, KPI & Cải tiến liên tục', 'Performance, KPIs & Continuous Improvement');

-- CHECKLIST ITEMS (55 questions from Excel)
create table public.checklist_items (
  id serial primary key,
  kea_id integer references public.kea_categories(id),
  code text not null unique,      -- 'I.1', 'II.3', etc.
  question_vi text not null,
  question_en text,
  guideline_vi text,
  guideline_en text,
  frequency text not null check (frequency in ('daily', 'monthly', 'both')),
  -- daily = operator checks every shift
  -- monthly = manager reviews once/month
  -- both = checked at both frequencies
  is_active boolean default true,
  sort_order integer
);

-- ASSESSMENTS (each submission)
create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id),
  assessor_id uuid not null references public.profiles(id),
  assessment_date date not null,
  assessment_type text not null check (assessment_type in ('daily', 'monthly')),
  shift text check (shift in ('1', '2', '3')),  -- only for daily
  status text not null default 'draft' check (status in ('draft', 'submitted', 'approved')),
  overall_score numeric,  -- calculated %
  manager_comment text,
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ASSESSMENT RESPONSES (individual answers)
create table public.assessment_responses (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  item_id integer not null references public.checklist_items(id),
  answer text check (answer in ('yes', 'no', 'na')),
  comment text,
  required_action text,
  deadline date,
  created_at timestamptz default now(),
  unique(assessment_id, item_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.sites enable row level security;
alter table public.profiles enable row level security;
alter table public.kea_categories enable row level security;
alter table public.checklist_items enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_responses enable row level security;

-- Helper: get current user role
create or replace function public.get_my_role()
returns text language sql security definer as $$
  select role from public.profiles where id = auth.uid()
$$;

-- Helper: get current user site_id
create or replace function public.get_my_site_id()
returns uuid language sql security definer as $$
  select site_id from public.profiles where id = auth.uid()
$$;

-- Sites: all authenticated users can view
create policy "sites_select" on public.sites for select to authenticated using (true);

-- Profiles: users can view own profile; managers/admins can view all
create policy "profiles_select_own" on public.profiles for select to authenticated
  using (id = auth.uid() or get_my_role() in ('manager', 'admin'));
create policy "profiles_insert_own" on public.profiles for insert to authenticated
  with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update to authenticated
  using (id = auth.uid() or get_my_role() = 'admin');

-- KEA and checklist items: all authenticated users can read
create policy "kea_select" on public.kea_categories for select to authenticated using (true);
create policy "items_select" on public.checklist_items for select to authenticated using (true);

-- Assessments: operators only see their own site; managers see all
create policy "assessments_select" on public.assessments for select to authenticated
  using (
    get_my_role() in ('manager', 'admin')
    or site_id = get_my_site_id()
  );
create policy "assessments_insert" on public.assessments for insert to authenticated
  with check (
    assessor_id = auth.uid()
    and (get_my_role() in ('manager', 'admin') or site_id = get_my_site_id())
  );
create policy "assessments_update" on public.assessments for update to authenticated
  using (
    assessor_id = auth.uid()
    or get_my_role() in ('manager', 'admin')
  );

-- Responses: same access as assessments
create policy "responses_select" on public.assessment_responses for select to authenticated
  using (
    exists (
      select 1 from public.assessments a
      where a.id = assessment_id
      and (get_my_role() in ('manager', 'admin') or a.site_id = get_my_site_id())
    )
  );
create policy "responses_insert" on public.assessment_responses for insert to authenticated
  with check (
    exists (
      select 1 from public.assessments a
      where a.id = assessment_id and a.assessor_id = auth.uid()
    )
  );
create policy "responses_update" on public.assessment_responses for update to authenticated
  using (
    exists (
      select 1 from public.assessments a
      where a.id = assessment_id
      and (a.assessor_id = auth.uid() or get_my_role() in ('manager', 'admin'))
    )
  );

-- ============================================================
-- USEFUL VIEWS
-- ============================================================

-- Score summary per assessment
create or replace view public.assessment_scores as
select
  a.id,
  a.site_id,
  s.name as site_name,
  s.code as site_code,
  s.color_hex,
  a.assessment_date,
  a.assessment_type,
  a.shift,
  a.status,
  p.full_name as assessor_name,
  count(r.id) filter (where r.answer = 'yes') as yes_count,
  count(r.id) filter (where r.answer = 'no') as no_count,
  count(r.id) as total_answered,
  round(
    count(r.id) filter (where r.answer = 'yes')::numeric
    / nullif(count(r.id) filter (where r.answer in ('yes','no')), 0) * 100,
    1
  ) as score_pct
from public.assessments a
join public.sites s on s.id = a.site_id
join public.profiles p on p.id = a.assessor_id
left join public.assessment_responses r on r.assessment_id = a.id
group by a.id, s.id, p.id;

-- Open CAPAs (non-conformities with required action and deadline)
create or replace view public.open_capas as
select
  r.id,
  a.site_id,
  s.name as site_name,
  s.color_hex,
  ci.code as item_code,
  ci.question_vi,
  r.required_action,
  r.deadline,
  a.assessment_date,
  p.full_name as assessor_name
from public.assessment_responses r
join public.assessments a on a.id = r.assessment_id
join public.sites s on s.id = a.site_id
join public.checklist_items ci on ci.id = r.item_id
join public.profiles p on p.id = a.assessor_id
where r.answer = 'no'
  and r.required_action is not null
  and r.deadline >= current_date;
