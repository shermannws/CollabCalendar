import React, { useState } from "react"
import { Navbar, Image, NavDropdown, Alert, Container } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { useHistory, Switch, Route } from "react-router-dom"
import logo from "../images/logo-name.png"
import NewGroupPage from "./NewGroupPage"
import Dashboard from "./Dashboard"
import Profile from "./Profile"
import UpdateProfile from "./UpdateProfile"
import ViewGroupPage from "./ViewGroupPage"
import RespondEventPage from "./RespondEventPage"
import ViewEventPageFromGroupPage from "./ViewEventPageFromGroupPage"

export default function NavbarPage() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  return (
    <>
      <Container
        className="d-flex align-items-start justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100">
          <Navbar>
            <Navbar.Brand>
              <a href="/"><Image href="/" src={logo} width={300} fluid/></a>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
              <NavDropdown 
                title={ currentUser.photoURL ?
                        <div className="pull-right">
                            <Image className="thumbnail-image" 
                                src={currentUser.photoURL} 
                                alt="ProfilePicture"
                                width="70"
                                roundedCircle
                            /> 
                        </div>
                        :
                        <div className="pull-right">Signed in as: {currentUser.email}</div>}>
                  <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>Log Out</NavDropdown.Item>
              </NavDropdown>
            </Navbar.Collapse>
          </Navbar>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Container className="w-100 d-flex align-items-start justify-content-center">
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route path="/profile" component={Profile} />
              <Route path="/update-profile" component={UpdateProfile} />
              <Route path="/new-group-page" component={NewGroupPage} />
              <Route path="/view-group" component={ViewGroupPage} />
              <Route path="/respond-event" component={RespondEventPage} />
              <Route path="/view-event-page-1" component={ViewEventPageFromGroupPage} />
            </Switch>
          </Container>
          
          
        </div>  
      </Container>
    </>
  )
}