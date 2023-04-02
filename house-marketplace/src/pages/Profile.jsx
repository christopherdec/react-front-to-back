import { getAuth } from 'firebase/auth'
import { useEffect, useState } from "react";

function Profile() {

    const auth = getAuth()

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const [user, setUser] = useState(null)

    useEffect(() => {
        console.log('Profile: currentUser:', auth.currentUser)
        setUser(auth.currentUser)
    }, [])

    return (
        <h1>{user ? user.displayName : 'Not logged in'}</h1>
    )
}

export default Profile