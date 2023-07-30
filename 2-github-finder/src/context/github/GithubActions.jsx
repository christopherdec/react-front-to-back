import axios from "axios";

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;

const github = axios.create({
    baseURL: GITHUB_URL,
    // headers: { Authorization: `token ${REACT_APP_GITHUB_TOKEN} }
})

export const searchUsers = async (text) => {

    const params = new URLSearchParams({
        q: text
    })

    const response = await github.get(`/search/users?${params}`)

    return  response.data.items
}

export const getUserAndRepos = async (login) => {

    const [userResponse, reposResponse] = await Promise.all([
        github.get(`/users/${login}`),
        github.get(`/users/${login}/repos`)
    ])

    return {
        user: userResponse.data,
        repos: reposResponse.data
    }
}
