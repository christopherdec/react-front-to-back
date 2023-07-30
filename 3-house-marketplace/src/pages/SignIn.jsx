import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

function SignIn() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const {email, password} = formData

    const navigate = useNavigate()

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const auth = getAuth()

            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            // logging for test purposes
            console.log('userCredential:', userCredential)

            if (userCredential.user) navigate('/')

        } catch (error) {
            console.log(error)
            toast.error('Bad user credentials')
        }
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Welcome Back!</p>
                </header>
                <form onSubmit={onSubmit}>
                    <input
                        id="email"
                        type="email"
                        className="emailInput"
                        placeholder="Email"
                        value={email}
                        onChange={onChange}
                    />
                    <div className="passwordInputDiv">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="passwordInput"
                            placeholder="Password"
                            value={password}
                            onChange={onChange}
                        />
                        <img src={visibilityIcon} alt="show password" className="showPassword"
                             onClick={() => setShowPassword((prevState) => !prevState)}/>
                    </div>
                    <Link to='/forgot-password' className='forgotPasswordLink'>
                        Forgot Password
                    </Link>
                    <div className="signInBar">
                        <p className="signInText">Sign In</p>
                        <button className="signInButton">
                            <ArrowRightIcon fill="#ffffff" width="34px" height="34px"/>
                        </button>
                    </div>
                </form>
                <OAuth />
                <Link to="/sign-up" className="registerLink">
                    Sign Up Instead
                </Link>
            </div>
        </>
    )
}

export default SignIn