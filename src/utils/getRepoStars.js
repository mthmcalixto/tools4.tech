export default async function getRepoStars(owner, repo) {
  const query = `
    query {
      repository(owner: "${owner}", name: "${repo}") {
        stargazers {
          totalCount
        }
      }
    }
  `

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  })

  const data = await response.json()
  return data.data.repository.stargazers.totalCount
}
