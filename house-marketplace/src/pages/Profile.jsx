import { getAuth, updateProfile } from 'firebase/auth'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.conf";
import { toast } from "react-toastify";
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

function Profile() {

    const navigate = useNavigate()

    const [changeDetails, setChangeDetails] = useState(false)

    const auth = getAuth()

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const { name, email } = formData

    const onLogout = () => {
        auth.signOut()
        navigate('/')
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const onSubmit = async () => {
        console.log('Attempting to submit')
        try {
            if (auth.currentUser.displayName !== name) {
                // update display name in firebase
                await updateProfile(auth.currentUser, {
                    displayName: name
                })

                // update in firestore
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name
                })
            }
        } catch (error) {
            console.log(error)
            toast.error('Failed to update profile details')
        }
    }

    return (
        <div className='profile'>
            <div className='profileHeader'>
                <p className='pageHeader'>
                    My Profile
                </p>
                <button className='logOut' type='button' onClick={onLogout}>
                    Logout
                </button>
            </div>
            <main>
                <div className='profileDetailsHeader'>
                    <p className='profileDetails'>
                        Personal Details
                    </p>
                    <p className='changePersonalDetails' onClick={() => {
                        changeDetails && onSubmit();
                        setChangeDetails((prevState) => !prevState)
                    }}>
                        {changeDetails ? 'done' : 'change'}
                    </p>
                </div>
                <div className='profileCard'>
                    <form>
                        <input
                            type='text'
                            id='name'
                            className={!changeDetails ? 'profileName' : 'profileNameActive'}
                            disabled={!changeDetails}
                            value={name}
                            onChange={onChange}
                        />
                        <input
                            type='text'
                            id='email'
                            className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                            disabled={!changeDetails}
                            value={email}
                            onChange={onChange}
                        />
                    </form>
                </div>
                <Link to='/create-listing' className='createListing'>
                    <img src={homeIcon} alt='home'/>
                    <p>Vender ou alugar imóvel</p>
                    <img src={arrowRight} alt='arrow right'/>
                </Link>
            </main>
        </div>
    )
}

export default Profile