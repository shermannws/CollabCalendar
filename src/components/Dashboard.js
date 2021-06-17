import React, { useState, useEffect } from "react"
import { ListGroup } from "react-bootstrap"
import {MyMonthlyCalendar} from "./Calendar"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"

import { db } from "../firebase"

export default function Dashboard() {
  const { currentUser } = useAuth()
  const [pendingEvents, setPendingEvents] = useState([])

  const fetchEvents = () => {
    const userDocRef = db.collection('users').doc(currentUser.email);
    userDocRef.get().then((doc) => {
      if (doc.data() !== undefined) {
        doc.data().events.pending.forEach(eventId => {
          const eventDocRef = db.collection('events').doc(eventId)
          eventDocRef.get().then((event) => {
            if (event.data() !== undefined) {
              setPendingEvents(pendingEvents => [...pendingEvents, event.data().title])
            }
          })
        })
      }
      
    });
  }

  useEffect(() => {
    fetchEvents();
  }, [])

  return (
    <>
      <div>
        <div className="w-100 mb-5">
          <MyMonthlyCalendar/>       
        </div>
        <Link to = "/new-group-page" 
          className="btn btn-primary w-100 mt-2 mb-4 p-2">
            Create new group
        </Link>
      </div>
      <div className="w-50 pl-5 mt-5">
        <ListGroup className="w-100 mb-5">
          <ListGroup.Item><strong>Pending Responses</strong></ListGroup.Item>

          {pendingEvents.length === 0 ? 
          (
            <ListGroup.Item action variant="lght">
              You have no events pending your response!
            </ListGroup.Item>
          ) : pendingEvents.map(event => {
            return (
              <ListGroup.Item action variant="warning">
                {event}
              </ListGroup.Item>
          )})}

        </ListGroup>

        <ListGroup className="w-100 mb-5">
          <ListGroup.Item><strong>My Groups</strong></ListGroup.Item>

          <ListGroup.Item action variant="info">
            Group 1
          </ListGroup.Item>
          <ListGroup.Item action variant="info">
            Group 2
          </ListGroup.Item>
          <ListGroup.Item action variant="info">
            Group 3
          </ListGroup.Item>
          <ListGroup.Item action variant="info">
            Group 4
          </ListGroup.Item>
          <ListGroup.Item action variant="info">
            Group 5
          </ListGroup.Item>
        </ListGroup>
      </div>
    </>
  )
}