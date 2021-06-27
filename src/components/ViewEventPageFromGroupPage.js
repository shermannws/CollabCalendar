import React, {useState} from "react"
import { Card, Alert } from "react-bootstrap"
import { useEvents } from "../contexts/EventsContext"

export default function ViewEventPageFromGroupPage() {

    const { currentEvent } = useEvents()
    const [error, setError] = useState("")


    return (
        <Card className="w-100" style={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10
        }}>
            <Card.Title>Event: <strong>{currentEvent.title}</strong></Card.Title>
            <Card.Text>Invitees: {currentEvent.invitees.length === 0 ? "None" : currentEvent.invitees.join(", ")}</Card.Text>
            <Card.Text>Waiting on responses from: {currentEvent.invitees.length === 0 ? "None" : currentEvent.invitees.join(", ")}</Card.Text>
            <Card.Text>Timeframe for event to be held within: <strong>{currentEvent.window_start}</strong> to <strong>{currentEvent.window_end}</strong> </Card.Text>
            <Card.Text>Comfirmed date: {currentEvent.comfirmed_date === null ? "Not confirmed yet" : currentEvent.comfirmed_date}</Card.Text>
        </Card>
    )
    
}
