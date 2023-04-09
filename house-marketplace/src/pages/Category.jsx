import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.conf'
import Spinner from '../components/Spinner'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Category = () => {

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)

    const params = useParams()

    useEffect(() => {
        const fetchListings = async () => {
            try {
                // reference to the collection, not the document
                const listingsRef = collection(db, 'listings')

                const q = query(
                    listingsRef,
                    where('type', '==', params.categoryName),
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
    }, [params.categoryName])

    return (
        <div className='category'>
            <header>
                <p className='pageHeader'>
                    {params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}
                </p>
                {loading ? <Spinner /> : listings && listings.length > 0 ?
                    <>
                        <main>
                            <ul className='categoryListings'>
                                {listings.map((listing) => (
                                    <h3 key={listing.id}>{listing.data.name}</h3>
                                ))}
                            </ul>
                        </main>
                    </> :
                    <p>
                        No listings for {params.categoryName}
                    </p>
                }
            </header>
        </div>
    )
}

export default Category