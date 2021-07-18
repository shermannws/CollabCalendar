import React from "react"
import { Container, Row, Col, Image, } from "react-bootstrap"
import logo from "../images/logo.png"

import Signup from "./Signup"
import Login from "./Login"
import ForgotPassword from "./ForgotPassword"
import { Switch, Route } from "react-router-dom"

export default function CoverPage() {

  return (
    <>
      <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
      >
        <div className="w-100">
          <Container fluid>
            <Row>
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center p-4">
                  <Image src ={logo} alt="CollabCalendar Logo" fluid />
              </Col>
              <Col xs={12} md={6}>
                  
                <Switch>
                  <Route path="/signup" component={Signup} />
                  <Route path="/login" component={Login} />
                  <Route path="/forgot-password" component={ForgotPassword} />
                </Switch>
                  
              </Col>
            </Row>
          </Container>  
        </div>   
      </Container>     
    </>
  )
}
