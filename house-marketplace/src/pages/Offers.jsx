import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.conf'
import Spinner from '../components/Spinner'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";

const Offers = () => {

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)

    const params = useParams()

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingsRef = collection(db, 'listings')

                const q = query(
                    listingsRef,
                    where('offer', '==', true),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                )
                const snapshot = await getDocs(q)

                const listings = []
                snapshot.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setListings(listings)
                setLoading(false)
            } catch (error) {
                console.log(`Failed to fetch listings: ${error}`)
                toast.error('Failed to fetch listings')
            }
        }
        fetchListings()
    }, [])

    return (
        <div className='category'>
            <header>
                <p className='pageHeader'>
                    Offers
                </p>
                {loading ? <Spinner /> : listings && listings.length > 0 ?
                    <>
                        <main>
                            <ul className='categoryListings'>
                                {listings.map((listing) => (
                                    <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
                                ))}
                            </ul>
                        </main>
                    </> :
                    <p>
                        No offers available
                    </p>
                }
            </header>
        </div>
    )
}

export default Offers