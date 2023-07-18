<h1 align="center">
  <br />
  <a href="https://github-user-cards.infamous55.com/" target="_blank">
    <img src="https://raw.githubusercontent.com/infamous55/github-user-cards/master/public/logo.png" width="80" height="80" alt="Logo" />
  </a>
  <br />
  GitHub User Cards
  <br />
</h1>

<p align="center">
  Create minimalistic images with repository statistics for your profile readme.
</p>

<p align="center">
  <a href="#about">About</a> •
  <a href="#to-do">To Do</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## About

Authentication is performed using GitHub OAuth 2.0. Users are required to provide a [fine-grained personal access token](https://github.blog/2022-10-18-introducing-fine-grained-personal-access-tokens-for-github/), which will be utilized to send requests to the GitHub API and count repositories. The image badges' links can be regenerated, and they can also be enabled or disabled.

This is how the SVGs look like:

![Example Repository Statistics](https://github-user-cards.infamous55.com/repo-stats/5894ae33-7c55-4bcf-8df5-5bf24d7261c8)

![Example Top Languages](https://github-user-cards.infamous55.com/top-langs/b8484563-5acd-490d-b7d9-2fc9257f1370)

The project was built using [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [Supabase](https://supabase.com/).

## To Do

- [x] ~~Add support for caching (up to 24 hours)~~
- [x] ~~Add a language count image badge~~

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

Distributed under the GNU General Public License v3.0. See `LICENSE` for more information.
