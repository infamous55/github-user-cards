import { graphql } from '@octokit/graphql';

type RepoQueryResponse = {
  viewer: {
    publicRepos: {
      totalCount: number;
    };
    privateRepos: {
      totalCount: number;
    };
  };
};

export async function generateRepoStats(pat: string) {
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `Bearer ${pat}`,
    },
  });

  const repoQueryResponse: RepoQueryResponse = await graphqlWithAuth(
    `
      query {
        viewer {
          privateRepos: repositories(first: 1, privacy: PRIVATE) {
            totalCount
          }
          publicRepos: repositories(first: 1, privacy: PUBLIC) {
            totalCount
          }
        }
      }
    `
  );

  const privateRepoCount = repoQueryResponse.viewer.privateRepos.totalCount;
  const publicRepoCount = repoQueryResponse.viewer.publicRepos.totalCount;
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
