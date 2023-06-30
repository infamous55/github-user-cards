create trigger associate_user_with_repo_stats
  after insert on auth.users
  for each row execute procedure public.create_repo_stats();