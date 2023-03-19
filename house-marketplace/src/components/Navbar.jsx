import { useNavigate, useLocation } from 'react-router-dom'
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg'
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg'

function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const pathMatchesRoute = (route) => {
        return route === location.pathname;
    }

    return (
        <footer className='navbar'>
            <nav className='navbarNav'>
                <ul className='navbarListItems'>
                    <li className='navbarListItem' onClick={() => navigate('/')}>
                        <ExploreIcon fill={pathMatchesRoute('/') ? '#2c2c2c' : '#8f8f8f'}
                                     width='36px' height='36px' />
                        <p className={'navbarListItemName' + (pathMatchesRoute('/') ? 'Active' : '')}>
                            Explore
                        </p>
                    </li>
                    <li className='navbarListItem' onClick={() => navigate('/offers')}>
                        <OfferIcon fill={pathMatchesRoute('/offers') ? '#2c2c2c' : '#8f8f8f'}
                                   width='36px' height='36px' />
                        <p className={'navbarListItemName' + (pathMatchesRoute('/offers') ? 'Active' : '')}>
                            Offer
                        </p>
                    </li>
                    <li className='navbarListItem' onClick={() => navigate('/profile')}>
                        <PersonOutlineIcon fill={pathMatchesRoute('/profile') ? '#2c2c2c' : '#8f8f8f'}
                                           width='36px' height='36px' />
                        <p className={'navbarListItemName' + (pathMatchesRoute('/profile') ? 'Active' : '')}>
                            Profile
                        </p>
                    </li>
                </ul>
            </nav>
        </footer>
    )
}

export default Navbar;