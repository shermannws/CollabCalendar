import React, { useState } from "react"
import ScheduleSelector from "react-schedule-selector"
import { useEvents } from "../contexts/EventsContext"
import { useAuth } from "../contexts/AuthContext"
import { Button, Alert } from 'react-bootstrap'
import { useHistory } from "react-router-dom"
import { db } from "../firebase"
import firebase from "firebase/app"

export default function ScheduleComponent() {
  const { currentEvent } = useEvents()
  const { currentUser } = useAuth()
  const [schedule, setSchedule] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  
  function handleChange(newSchedule) {
    setSchedule(newSchedule)
  }

  async function handleSubmit() {
    try {
      setError("")
      setLoading(true)

      await db.collection("users").doc(currentUser.email).update({
        "events.pending": firebase.firestore.FieldValue.arrayRemove(currentEvent.id)
      })

      await db.collection("events").doc(currentEvent.id).update({
        [`responses.${currentUser.email}`]: schedule
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
