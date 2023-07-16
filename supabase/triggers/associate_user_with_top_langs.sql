create trigger associate_user_with_top_langs
  after insert on auth.users
  for each row execute procedure public.create_top_langs();