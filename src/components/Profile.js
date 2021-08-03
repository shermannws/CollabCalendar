import React, { useState } from "react"
import { Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"

// returns a functional component that displays the current users profile details
export default function Profile() {
  const { currentUser } = useAuth()
  const [error] = useState("")

  return (
    <>
      <Card className="w-100">
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Card.Text>
            <strong>Display Name:</strong> {currentUser.displayName}
          </Card.Text>
          <Card.Text>
            <strong>Email:</strong> {currentUser.email}
          </Card.Text>
          
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
    </>
  )
}
