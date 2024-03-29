import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { GithubProvider } from "./context/github/GithubContext";
import { AlertProvider } from "./context/alert/AlertContext";
import Alert from "./components/layout/Alert";
import User from "./pages/User";

function App() {
  return (
    <AlertProvider>
      <GithubProvider>
        <Router>
          <div className='flex flex-col justify-between h-screen'>
            <Navbar title='GitHub Finder'/>
            <main className='mx-auto px-3 pb-12'>
              <Alert />
              <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/about' element={<About/>} />
                <Route path='/user/:login' element={<User/>} />
                <Route path='/*' element={<NotFound/>} />
              </Routes>
            </main>
            <Footer/>
          </div>
        </Router>
      </GithubProvider>
    </AlertProvider>
  );
}

export default App;
