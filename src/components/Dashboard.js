import React from "react"
// import {Card} from "react-bootstrap"
import {MyMonthlyCalendar} from "./Calendar"
import '@zach.codes/react-calendar/dist/calendar-tailwind.css'


export default function Dashboard() {

  return (
    <>
      <div>
        <MyMonthlyCalendar/>       
      </div>
    </>
  )
}