import { createTransport } from 'nodemailer'
import SMPTTransport from 'nodemailer/lib/smtp-transport'

const transport = createTransport(
  new SMPTTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
)

export const sendMail = (email: string, code: string | number) => {
  transport.sendMail(
    {
      from: process.env.EMAIL,
      to: email,
      text: `${code}`,
    },
    (err, info) => {
      if (err) {
        console.log('Error ', err.message)
      } else {
        console.log(info.response)
      }
    }
  )
}
