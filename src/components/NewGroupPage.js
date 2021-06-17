import React, { useRef, useState } from "react"
import { Form, Button, Alert, Card } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import MultipleEmail from "./MultipleEmail"
import { db } from "../firebase"


export default function NewGroupPage() {

 const { currentUser } = useAuth()
 const groupNameRef = useRef()
 const history = useHistory()
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState("")

 function handleSubmit(ex) {

  const promises = []
  setLoading(true)
  setError("")

  promises.push(db.collection("groups").add({
    groupName: groupNameRef.current.value,
    admins: [currentUser.email, ]
  }))

  Promise.all(promises)
      .then(() => {
        history.push("/")
      })
      .catch(() => {
        setError("Failed to create group")
      })
      .finally(() => {
        setLoading(false)
      })
  
   ex.preventDefault();
  }

  return (
    <>
    <Card>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group id="group-name">
            <Form.Label className="h3">Group Name</Form.Label>
            <Form.Control
              disabled={loading}
              type="text"
              ref={groupNameRef}
              required
              placeholder="Name your group"
            />
          </Form.Group>
        
          <MultipleEmail/>
        
          <Button className="w-100 mt-2" type="submit">
            Create group
          </Button>

        </Form>
      </Card.Body>
    </Card>
      
    </>
  )
}