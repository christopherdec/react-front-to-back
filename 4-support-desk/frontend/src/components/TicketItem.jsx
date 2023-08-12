import React from 'react'
import { Link } from 'react-router-dom'

function TicketItem({key, ticket}) {
  return (
    <div key={key} className='ticket'>
      <div>
        {new Date(ticket.createdAt).toLocaleString('pt-BR')}
      </div>
      <div>
        {ticket.product}
      </div>
      <div className={`status status-${ticket.status}`}>
        {ticket.status}
      </div>
      <Link to={`/ticket/${ticket._id}`} className='btn btn-reverse btn-sm'>View</Link>
    </div>
  )
}

export default TicketItem