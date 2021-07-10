import React, { useState, useEffect } from "react"
import ScheduleSelector from "react-schedule-selector"
import { useEvents } from "../contexts/EventsContext"
import { Popover, OverlayTrigger, Button } from 'react-bootstrap'

export default function ScheduleComponent() {
  const { currentEvent } = useEvents()
  const [schedule, setSchedule] = useState([])
  const [tracker, setTracker] = useState({})


  function fetchResponses() {
    let responses = currentEvent.responses
    let finalSchedule = []
    let finalTracker = {}
    if (responses === undefined) {
      return
    } else {
      for (const invitee in responses) {
        let response = responses[invitee]
        let temp = finalSchedule.concat[response]
        temp = [...new Set([...finalSchedule,...response])]
        finalSchedule = temp


        for (const time in response) {
          const currentTime = response[time]
          if (finalTracker[currentTime] === undefined) {
            finalTracker[currentTime] = []
          }
          
          finalTracker[currentTime].push(invitee)
        }
      }
      setSchedule(finalSchedule)
      setTracker(finalTracker)
    }
  }

  function renderGivenTime(newSchedule) {
    const changedSchedule = JSON.parse(JSON.stringify(newSchedule))
    const currentSchedule = JSON.parse(JSON.stringify(schedule))
    const difference = currentSchedule
                        .filter(x => !changedSchedule.includes(x))
                        .concat(changedSchedule.filter(x => !currentSchedule.includes(x)))
    const currentTime = difference[0]
    console.log(tracker[currentTime])
  }

  useEffect(() => {
    fetchResponses()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const popover = (invitees) => (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Invitee(s) who are available</Popover.Title>
      <Popover.Content>
        {invitees}
      </Popover.Content>
    </Popover>
  );

  const renderCustomDateCell = (time, selected, innerRef) => (
    <div style={{ textAlign: 'center' }} ref={innerRef}>
      {selected ? (

        <OverlayTrigger trigger="hover" placement="top" overlay={popover(tracker[JSON.parse(JSON.stringify(time))].join(", "))}>
          <Button className="w-100" variant="outline-success"> {tracker[JSON.parse(JSON.stringify(time))].length} available</Button> 
        </OverlayTrigger>
      )
        : 
        <Button disabled className="w-100" variant="secondary"> - </Button>}
    </div>
  )

  return (
    <>
    <ScheduleSelector
      selection={schedule}
      startDate={currentEvent.window_start}
      numDays={1+(new Date(currentEvent.window_end).getTime()-new Date(currentEvent.window_start).getTime())/1000/60/60/24}
      minTime={0}
      maxTime={24}
      hourlyChunks={1}
      onChange={renderGivenTime}
      timeFormat={"HHmm"}
      renderDateCell={renderCustomDateCell}
    />
    </>
  )
}
