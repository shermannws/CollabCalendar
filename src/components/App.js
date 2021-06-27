import React from "react"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import NavbarPage from "./NavbarPage"
import PrivateRoute from "./PrivateRoute"
import CoverPage from "./CoverPage"
import { EventsProvider } from "../contexts/EventsContext"

function App() {
  return (
    <Router>
      <AuthProvider>
        <EventsProvider>
          <Switch>
            <PrivateRoute exact path="/" component={NavbarPage} />
            <PrivateRoute path="/profile" component={NavbarPage} />
            <PrivateRoute path="/update-profile" component={NavbarPage} />
            <PrivateRoute path="/new-group-page" component={NavbarPage} />
            <PrivateRoute path="/view-group" component={NavbarPage} />
            <PrivateRoute path="/respond-event" component={NavbarPage} />

            <Route path="/signup" component={CoverPage} />
            <Route path="/login" component={CoverPage} />
            <Route path="/forgot-password" component={CoverPage} />
          </Switch>
        </EventsProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
