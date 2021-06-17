import React from 'react';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/style.css';

class MultipleEmail extends React.Component {
  state = {
    emails: [],
  };
 
  render() {
    const { emails } = this.state;

    return (
      <>
        <h3>Emails</h3>
        <ReactMultiEmail
          placeholder="Enter the emails of your invitees"
          emails={emails}
          onChange={(_emails) => {
            this.setState({ emails: _emails });
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
      </>
    );
  }
}
 
export default MultipleEmail;