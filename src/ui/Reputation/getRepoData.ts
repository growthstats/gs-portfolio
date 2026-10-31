import { Octokit } from 'octokit'
import { stegaClean } from 'next-sanity'
import { unstable_cache } from 'next/cache'

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN!,
})

export async function getRepoData(reputation?: Sanity.Reputation) {
  if (!reputation) return {}

  const [owner, repo] = stegaClean(reputation.repo)?.split('/') ?? []
  const limit = Number(stegaClean(reputation.limit)) || 5

  try {
    // get stargazers total count
    const { data: { stargazers_count = 0, forks_count = 0 } = {} } = await octokit.rest.repos
      .get({ owner, repo })
      .catch(() => ({ data: { stargazers_count: 0, forks_count: 0 } }))

    // get stargazers avatars
    let page = Math.ceil(stargazers_count / limit)
    let avatars: { avatar_url: string; login: string }[] = []

    while (avatars.length < limit && page > 0) {
      const { data } = await octokit
        .request('GET /repos/{owner}/{repo}/stargazers', {
          owner,
          repo,
          per_page: limit,
          page,
        })
        .catch(() => ({ data: [] }))

      // the endpoint returns stargazer objects (with `user`) when asked for timestamps
      const users = data.map((item) => ('user' in item ? item.user : item))
      avatars = [
        ...users.flatMap((user) =>
          user ? [{ avatar_url: user.avatar_url, login: user.login }] : [],
        ),
        ...avatars,
      ]
      page--
    }

    return {
      stargazers_count,
      forks_count,
      avatars: avatars.reverse().slice(0, limit),
    }
  } catch (e) {
    console.error(e)
    return {}
  }
}

export const getCachedRepoData = unstable_cache(getRepoData, ['repo-data'], {
  revalidate: 3600, // 1 hour
})
