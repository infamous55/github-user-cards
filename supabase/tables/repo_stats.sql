create table
  public.repo_stats (
    id uuid not null default gen_random_uuid (),
    user_id uuid not null,
    enabled boolean not null default true,
    constraint repo_stats_pkey primary key (user_id),
    constraint repo_stats_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  ) tablespace pg_default;