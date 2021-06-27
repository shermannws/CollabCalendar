import React from "react"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import NavbarPage from "./NavbarPage"
import PrivateRoute from "./PrivateRoute"
import { EventsProvider } from "../contexts/EventsContext"
import CoverPage from "./CoverPage"

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
<<<<<<< HEAD
            <PrivateRoute path="/respond-event" component={NavbarPage} />
=======
            <PrivateRoute path="/view-event-page-1" component={NavbarPage} />
>>>>>>> 29649bc7a6d705e3044ad8889efb8110f76780d1

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
