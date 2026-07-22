create extension if not exists pgcrypto;

create table if not exists public.chat_feedback (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null unique,
  rating text not null check (rating in ('positive', 'negative')),
  comment text check (comment is null or char_length(comment) <= 500),
  trigger text not null default 'chat_close' check (trigger in ('chat_close', 'booking_complete', 'inquiry_complete')),
  page text not null check (char_length(page) between 1 and 240),
  user_message_count smallint not null check (user_message_count between 0 and 100),
  assistant_message_count smallint not null check (assistant_message_count between 0 and 100),
  last_assistant_message_id text check (last_assistant_message_id is null or char_length(last_assistant_message_id) <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chat_feedback_created_idx on public.chat_feedback (created_at desc);
create index if not exists chat_feedback_rating_created_idx on public.chat_feedback (rating, created_at desc);

create or replace function public.set_chat_feedback_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists chat_feedback_updated_at on public.chat_feedback;
create trigger chat_feedback_updated_at before update on public.chat_feedback
for each row execute function public.set_chat_feedback_updated_at();

alter table public.chat_feedback enable row level security;
revoke all on public.chat_feedback from anon, authenticated;
grant select, insert, update, delete on public.chat_feedback to service_role;
