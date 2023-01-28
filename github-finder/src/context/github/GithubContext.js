import { createContext, useState } from "react";


const GithubContext = createContext();

const REACT_APP_GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
// const REACT_APP_GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({children}) => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        setLoading(true)
        const response = await fetch(`${REACT_APP_GITHUB_URL}/users`,
            // {
            //     headers: {
            //         Authorization: `token ${REACT_APP_GITHUB_TOKEN}`
            //     }}
        )
        const data = await response.json()
        setUsers(data)
        setLoading(false)
    }

    return <GithubContext.Provider value={{ users, loading, fetchUsers }}>
        {children}
    </GithubContext.Provider>
}

export default GithubContext;