create table
  public.github_pat (
    user_id uuid not null,
    token character varying not null default ''::character varying,
    constraint github_access_pkey primary key (user_id),
    constraint github_access_user_id_key unique (user_id),
    constraint github_pat_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  ) tablespace pg_default;