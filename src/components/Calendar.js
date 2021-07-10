import React, { useEffect, useState } from 'react'
import { Badge } from 'react-bootstrap'
import { format, startOfMonth } from 'date-fns'
import {
  MonthlyBody,
  MonthlyDay,
  MonthlyCalendar,
  MonthlyNav,
  DefaultMonthlyEventItem
} from '@zach.codes/react-calendar'
import { db } from "../firebase"
import { useAuth } from "../contexts/AuthContext"
import '../styles/Calendar.css'

export const MyMonthlyCalendar = () => {
  let [currentMonth, setCurrentMonth] = useState(
    startOfMonth(new Date())
  );

  const [data, setData] = useState([])
  const { currentUser } = useAuth()

  async function fetchEvents() {
    const userDocRef = db.collection('users').doc(currentUser.email);
    await userDocRef.get().then((doc) => {
      if (doc.data().events_confirmed !== undefined) {
        doc.data().events_confirmed.forEach(async (eventid) => {
  
          const eventDocRef = db.collection('events').doc(eventid)
          await eventDocRef.get().then((event) => {
            setData(data => [...data, 
              {
                title: event.data().title, 
                date: new Date(event.data().confirmed_date)
              }])
          })
        })
      }
    })
  }

  useEffect(() => {
    fetchEvents();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <MonthlyCalendar
      currentMonth={currentMonth}
      onCurrentMonthChange={date => setCurrentMonth(date)}
    >
      <Badge className="pt-4"> <MonthlyNav /> </Badge>
      <MonthlyBody
        events={data}
      >
        <MonthlyDay className="primary"
          renderDay={data =>
            data.map((item, index) => (
              <DefaultMonthlyEventItem
                key={index}
                title={item.title}
                // Format the date here to be in the format you prefer
                date={format(item.date, 'k:mm')}
              />
            ))
          }
        />
      </MonthlyBody>
    </MonthlyCalendar>
  );
};