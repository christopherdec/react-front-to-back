import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { db } from '../firebase.conf'
import { doc, getDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'


const Contact = () => {

  const [message, setMessage] = useState('')
  const [landlord, setLandlord] = useState(null)
  const [searchParams] = useSearchParams()
  const params = useParams()

  useEffect(() => {

    console.log('landlordId:', params?.landlordId);

    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setLandlord(docSnap.data())
      } else {
        toast.error('Failed to get landlord data')
      }
    }

    getLandlord()

  }, [params.landlordId])

  const onChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <div className='pageContainer'>
      <header>
        <p className="pageHeader">
          Contatar Vendedor
        </p>
      </header>
      {landlord != null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landlord?.name}</p>
          </div>
          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">Mensagem</label>
              <textarea
                name="message"
                id="message"
                className='textarea'
                value={message}
                onChange={onChange}
              >
              </textarea>
            </div>
            <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
              <button className="primaryButton" type='button'>Enviar mensagem</button>
            </a>
          </form>
        </main>
      )}
    </div>
  )
}

export default Contact