import React, {useRef} from 'react';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/style.css';
 
interface IProps {}
interface IState {
  emails: string[];
}
class MultipleEmail extends React.Component<IProps, IState> {
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
          onChange={(_emails: string[]) => {
            this.setState({ emails: _emails });
          }}
          validateEmail={email => {
            return isEmail(email); // return boolean
          }}
          getLabel={(
            email: string,
            index: number,
            removeEmail: (index: number) => void,
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