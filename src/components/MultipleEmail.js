import React, { useContext } from 'react';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import { UsersContext } from './NewGroupPage'

// returns the functional component to display multiple email in the same placeholder
export default function MultipleEmail() {
  require("react-multi-email/style.css")
  const { emails, setEmails } = useContext(UsersContext)

  return (
    <>
      <h3>Emails</h3>
      <ReactMultiEmail
        placeholder="Enter the emails of your invitees"
        emails={emails}
        onChange={(_emails) => {
          setEmails(_emails )
        }}
        validateEmail={email => {
          return isEmail(email)
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
         
    </>
  )
}