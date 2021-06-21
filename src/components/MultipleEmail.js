import React, { useState } from 'react';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import NewGroupPage from './NewGroupPage';
import 'react-multi-email/style.css';

export const UsersContext = React.createContext() 

export default function MultipleEmail() {
  const [emails, setEmails] = useState([])

  return (
    <>
      <h3>Emails</h3>
      <ReactMultiEmail
        placeholder="Enter the emails of your invitees"
        emails={emails}
        onChange={(_emails) => {
          // console.log(_emails)
          setEmails(_emails )
        }}
        validateEmail={email => {
          return isEmail(email); // return boolean
        }}
        getLabel={(
          email,
          index,
          removeEmail
        ) => {
          return (
            <div data-tag key={index}>
              {email}
              <span data-tag-handle onClick={() => removeEmail(index)}>
                ×
              </span>
            </div>
          );
        }}
      />
      <br />
      <h4>We will send email invites to the following people:</h4>
      <p>{emails.join(', ') || 'None'}</p>
      <UsersContext.Provider value={emails}>
        {/*this is the part with bug, suppose to be <NewGroupPage /> here, but if I add that then the whole app hangs */}
        {/* IF dont add leh then when it reaches NewGroupPage value just be undefined */}
      </UsersContext.Provider>      
    </>
  )
}