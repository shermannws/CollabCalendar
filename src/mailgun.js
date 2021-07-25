const api_key = 'ce8c07c2c218dcbcffdfb8ea2d3610b2-c4d287b4-bf12d3e6';
const domain = 'sandbox0492538666624865a089bf84da472dbb.mailgun.org';
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain});   

export default function SendEmail(emailTo, templateToUse, subject, username) {
    const data = {
        from: "Mailgun Sandbox <postmaster@sandbox0492538666624865a089bf84da472dbb.mailgun.org>",
        to: emailTo,
        template: templateToUse,
        subject: subject,
        recipient_name: username,
        "v:recipient_name": username        
    }
    mailgun.messages().send(data, (error, body) => {
        console.log(body)
    })
}