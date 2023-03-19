import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import Offers from "./pages/Offers";
import Explore from "./pages/Explore";
import ForgotPassword from "./pages/ForgotPassword";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
        <Router>
            <Routes>
                <Route path='/' element={<Explore />} />
                <Route path='/offers' element={<Offers />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/signin' element={<SignIn />} />
                <Route path='/singup' element={<SignUp />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
            </Routes>
            <Navbar />
        </Router>
    </>
  );
}

export default App;
