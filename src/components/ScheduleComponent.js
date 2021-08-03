import React, { useState } from "react"
import ScheduleSelector from "react-schedule-selector"
import { useEvents } from "../contexts/EventsContext"
import { useAuth } from "../contexts/AuthContext"
import { Button, Alert } from 'react-bootstrap'
import { useHistory } from "react-router-dom"
import { db } from "../firebase"
import firebase from "firebase/app"

// returns the functional component that allows for user to indicate their availabilities using an interactive tool
export default function ScheduleComponent() {
  const { currentEvent } = useEvents()
  const { currentUser } = useAuth()
  const [schedule, setSchedule] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  
  // for each change in the schedule to update the schedule state
  function handleChange(newSchedule) {
    setSchedule(newSchedule)
  }

  // method to handle the updating of the user's availabilities
  async function handleSubmit() {
    try {
      setError("")
      setLoading(true)

      await db.collection("users").doc(currentUser.email).update({
        "events_pending": firebase.firestore.FieldValue.arrayRemove(currentEvent.id)
      }).then(async() => {
        const eventDocRef = db.collection("events").doc(currentEvent.id)
        await eventDocRef.get().then(async (doc) => {
          let newResponses;
          if (doc.data().responses !== undefined) {
            newResponses = doc.data().responses
          } else {
            newResponses = {}
          }
          let editedSchedule = JSON.parse(JSON.stringify(schedule))

          newResponses[currentUser.email] = editedSchedule

          await db.collection("events").doc(currentEvent.id).update({
            responses: newResponses
          })
        })
      })
      history.push("/")
    } catch(e) {
      console.log(e)
      setError("Failed to respond to event, please try again.")
    }
    setLoading(false)
  }

  return (
    <>
    {error && <Alert variant="danger">{error}</Alert>}
    <ScheduleSelector
      selection={schedule}
      startDate={currentEvent.window_start}
      numDays={1+(new Date(currentEvent.window_end).getTime()-new Date(currentEvent.window_start).getTime())/1000/60/60/24}
      minTime={0}
      maxTime={24}
      hourlyChunks={1}
      onChange={handleChange}
      timeFormat={"HHmm"}
    />
    <Button className="w-50 mt-4" disabled={loading} onClick={handleSubmit} variant="primary">Submit</Button>
    </>
  )
}
