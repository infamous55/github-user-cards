import { Octokit } from '@octokit/core';

// TODO: Figure out how to cache the numbers or the image for short intervals
export async function generateRepoStats(pat: string) {
  const octokit = new Octokit({ auth: pat });

  let publicRepoCount = 0;
  let privateRepoCount = 0;
  let currentPage = 1;

  do {
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
  } while (publicRepoCount + privateRepoCount == (currentPage - 1) * 30);

  const totalRepoCount = publicRepoCount + privateRepoCount;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="302" height="137">
  <rect x="1" y="1" width="300" height="135" rx="6" ry="6" fill="#0D1117" stroke="#30363D" stroke-width="0.5" />
  <foreignObject width="300" height="135" x="1" y="1">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; position: relative; background: transparent; border-radius: 6px; overflow: hidden;">
      <div style="left: 20px; top: 20px; position: absolute; color: #E6EDF3; font-size: 17.50px; font-family: Segoe UI; font-weight: 600; line-height: 21.88px; word-wrap: break-word">User Statistics</div>
      <div style="left: 20px; top: 52px; position: absolute"><span style="color: #E6EDF3; font-size: 16px; font-family: Segoe UI; font-weight: 400; line-height: 21px; word-wrap: break-word">Total repository count: </span><span style="color: #E6EDF3; font-size: 16px; font-family: Segoe UI; font-weight: 600; line-height: 21px; word-wrap: break-word">${totalRepoCount}</span></div>
      <div style="left: 20px; top: 73px; position: absolute"><span style="color: #E6EDF3; font-size: 16px; font-family: Segoe UI; font-weight: 400; line-height: 21px; word-wrap: break-word">Public repository count: </span><span style="color: #E6EDF3; font-size: 16px; font-family: Segoe UI; font-weight: 600; line-height: 21px; word-wrap: break-word">${publicRepoCount}</span></div>
      <div style="left: 20px; top: 94px; position: absolute"><span style="color: #E6EDF3; font-size: 16px; font-family: Segoe UI; font-weight: 400; line-height: 21px; word-wrap: break-word">Private repository count: </span><span style="color: #E6EDF3; font-size: 16px; font-family: Segoe UI; font-weight: 600; line-height: 21px; word-wrap: break-word">${privateRepoCount}</span></div>
    </div>
  </foreignObject>
</svg>`;
}
