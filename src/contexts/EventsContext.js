import React, { useContext, useState, useEffect } from "react"

// initialisting the events context
const EventsContext = React.createContext()

export function useEvents() {
  return useContext(EventsContext)
}

export function EventsProvider({ children }) {
  const [currentGroup, setCurrentGroup] = useState(JSON.parse(localStorage.getItem("group")))
  const [currentEvent, setCurrentEvent] = useState(JSON.parse(localStorage.getItem("event")))

  useEffect(() => {
    localStorage.setItem("group", JSON.stringify(currentGroup))
    localStorage.setItem("event", JSON.stringify(currentEvent))
  }, [currentGroup, currentEvent])

  const value = {
    currentGroup,
    setCurrentGroup,
    currentEvent,
    setCurrentEvent,
  }

  // returns the Context Provider in order for components that import the events context to see the "values"
  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  )
}