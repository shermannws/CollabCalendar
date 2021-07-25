const api_key = process.env.REACT_APP_MAILGUN_API_KEY;
const domain = process.env.REACT_APP_MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain});   

export default function SendEmail(emailTo, templateToUse, subject, username) {
    const data = {
        from: "Mailgun Sandbox <postmaster@sandboxe85e23368c4c436db4e8eaa439b4a881.mailgun.org>",
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