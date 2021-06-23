import React, { useState, useEffect } from "react"
import { ListGroup } from "react-bootstrap"
import {MyMonthlyCalendar} from "./Calendar"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"

import { db } from "../firebase"

export default function Dashboard() {
  const { currentUser } = useAuth()
  const [pendingEvents, setPendingEvents] = useState([])
  const [groups, setGroups] = useState([])

  const fetchEvents = () => {
    const userDocRef = db.collection('users').doc(currentUser.email);
    userDocRef.get().then((doc) => {
      if (doc.data() !== undefined) {
        doc.data().events.pending.forEach(eventId => {
          const eventDocRef = db.collection('events').doc(eventId)
          eventDocRef.get().then((event) => {
            if (event.data() !== undefined) {
              setPendingEvents(pendingEvents => [...pendingEvents, event.data()])
            }
          })
        })
        
        if (doc.data().groupsAdminOf) {
          doc.data().groupsAdminOf.forEach(groupId => {
            const groupDocRef = db.collection('groups').doc(groupId)
            groupDocRef.get().then(group => {
              setGroups(groups => [...groups, group.data()])
            })
          })
        }
        
      }
    });
  }

  useEffect(() => {
    fetchEvents();
  }, [])

  return (
    <>
      <div className="w-100">
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
            <ListGroup.Item variant="light">
              You have no events pending your response!
            </ListGroup.Item>
          ) : pendingEvents.map(event => {
            return (
              <ListGroup.Item action variant="warning">
                {event.title}
              </ListGroup.Item>
          )})}

        </ListGroup>

        <ListGroup className="w-100 mb-5">
          <ListGroup.Item><strong>My Groups</strong></ListGroup.Item>

          {groups.length === 0 ? 
          (
            <ListGroup.Item variant="light">
              You have no groups at the moment.
            </ListGroup.Item>
          ) : groups.map(group => {
            return (
              <ListGroup.Item action variant="info">
                {group.groupName}
              </ListGroup.Item>
          )})}
          
        </ListGroup>
      </div>
    </>
  )
}