import React, { useState, useEffect, useRef } from "react"
import { Button, Alert, Card, Form } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import { db } from "../firebase"
import { useEvents } from "../contexts/EventsContext"
import firebase from "firebase/app"

export default function ViewGroupPage() {

  const { currentGroup } = useEvents()

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

  const fetchEvents = () => {
    const groupDocRef = db.collection('groups').doc(currentGroup.groupId);
    groupDocRef.get().then(async(doc) => {
      doc.data().events.pending.forEach(eventId => {
        const eventDocRef = db.collection('events').doc(eventId)
        eventDocRef.get().then((event) => {
          setPendingEvents(pendingEvents => [...pendingEvents, event.data()])         
        })
      })

      doc.data().events.confirmed.forEach(eventId => {
        const eventDocRef = db.collection('events').doc(eventId)
        eventDocRef.get().then((event) => {
          setConfirmedEvents(confirmedEvents => [...confirmedEvents, event.data()])         
        })
      })
    });
  }

  useEffect(() => {
    fetchEvents();
  }, [])

  async function submitEvent(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)

      //Create new Event and get the event id
      //Add this event id to this group's pending
      // for all invitees, add this event id to their pending
      await db.collection("events").add({
        title: nameRef.current.value,
        admins: currentGroup.admins,
        invitees: currentGroup.invitees,
        is_collaborative: true,
        is_confirmed: false,
        respond_by_date: respondByDateRef.current.value,
        window_start: startDateRef.current.value,
        window_end: endDateRef.current.value,
      }).then( async (docRef) => {
        await db.collection("events").doc(docRef.id).update({
          id: docRef.id
        })

        await db.collection("groups").doc(currentGroup.groupId).set({
          "events.pending": firebase.firestore.FieldValue.arrayUnion(docRef.id)
        }, { merge: true }).then(async () => {
          await currentGroup.invitees.forEach(async (user) => {
            await db.collection("users").doc(user).set({
              "events.pending": firebase.firestore.FieldValue.arrayUnion(docRef.id)
            }, { merge: true })
          })
        })
      })
    } catch {
      setError("Failed to create this event")
    }
    setCreateNewEvent(false)
    setLoading(false)
    history.go(0)
  }

  return (
    <>
      <Card className="w-100">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Card.Title>Current Group: <strong>{currentGroup.groupName}</strong></Card.Title>
          <Card.Text>Invitees: {currentGroup.invitees.length === 0 ? "None" : currentGroup.invitees.join(", ")}</Card.Text>
          <Card.Text>
            Pending Events: {pendingEvents.length === 0 ? 
                              "None" :
                              pendingEvents.map(event => <Button className="mr-2" value={event} variant="secondary">{event.title}</Button>)
                            }
          </Card.Text>
          <Card.Text>
            Confirmed Events: {confirmedEvents.length === 0 ? 
                                "None" : 
                                confirmedEvents.map(event => <Button className="mr-2" value={event} variant="success">{event.title}</Button>)
                              }
          </Card.Text>

          <br/>
          <Button className="mb-4" disabled={createNewEvent} onClick={()=>setCreateNewEvent(true)}>Create new event for this group</Button>
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
                  <Form.Label>Window Start</Form.Label>
                  <Form.Control type="date" ref={startDateRef} required />
                </Form.Group>
                <Form.Group sm={12} id="timeframe">
                  <Form.Label>End</Form.Label>
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