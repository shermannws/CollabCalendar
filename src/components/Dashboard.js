import React, { useState, useEffect } from "react"
import { ListGroup } from "react-bootstrap"
import { MyMonthlyCalendar } from "./Calendar"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { useEvents } from "../contexts/EventsContext"

import { db } from "../firebase"

export default function Dashboard() {
  const { currentUser } = useAuth()
  const { setCurrentGroup, setCurrentEvent } = useEvents()
  const [pendingEvents, setPendingEvents] = useState([])
  const [groups, setGroups] = useState([])
  const history = useHistory()

  const fetchEvents = async () => {
    const userDocRef = db.collection('users').doc(currentUser.email);
    await userDocRef.get().then((doc) => {
      if (doc.data() !== undefined && doc.data().events_pending !== undefined) {
        doc.data().events_pending.forEach(async(eventId) => {
          const eventDocRef = db.collection('events').doc(eventId)
          await eventDocRef.get().then((event) => {
            if (event.data() !== undefined) {
              setPendingEvents(pendingEvents => [...pendingEvents, event.data()])
            }
          })
        })
      }
      if (doc.data() !== undefined && doc.data().groupsAdminOf !== undefined) {
        doc.data().groupsAdminOf.forEach(async(groupId) => {
          const groupDocRef = db.collection('groups').doc(groupId)
          await groupDocRef.get().then(group => {
            setGroups(groups => [...groups, group.data()])
          })
        })
      }
    });
  }

  useEffect(() => {
    fetchEvents();
  }, [])

  function handleGroupSelect(group) {
    setCurrentGroup(group)
    history.push("/view-group")
  }

  function handleEventSelect(event) {
    setCurrentEvent(event)
    history.push("/respond-event")
  }

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
              <ListGroup.Item action variant="warning" value={event} onClick={()=>handleEventSelect(event)}>
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
              <ListGroup.Item action variant="info" value={group} onClick={()=>handleGroupSelect(group)}>
                {group.groupName}
              </ListGroup.Item>
          )})}
          
        </ListGroup>
      </div>
    </>
  )
}