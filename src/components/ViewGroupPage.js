import React, { useState } from "react"
import { Button, Alert, Card } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { db } from "../firebase"
import { useEvents } from "../contexts/EventsContext"

export default function ViewGroupPage() {

  const { currentUser } = useAuth()
  const { currentGroup } = useEvents()

  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")


  return (
    <>
    <Card className="w-100">
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Card.Title>Current Group: <strong>{currentGroup.groupName}</strong></Card.Title>
        <Card.Text>Invitees: {currentGroup.invitees.length === 0 ? "None" : currentGroup.invitees.join(", ")}</Card.Text>
        <Button>Create new event for this group</Button>
      </Card.Body>
    </Card>
      
    </>
  )
}