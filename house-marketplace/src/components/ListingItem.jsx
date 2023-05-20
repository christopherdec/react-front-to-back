import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'
import { Link } from "react-router-dom";

function parsePrice(price, type) {
    return 'R$ ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',00' +
        (type === 'rent' ? ' / mês' : '')
}

const ListingItem = ({ listing, id, onDelete }) => {
    return (
        <li className='categoryListing'>
            <Link
                to={`/category/${listing.type}/${id}`}
                className='categoryListingLink'
            >
                <img src={listing.imageUrls[0]} alt={listing.name} className='categoryListingImg' />
                <div className='categoryListingDetails'>
                    <p className='categoryListingLocation'>{listing.location}</p>
                    <p className='categoryListingName'>{listing.name}</p>
                    <p className='categoryListingPrice'>
                        {listing.offer ?
                            parsePrice(listing.discountedPrice, listing.type) :
                            parsePrice(listing.regularPrice, listing.type)}
                    </p>
                    <div className='categoryListingInfoDiv'>
                        <img src={bedIcon} alt='bed' />
                        <p className='categoryListingInfoText'>
                            {`${listing.bedrooms} quarto${listing.bedrooms > 1 ? 's' : ''}`}
                        </p>
                        <img src={bathtubIcon} alt='bath' className='categoryListingInfoText'/>
                        <p className='categoryListingInfoText'>
                            {`${listing.bathrooms} banheiro${listing.bathrooms > 1 ? 's' : ''}`}
                        </p>
                    </div>
                </div>
            </Link>
            {onDelete && (
                <DeleteIcon
                    className='removeIcon'
                    fill='rgb(231, 76, 60)'
                    onClick={() => onDelete(listing.id, listing.name)}
                />
            )}
        </li>
    )
}

export default ListingItem
