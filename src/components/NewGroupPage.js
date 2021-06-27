import React, { useRef, useState } from "react"
import { Form, Button, Alert, Card } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { db } from "../firebase"
import MultipleEmail from "./MultipleEmail"

export const UsersContext = React.createContext() 

export default function NewGroupPage() {

 const { currentUser } = useAuth()
 const groupNameRef = useRef()
 const history = useHistory()
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState("")
 const [emails, setEmails] = useState([])

 function handleSubmit(ex) {
  ex.preventDefault();

  const promises = []
  setLoading(true)
  setError("")

  promises.push(db.collection("groups").add({
    groupName: groupNameRef.current.value,
    admins: [currentUser.email, ]
  }).then( async (docRef) => {
    await db.collection("groups").doc(docRef.id).set({
      invitees: emails,
      groupId: docRef.id,
    }, { merge: true })
    
    await db.collection("users").doc(currentUser.email).get().then(async(doc) => {
      let groupsAdminOf = doc.data().groupsAdminOf
      console.log(groupsAdminOf)
      if (groupsAdminOf === undefined) {
        groupsAdminOf = []
        console.log(123)
      }
      groupsAdminOf.unshift(docRef.id)
      await db.collection("users").doc(currentUser.email).update({
        groupsAdminOf: groupsAdminOf
      })
    })

  }).catch(function(error) {
    console.error("Error adding document: ", error);
  }))
  

  Promise.all(promises)
      .then(() => {
        history.push("/")
        history.go(0)
      })
      .catch(() => {
        setError("Failed to create group")
      })
      .finally(() => {
        setLoading(false)
      })
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
          <UsersContext.Provider value={{emails, setEmails}}>
            <MultipleEmail />
          </UsersContext.Provider>   
            
          <Button className="w-100 mt-2" type="submit">
            Create group
          </Button>

        </Form>
      </Card.Body>
    </Card>
      
    </>
  )
}