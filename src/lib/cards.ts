import { Octokit } from '@octokit/core';

// TODO: Figure out how to cache the numbers for short intervals
export async function generateRepoStats(pat: string) {
  const octokit = new Octokit({ auth: pat });

  let publicRepoCount = 0;
  let privateRepoCount = 0;
  let currentPage = 1;

  do {
    try {
      const response = await octokit.request('GET /user/repos', {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
        page: currentPage,
      });

      if (response.status != 200)
        throw new Error('Invalid personal access token');

      response.data.forEach((repo) => {
        if (repo.private) privateRepoCount++;
        else publicRepoCount++;
      });
      currentPage++;
    } catch {
      return 'Oops'; // Handle await failed
    }
  } while (publicRepoCount + privateRepoCount == (currentPage - 1) * 30);

  const totalRepoCount = publicRepoCount + privateRepoCount;

  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <style>
      div {
        color: black;
        font: 12px serif;
        height: 100%;
        width: 100%;
        overflow: hidden;
      }
    </style>
    <foreignObject x="0" y="0" width="200" height="200">
      <div xmlns="http://www.w3.org/1999/xhtml">
        <p>Public repositories: ${publicRepoCount}</p>
        <p>Private repositories: ${privateRepoCount}</p>
        <p>Total repositories: ${totalRepoCount}</p>
      </div>
    </foreignObject>
  </svg>`;
}
