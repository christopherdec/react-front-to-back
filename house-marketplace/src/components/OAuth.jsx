import { signInWithPopup, GoogleAuthProvider, getAuth } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import googleIcon from '../assets/svg/googleIcon.svg'
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase.conf";
import { toast } from "react-toastify";

function OAuth() {

    const navigate = useNavigate()
    const location = useLocation()

    const onGoogleClick = async () => {
        console.log('Google clicked')
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            // check for user in db
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            if (!docSnap.exists()) {
                // create the user in the database
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
                navigate('/')
            }

        } catch (error) {
            toast.error('Failed to authorize with Google')
        }
    }

    return (
        <div className='socialLogin'>
            <p>
              Sign {location.pathname === '/sign-up' ? 'up' : 'in'}
            </p>
            <button className='socialIconDiv' onClick={onGoogleClick}>
                <img className='socialIconImg' src={googleIcon} alt='google' />
            </button>
        </div>
    )
}

export default OAuth
