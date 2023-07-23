import { useEffect, useRef, useState } from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from "react-router-dom";
import Spinner from '../components/Spinner'
import { toast } from "react-toastify";
import { getDownloadURL, getStorage, ref as storageRef, uploadBytesResumable } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { collection, serverTimestamp, addDoc } from "firebase/firestore";
import { db } from "../firebase.conf";

function CreateListing() {

    const [geolocationEnabled, setGeolocationEnabled] = useState(false)

    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: [],
        latitude: 0,
        longitude: 0
    })

    const { type, name, bedrooms, bathrooms, parking, furnished, address,
        offer, regularPrice, discountedPrice, images, latitude, longitude } = formData

    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData({
                        ...formData, userRef: user.uid
                    })
                } else {
                    navigate('/sign-in')
                }
            })
        }
        return () => {
            isMounted.current = false
        }
    }, [isMounted])

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log(formData)

        setLoading(true)

        if (discountedPrice >= regularPrice) {
            setLoading(false)
            toast.error('Discounted price needs to be less than regular price')
            return
        }

        if (images.length > 6) {
            setLoading(false)
            toast.error('Maximum of 6 images')
            return
        }

        let geolocation = {}
        let location

        if (geolocationEnabled) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`)
            const data = await response.json()
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0
            location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address

            if (location === undefined || location.includes('undefined')) {
                setLoading(false)
                toast.error('Invalid address')
                return
            }

        } else {
            geolocation.lat = latitude
            geolocation.lng = longitude
        }

        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage()

                console.log('storage:', storage)

                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

                const ref = storageRef(storage, `images/${fileName}`)

                console.log('Starting upload task')

                const uploadTask = uploadBytesResumable(ref, image)

                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log('Upload is ' + progress + '% done')
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused')
                            break
                        case 'running':
                            console.log('Upload is running')
                            break
                    }
                }, (error) => {
                    reject(error)
                }, () => {
                    // handle successful uploads on complete, for instance, get the download url
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then(downloadURL => resolve(downloadURL))
                })
            })
        }

        console.log('images:', images);

        const imageUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch((error) => {
            console.log('Error when uploading images:', error)
            setLoading(false)
            toast.error('Failed to upload images')
            return
        })
        console.log('imageUrls:', imageUrls)

        const formDataCopy = {
            ...formData,
            imageUrls,
            geolocation,
            timestamp: serverTimestamp()
        }
        formDataCopy.location = address
        delete formDataCopy.images
        delete formDataCopy.address
        !formDataCopy.offer && delete formDataCopy.discountedPrice

        const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
        setLoading(false)
        toast.success('Listing saved')
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }

    const onMutate = (e) => {
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
            return
        }
        let boolean = null
        if (e.target.value === 'true') {
            boolean = true
        } else if (e.target.value === 'false') {
            boolean = false
        }
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: boolean ?? e.target.value
        }))
    }

    if (loading) return <Spinner />

    return (
        <div className='profile'>
            <header>
                <p className='pageHeader'>Criar um anúncio</p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
                    <label className='formLabel'>Vender / Alugar</label>
                    <div className='formButtons'>
                        <button
                            className={type === 'sale' ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='type'
                            value='sale'
                            onClick={onMutate}
                        >
                            Vender
                        </button>
                        <button
                            className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='type'
                            value='rent'
                            onClick={onMutate}
                        >
                            Alugar
                        </button>
                    </div>
                    <label className='formLabel'>Nome</label>
                    <input
                        className='formInputName'
                        type='text'
                        id='name'
                        value={name}
                        onChange={onMutate}
                        maxLength='32'
                        minLength='10'
                        required
                    />
                    <div className='formRooms flex'>
                        <div>
                            <label className='formLabel'>Quartos</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='bedrooms'
                                value={bedrooms}
                                onChange={onMutate}
                                min='1'
                                max='50'
                                required
                            />
                        </div>
                        <div>
                            <label className='formLabel'>Banheiros</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='bathrooms'
                                value={bathrooms}
                                onChange={onMutate}
                                min='1'
                                max='50'
                                required
                            />
                        </div>
                    </div>
                    <label className='formLabel'>Estacionamento</label>
                    <div className='formButtons'>
                        <button
                            className={parking ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='parking'
                            value={true}
                            onClick={onMutate}
                        >
                            Sim
                        </button>
                        <button
                            className={!parking && parking !== null ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='parking'
                            value={false}
                            onClick={onMutate}
                        >
                            Não
                        </button>
                    </div>
                    <label className='formLabel'>Mobiliado</label>
                    <div className='formButtons'>
                        <button
                            className={furnished ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='furnished'
                            value={true}
                            onClick={onMutate}
                        >
                            Sim
                        </button>
                        <button
                            className={!furnished && furnished !== null ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='furnished'
                            value={false}
                            onClick={onMutate}
                        >
                            Não
                        </button>
                    </div>
                    <label className='formLabel'>Endereço</label>
                    <textarea
                        className='formInputAddress'
                        type='text'
                        id='address'
                        value={address}
                        onChange={onMutate}
                        required
                    />
                    {!geolocationEnabled && (
                        <div className='formLatLng flex'>
                            <div>
                                <label className='formLabel'>Latitude</label>
                                <input
                                    className='formInputSmall'
                                    type='number'
                                    id='latitude'
                                    value={latitude}
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                            <div>
                                <label className='formLabel'>Longitude</label>
                                <input
                                    className='formInputSmall'
                                    type='number'
                                    id='longitude'
                                    value={longitude}
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                        </div>
                    )}
                    <label className='formLabel'>Oferta</label>
                    <div className='formButtons'>
                        <button
                            className={offer ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='offer'
                            value={true}
                            onClick={onMutate}
                        >
                            Sim
                        </button>
                        <button
                            className={!offer && offer !== null ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='offer'
                            value={false}
                            onClick={onMutate}
                        >
                            Não
                        </button>
                    </div>
                    <label className='formLabel'>Preço normal</label>
                    <div className='formPriceDiv'>
                        <input
                            className='formInputSmall'
                            type='number'
                            id='regularPrice'
                            value={regularPrice}
                            onChange={onMutate}
                            min='50'
                            max='750000000'
                            required
                        />
                        {type === 'rent' && (
                            <p className='formPriceText'>R$ por mês</p>
                        )}
                    </div>
                    {offer && (
                        <>
                        <label className='formLabel'>Preço com disconto</label>
                        <input
                            className='formInputSmall'
                            type='number'
                            id='discountedPrice'
                            value={discountedPrice}
                            onChange={onMutate}
                            min='50'
                            max='750000000'
                            required={offer}
                        />
                        </>
                    )}
                    <label className='formLabel'>Imagens</label>
                    <p className='imagesInfo'>
                        A primeira imagem será a capa (máx 6).
                    </p>
                    <input
                        className='formInputFile'
                        type='file'
                        id='images'
                        onChange={onMutate}
                        max='6'
                        accept={'.jpeg,.png,.jpg'}
                        multiple
                        required
                    />
                    <button className='primaryButton createListingButton' type='submit'>
                        Criar anúncio
                    </button>
                </form>
            </main>
        </div>
    )
}

export default CreateListing