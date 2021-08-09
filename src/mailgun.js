// constants declarations for mailgun API
const api_key = process.env.REACT_APP_MAILGUN_API_KEY;
const domain = process.env.REACT_APP_MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain});   

// functions that triggers the sending of emails
// params:
// - emailTo: a string representing the recipient of the email
// - templateToUse: a string representing the prepared template that is being done by the developers through the mailgun console
// - subject: a string representing the subject of the email when sent
// - username: a string representing the name of the recipient
export default function SendEmail(emailTo, templateToUse, subject, username) {
    const data = {
        from: "Mailgun Sandbox <postmaster@sandbox727a14bb853641ec98fa086c9c0835d8.mailgun.org>",
        to: emailTo,
        template: templateToUse,
        subject: subject,
        recipient_name: username,
        "v:recipient_name": username        
    }
    mailgun.messages().send(data, (error, body) => {
        console.log(body);
    })
}