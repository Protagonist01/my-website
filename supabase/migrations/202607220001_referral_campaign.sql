create extension if not exists pgcrypto;

create table if not exists public.referral_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null unique,
  country text not null,
  promotion_plan text not null,
  referral_code text not null unique,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.referral_clicks (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.referral_profiles(id) on delete cascade,
  referral_code text not null,
  landing_page text not null,
  visitor_key text not null,
  user_agent_hash text,
  created_at timestamptz not null default now()
);

create table if not exists public.referral_leads (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.referral_profiles(id) on delete restrict,
  referral_code text not null,
  prospect_name text not null,
  prospect_email text not null,
  opportunity_type text not null default 'unclassified' check (opportunity_type in ('unclassified', 'gig', 'contract', 'employment')),
  source text not null,
  description text,
  status text not null default 'new' check (status in ('new', 'qualified', 'won', 'lost', 'duplicate', 'existing')),
  first_payment_amount numeric(14, 2),
  first_payment_currency text,
  first_payment_cleared_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists referral_leads_prospect_email_unique
  on public.referral_leads (lower(prospect_email));

create table if not exists public.referral_commissions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null unique references public.referral_leads(id) on delete restrict,
  referrer_id uuid not null references public.referral_profiles(id) on delete restrict,
  opportunity_type text not null,
  rate numeric(5, 4) not null,
  amount numeric(14, 2) not null,
  currency text not null,
  status text not null default 'clearance' check (status in ('clearance', 'payable', 'paid', 'cancelled')),
  clearance_at timestamptz not null,
  paid_at timestamptz,
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.referral_payout_methods (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null unique references public.referral_profiles(id) on delete cascade,
  method_type text not null check (method_type in ('bank', 'crypto')),
  display_label text not null,
  details jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists referral_clicks_referrer_created_idx on public.referral_clicks (referrer_id, created_at desc);
create index if not exists referral_leads_referrer_created_idx on public.referral_leads (referrer_id, created_at desc);
create index if not exists referral_commissions_referrer_created_idx on public.referral_commissions (referrer_id, created_at desc);

create or replace function public.set_referral_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  if tg_table_name = 'referral_profiles' and new.status = 'approved' and old.status is distinct from 'approved' then
    new.approved_at = coalesce(new.approved_at, now());
  end if;
  return new;
end;
$$;

drop trigger if exists referral_profiles_updated_at on public.referral_profiles;
create trigger referral_profiles_updated_at before update on public.referral_profiles
for each row execute function public.set_referral_updated_at();

drop trigger if exists referral_leads_updated_at on public.referral_leads;
create trigger referral_leads_updated_at before update on public.referral_leads
for each row execute function public.set_referral_updated_at();

drop trigger if exists referral_commissions_updated_at on public.referral_commissions;
create trigger referral_commissions_updated_at before update on public.referral_commissions
for each row execute function public.set_referral_updated_at();

drop trigger if exists referral_payout_methods_updated_at on public.referral_payout_methods;
create trigger referral_payout_methods_updated_at before update on public.referral_payout_methods
for each row execute function public.set_referral_updated_at();

create or replace function public.create_referral_commission()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  commission_rate numeric(5, 4);
begin
  if new.status = 'won'
    and new.first_payment_amount is not null
    and new.first_payment_amount > 0
    and new.first_payment_currency is not null
    and new.first_payment_cleared_at is not null
  then
    commission_rate := case when new.opportunity_type = 'employment' then 0.05 else 0.10 end;
    insert into public.referral_commissions (
      lead_id,
      referrer_id,
      opportunity_type,
      rate,
      amount,
      currency,
      clearance_at
    ) values (
      new.id,
      new.referrer_id,
      new.opportunity_type,
      commission_rate,
      round(new.first_payment_amount * commission_rate, 2),
      upper(new.first_payment_currency),
      new.first_payment_cleared_at + interval '14 days'
    ) on conflict (lead_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists referral_lead_commission on public.referral_leads;
create trigger referral_lead_commission after insert or update on public.referral_leads
for each row execute function public.create_referral_commission();

alter table public.referral_profiles enable row level security;
alter table public.referral_clicks enable row level security;
alter table public.referral_leads enable row level security;
alter table public.referral_commissions enable row level security;
alter table public.referral_payout_methods enable row level security;

revoke all on public.referral_profiles from anon, authenticated;
revoke all on public.referral_clicks from anon, authenticated;
revoke all on public.referral_leads from anon, authenticated;
revoke all on public.referral_commissions from anon, authenticated;
revoke all on public.referral_payout_methods from anon, authenticated;

grant select, insert, update, delete on public.referral_profiles to service_role;
grant select, insert, update, delete on public.referral_clicks to service_role;
grant select, insert, update, delete on public.referral_leads to service_role;
grant select, insert, update, delete on public.referral_commissions to service_role;
grant select, insert, update, delete on public.referral_payout_methods to service_role;

