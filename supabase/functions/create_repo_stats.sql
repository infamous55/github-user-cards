create function public.create_repo_stats()
returns trigger as $$
begin
  insert into public.repo_stats (user_id, enabled)
  values (new.id, false);
  return new;
end;
$$ language plpgsql security definer;