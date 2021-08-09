import React, { useState, useEffect, useRef } from "react"
import { Button, Alert, Card, Form } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import { db } from "../firebase"
import { useEvents } from "../contexts/EventsContext"
import firebase from "firebase/app"
import SendEmail from "../mailgun"

// returns the functional component of viewing the details of a group and creating of events tagged to the group
export default function ViewGroupPage() {

  const { currentGroup, setCurrentEvent } = useEvents()

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [pendingEvents, setPendingEvents] = useState([])
  const [confirmedEvents, setConfirmedEvents] = useState([])
  const [createNewEvent, setCreateNewEvent] = useState(false)

  const nameRef = useRef()
  const respondByDateRef = useRef()
  const startDateRef = useRef()
  const endDateRef = useRef()

  const history = useHistory()

  // method to invoke to fetch the necessary and relevant information to populate the page with the respective information
  const fetchEvents = () => {
    const groupDocRef = db.collection('groups').doc(currentGroup.groupId);
    groupDocRef.get().then(async(doc) => {
      if (doc.data().events_pending !== undefined ) {
        doc.data().events_pending.forEach(eventId => {
          const eventDocRef = db.collection('events').doc(eventId)
          eventDocRef.get().then((event) => {
            setPendingEvents(pendingEvents => [...pendingEvents, event.data()])         
          })
        })
      }

      if (doc.data().events_confirmed !== undefined ) {
        doc.data().events_confirmed.forEach(eventId => {
          const eventDocRef = db.collection('events').doc(eventId)
          eventDocRef.get().then((event) => {
            setConfirmedEvents(confirmedEvents => [...confirmedEvents, event.data()])         
          })
        })
      }
      
    });
  }

  useEffect(() => {
    fetchEvents();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // methods to handle the creation of a new event tagged to this group
  async function submitEvent(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)

      if (new Date(startDateRef.current.value) > new Date(endDateRef.current.value)) {
        throw new RangeError()
      }

      if (new Date(respondByDateRef.current.value) < new Date()) {
        throw new RangeError()
      }

      currentGroup.invitees.forEach((user) => SendEmail(user, "inviteemail", "New Event Invite", "there"))
       
      // Create new Event and get the event id
      // Add this event id to this group's pending
      // for all invitees, add this event id to their pending
      await db.collection("events").add({
        title: nameRef.current.value,
        admins: currentGroup.admins,
        invitees: currentGroup.invitees,
        is_collaborative: true,
        is_confirmed: false,
        respond_by_date: respondByDateRef.current.value,
        confirmed_date: null,
        window_start: startDateRef.current.value,
        window_end: endDateRef.current.value,
      }).then( async (docRef) => {
        await db.collection("events").doc(docRef.id).update({
          id: docRef.id
        }).then(async () => {
          await db.collection("groups").doc(currentGroup.groupId).set({
            events_pending: firebase.firestore.FieldValue.arrayUnion(docRef.id)
          }, { merge: true }).then(async () => {
            await currentGroup.invitees.forEach(async (user) => {
              await db.collection("users").doc(user).set({
                events_pending: firebase.firestore.FieldValue.arrayUnion(docRef.id)
              }, { merge: true })
            })
          })
        })
      })
        
      history.go(0)
    } catch (e) {
      if (e instanceof RangeError) {
        
        if (new Date(startDateRef.current.value) > new Date(endDateRef.current.value)) {
          setError("Start date cannot be greater than end date")
        }
  
        if (new Date(respondByDateRef.current.value) < new Date()) {
          setError("Respond by date cannot be in the past")
        }
      } else {
        setError("Failed to create this event")
      }
    }
    setLoading(false)
  }

  return (
    <>
      <Card className="w-100">
        <Card.Body>
          
          <Card.Title>Current Group: <strong>{currentGroup.groupName}</strong></Card.Title>
          <Card.Text>Invitees: {currentGroup.invitees.length === 0 ? "None" : currentGroup.invitees.join(", ")}</Card.Text>
          <Card.Text>
            Pending Events: {pendingEvents.length === 0 ? 
                              "None" :
                              pendingEvents.map(event => 
                              <Button className="mr-2" value={event} variant="secondary" href="/view-event-page-1" onClick={()=>{setCurrentEvent(event)}}>{event.title}</Button>
                              )
                          }
          </Card.Text>
          <Card.Text>
            Confirmed Events: {confirmedEvents.length === 0 ? 
                                "None" : 
                                confirmedEvents.map(event => 
                                <Button className="mr-2" value={event} variant="success" href="/view-event-page-1" onClick={()=>{setCurrentEvent(event)}}>{event.title}</Button>
                                )
                              }
          </Card.Text>

          <br/>
          <Button className="mb-4" disabled={createNewEvent} onClick={()=>setCreateNewEvent(true)}>Create new event for this group</Button>
          {error && <Alert variant="danger">{error}</Alert>}
          {createNewEvent && (
            <Form onSubmit={submitEvent}>
              <Form.Group id="event-name">
                <Form.Label>Name of Event</Form.Label>
                <Form.Control type="text" ref={nameRef} required />
              </Form.Group>

              <Form.Group id="respond-by">
                <Form.Label>Invitees are to respond by</Form.Label>
                <Form.Control type="datetime-local" ref={respondByDateRef} required />
              </Form.Group>

              <Form.Row>
                <Form.Group className="mr-4" sm={12} id="timeframe">
                  <Form.Label>Get availabilities <b>From</b></Form.Label>
                  <Form.Control type="date" ref={startDateRef} required />
                </Form.Group>
                <Form.Group sm={12} id="timeframe">
                  <Form.Label><b>To</b></Form.Label>
                  <Form.Control type="date" ref={endDateRef} required />
                </Form.Group>
              </Form.Row>

              <Button disabled={loading} className="w-100" type="submit">
                Create now!
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </>
  )
}