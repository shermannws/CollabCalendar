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
    const [syncToGoogle, setSyncToGoogle] = useState(true)

    const dateRef = useRef()

    var gapi = window.gapi
    var CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
    var API_KEY = process.env.REACT_APP_GOOGLE_API_KEY
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
    var SCOPES = "https://www.googleapis.com/auth/calendar.events"

    const handleClick = (name, date, invitees) => {
      gapi.load('client:auth2', () => {
        console.log('loaded client')
  
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
  
        gapi.client.load('calendar', 'v3', () => console.log('loaded v3 api'))
  
        gapi.auth2.getAuthInstance().signIn()
        .then(() => {
          
          let attendees = invitees.map(each => {
            return {'email': each}
          })

          var event = {
            'summary': name,
            'description': 'Added through Collab Calendar',
            'start': {
              'dateTime': new Date(date).toISOString(),
            },
            'end': {
              'dateTime': new Date(date).toISOString(),
            },
            'attendees': attendees,
            'reminders': {
              'useDefault': true
            }
          }
  
          var request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event,
          })
  
          request.execute(event => {
            console.log(event)
            window.open(event.htmlLink)
          })
        })
      })
    }

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

          console.log(syncToGoogle)
          if (syncToGoogle) {
            handleClick(currentEvent.title, dateRef.current.value, listOfCurrentInvitees)
          }
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
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" checked={syncToGoogle} onChange={()=>{setSyncToGoogle(!syncToGoogle);}} label="Sync with my Google Calendar" />
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
