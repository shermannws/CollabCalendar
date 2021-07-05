import firebase from "firebase"
import React, {useState, useRef } from "react"
import { Card, Alert, Button, Form } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import { useEvents } from "../contexts/EventsContext"
import { db } from "../firebase"
import  ViewScheduleComponent from "./ViewScheduleComponent.js"

export default function ViewEventPageFromGroupPage() {

    const { currentEvent, currentGroup } = useEvents()
    const [error, setError] = useState("")
    const [confirmEvent, setConfirmEvent] = useState(false)
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    const dateRef = useRef()

    async function submitEvent(e) {
      e.preventDefault()

      try {
        setError("")
        setLoading(true)

        //update the current event to the confirmed date
        //for each invitee,
          // add the event to confirmed
          // remove from pending if still in pending
        //for current group,
          // move it to event_confirmed
         
        await db.collection("events").doc(currentEvent.id).update({
          is_confirmed: true,
          confirmed_date: dateRef.current.value
        }).then(async () => {
          let listOfCurrentInvitees;
          let listOfAdmins
          await db.collection("events").doc(currentEvent.id).get().then((doc) => {
            listOfCurrentInvitees = doc.data().invitees
            listOfAdmins = doc.data().admins
          })

          listOfCurrentInvitees.forEach(async (email) => {
            await db.collection("users").doc(email).update({
              events_confirmed: firebase.firestore.FieldValue.arrayUnion(currentEvent.id),
              events_pending: firebase.firestore.FieldValue.arrayRemove(currentEvent.id)
            })
          })

          listOfAdmins.forEach(async (email) => {
            await db.collection("users").doc(email).update({
              events_confirmed: firebase.firestore.FieldValue.arrayUnion(currentEvent.id),
              events_pending: firebase.firestore.FieldValue.arrayRemove(currentEvent.id)
            })
          })

          await db.collection("groups").doc(currentGroup.groupId).update({
            events_confirmed: firebase.firestore.FieldValue.arrayUnion(currentEvent.id),
            events_pending: firebase.firestore.FieldValue.arrayRemove(currentEvent.id)
          })
        })


        history.push("/view-group")
      } catch {
        setError("Please try again.")
      }

      setLoading(false)
    }

    return (
      <>
        <Card className="w-100" style={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10
        }}>
            <Card.Title>Event: <strong>{currentEvent.title}</strong></Card.Title>
            <Card.Text>Invitees: {currentEvent.invitees.length === 0 ? "None" : currentEvent.invitees.join(", ")}</Card.Text>
            <Card.Text>Waiting on responses from: {currentEvent.invitees.length === 0 ? "None" : 
              currentEvent.invitees.filter(invitee => currentEvent.responses === undefined ? true : !currentEvent.responses.hasOwnProperty(invitee)).join(", ") || "Everyone responded!"}
            </Card.Text>
            <Card.Text>Timeframe for event to be held within: <strong>{currentEvent.window_start}</strong> to <strong>{currentEvent.window_end}</strong> </Card.Text>
            <Card.Text>Confirmed date: {currentEvent.confirmed_date === null ? "Not confirmed yet" : currentEvent.confirmed_date}</Card.Text>
            
            <ViewScheduleComponent />

          {currentEvent.confirmed_date === null && (
          <Button className="mt-5" disabled={confirmEvent} onClick={() => setConfirmEvent(true)}>
            Confirm a date for the event now!
          </Button>)
          }

          {error && <Alert variant="danger">{error}</Alert>}
          {confirmEvent && (
            <Form className="mt-4" onSubmit={submitEvent}>
                <Form.Group id="date">
                  <Form.Label>Confirmed Date for Event</Form.Label>
                  <Form.Control type="datetime-local" ref={dateRef} required />
                </Form.Group>

                <Button disabled={loading} className="w-100" type="submit">
                  Create now!
                </Button>
              </Form>
          )}
        </Card>
      </>
    )
    
}
