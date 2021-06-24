import React, { useContext, useState, useEffect } from "react"
import { db } from "../firebase"
import firebase from "firebase/app"

const EventsContext = React.createContext()

export function useEvents() {
  return useContext(EventsContext)
}

export function EventsProvider({ children }) {
  const [currentGroup, setCurrentGroup] = useState(JSON.parse(localStorage.getItem("group")))

  function addEvent() {
    
  }

  function readEvent() {

  }

  function updateEvent() {

  }

  function deleteEvent() {

  }

  useEffect(() => {
    localStorage.setItem("group", JSON.stringify(currentGroup))
  }, [currentGroup])

  const value = {
    currentGroup,
    setCurrentGroup
  }

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  )
}
 