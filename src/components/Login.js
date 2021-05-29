import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Container, Row, Col, Image } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import logo from "../images/logo.png"
import googleicon from "../images/google-icon.svg"

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { loginWithEmail, loginWithGoogle } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await loginWithEmail(emailRef.current.value, passwordRef.current.value)
      history.push("/")
    } catch {
      setError("Failed to log in")
    }

    setLoading(false)
  }

  async function handleGoogleSignIn(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await loginWithGoogle()
      history.push("/")
    } catch {
      setError("Failed to log in")
    }

    setLoading(false)
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={12} md={6} className="d-flex align-items-center justify-content-center p-4">
            <Image src ={logo} alt="CollabCalendar Logo" fluid />
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <Card.Body>
                <h2 className="text-center mb-4">Log In</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required />
                  </Form.Group>
                  <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required />
                  </Form.Group>
                  <Button disabled={loading} className="w-100" type="submit">
                    Log In
                  </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
              </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
              Need an account? <Link to="/signup">Sign Up</Link>
            </div>
            <Button 
            disabled={loading} 
            className="w-100 mt-4 p-2" 
            variant="outline-primary"
            type="submit" 
            onClick={handleGoogleSignIn}>
              <Image src={googleicon} className="mr-3" width={30} fluid />Log In with Google
            </Button>
          </Col>
        </Row>
      </Container>        
    </>
  )
}
