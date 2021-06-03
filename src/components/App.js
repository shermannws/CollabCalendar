import React from "react"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import NavbarPage from "./NavbarPage"
import PrivateRoute from "./PrivateRoute"
import CoverPage from "./CoverPage"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/" component={NavbarPage} />
          <PrivateRoute path="/profile" component={NavbarPage} />
          <PrivateRoute path="/update-profile" component={NavbarPage} />
          
          <Route path="/signup" component={CoverPage} />
          <Route path="/login" component={CoverPage} />
          <Route path="/forgot-password" component={CoverPage} />
        </Switch>
      </AuthProvider>
    </Router>
  )
}

export default App
