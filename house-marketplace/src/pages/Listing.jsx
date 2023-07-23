import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.conf'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'

function formatPrice(price) {
  if (!price) return '';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function Listing() {

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap);
        setLoading(false);
      }
    }
    fetchListing();
  }, [navigate, params.listingId])

  if (loading) return <Spinner />;

  return (
    <main>
      <div className="shareIconDiv" onClick={() => {
        navigator.clipboard.writeText(window.location.href);
        setShareLinkCopied(true);
        setTimeout(() => {
          setShareLinkCopied(false);
        }, 1337)
      }}>
        <img src={shareIcon} alt='' />
      </div>
      {shareLinkCopied && <p className='linkCopied'>{"Link copiado!"}</p>}
      <div className="listingDetails">
        <p className="listingName">{listing.name} - {formatPrice(listing.offer ? listing.discountedPrice : listing.regularPrice)}</p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
        {listing.offer &&
          <p className="discountPrice">
            R${listing.regularPrice - listing.discountedPrice} discount
          </p>
        }
        <ul className='listingDetailsList'>
          <li>
            {listing.bedrooms > 1 ? `${listing.bedrooms} quartos` : '1 quarto'}
          </li>
          <li>
            {listing.bathrooms > 1 ? `${listing.bathrooms} banheiros` : '1 banheiro'}
          </li>
          <li>
            {listing.parking && 'Estacionamento'}
          </li>
          <li>
            {listing.furnished && 'Mobiliado'}
          </li>
        </ul>
        <p className="listingLocationTitle">Location</p>
        {auth.currentUser?.uid !== listing.userRef && (
          <Link to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`}
            className='primaryButton'>
            Contatar vendedor
          </Link>
        )}
      </div>
    </main>
  )
}

export default Listing