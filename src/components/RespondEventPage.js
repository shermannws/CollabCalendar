import React, { useState } from "react"
import { Button, Card } from "react-bootstrap"
import { useEvents } from "../contexts/EventsContext"

import  ScheduleComponent from "./ScheduleComponent.js"

export default function ViewGroupPage() {

  const [respondEvent, setRespondEvent] = useState(false)
  const { currentEvent } = useEvents()

  return (
    <>
      <Card className="w-100">
        <Card.Body>
          <Card.Title>Event Title: <strong>{currentEvent.title}</strong></Card.Title>
          <Card.Text>Kindly Respond By: {currentEvent.respond_by_date}</Card.Text>
          <Card.Text>Asking for availability between {currentEvent.window_start} and {currentEvent.window_end}</Card.Text>

          <br/>
          <Button className="mb-4" disabled={respondEvent} onClick={()=>setRespondEvent(true)}>Indicate Availability Now</Button>
          {respondEvent && (
            <ScheduleComponent />
          )}
        </Card.Body>
      </Card>
    </>
  )
}