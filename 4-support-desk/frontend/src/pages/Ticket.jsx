import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getTicket, closeTicket } from '../features/ticket/ticketSlice'
import { getNotes, reset as notesReset } from '../features/note/noteSlice'
import Spinner from "../components/Spinner"
import BackButton from "../components/BackButton"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Modal from "react-modal"
import NoteItem from "../components/NoteItem"
import { FaPlus } from "react-icons/fa"

const customStyles = {
  content: {
    width: '600px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    position: 'relative'
  }
}

// monta o modal no componente raiz do html
Modal.setAppElement('#root')

function Ticket() {

  const [modalOpen, setModalOpen] = useState(false)

  const [noteText, setNoteText] = useState('')

  const { ticket, isLoading, isSuccess, isError, message } = useSelector((state) => state.ticket)
  
  const { notes, isLoading: notesLoading } = useSelector((state) => state.note)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { ticketId } = useParams()

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    dispatch(getTicket(ticketId))
    dispatch(getNotes(ticketId))
  }, [isError, message, ticketId, dispatch])

  const onTicketClose = () => {
    dispatch(closeTicket(ticketId))
    toast.success('Ticket closed!')
    navigate('/tickets')
  }

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  const onNoteSubmit = (e) => {
    e.preventDefault()
    console.log('Submit')
    closeModal()
  }

  if (isLoading || notesLoading) {
    return <Spinner />
  }

  if (isError) {
    return <h3>Something went wrong :/</h3>
  }

  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <BackButton url='/tickets'/>
        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status}`}>{ticket.status}</span>
        </h2>
        <h3>Date Submitted: {new Date(ticket.createdAt).toLocaleString('pt-BR')}</h3>
        <h3>Product: {ticket.product}</h3>
        <hr />
        <div className="ticket-desc">
          <h3>Description of Issue</h3>
          <p>{ticket.description}</p>
        </div>
        <h2>Notes</h2>
      </header>

      {ticket.status !== 'closed' && (
        <button className="btn" onClick={openModal}><FaPlus /> Add Note</button>
      )}
      <Modal 
        isOpen={modalOpen} 
        onRequestClose={closeModal} 
        style={customStyles} 
        contentLabel="Add Note"
      >
        <h2>Add Note</h2>
        <button className="btn-close" onClick={closeModal}>X</button>
        <form onSubmit={onNoteSubmit}>
          <div className="form-group">
            <textarea 
              name="noteText" 
              id="noteText" 
              className="form-control" 
              placeholder="Note text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <button className="btn" type="submit">Submit</button>
          </div>
        </form>
      </Modal>

      {notes.map((note) => (
        <NoteItem key={note._id} note={note} />
      ))}

      {ticket.status !== 'closed' && (
        <button className="btn btn-block btn-danger" onClick={onTicketClose}>
          Close Ticket
        </button>
      )}
    </div>
  )
}

export default Ticket