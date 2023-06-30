create trigger associate_user_with_github_pat
  after insert on auth.users
  for each row execute procedure public.create_github_pat();