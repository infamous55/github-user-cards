create function public.create_top_langs()
returns trigger as $$
begin
  insert into public.top_langs (user_id, enabled)
  values (new.id, false);
  return new;
end;
$$ language plpgsql security definer;