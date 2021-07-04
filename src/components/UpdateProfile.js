import React, { useRef, useState, useEffect } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { db } from "../firebase"

export default function UpdateProfile() {
  const nameRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { currentUser, updatePassword, updateDisplayName } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const [isGoogle, setIsGoogle] = useState(false)

  useEffect(() => {
    db.collection("users").doc(currentUser.email).get().then((doc) => {
      doc.data().isGoogleSignIn ? setIsGoogle(true) : setIsGoogle(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  
  function handleSubmit(e) {
    e.preventDefault()
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    const promises = []
    setLoading(true)
    setError("")

    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value))
    }
    if (nameRef.current.value !== currentUser.displayName) {
      promises.push(updateDisplayName(nameRef.current.value))
    }

    Promise.all(promises)
      .then(() => {
        history.push("/profile")
      })
      .catch(() => {
        setError("Failed to update account")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <Card className="w-100">
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="display-name">
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                type="text"
                ref={nameRef}
                required
                defaultValue={currentUser.displayName}
              />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                disabled
                defaultValue={currentUser.email}
              />
            </Form.Group>
            {
              isGoogle ?
              <>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  placeholder="Accounts logged in with Google are unable to change password."
                  disabled
                />
              </Form.Group>
              <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordConfirmRef}
                  placeholder="Accounts logged in with Google are unable to change password."
                  disabled
                />
              </Form.Group>
              </>
              :
              <>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  placeholder="Leave blank to keep the same"
                />
              </Form.Group>
              <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordConfirmRef}
                  placeholder="Leave blank to keep the same"
                />
              </Form.Group>
              </>
            }
            
            <Button disabled={loading} className="w-100" type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
        <div className="w-100 text-center mt-2 mb-4">
          <Link to="/profile">Cancel</Link>
        </div>
      </Card>
      
    </>
  )
}
