create table
  public.top_langs (
    id uuid not null default gen_random_uuid (),
    user_id uuid not null,
    enabled boolean not null default false,
    constraint top_langs_pkey primary key (id),
    constraint top_langs_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  ) tablespace pg_default;