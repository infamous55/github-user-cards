create function public.create_github_pat()
returns trigger as $$
begin
  insert into public.github_pat (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;