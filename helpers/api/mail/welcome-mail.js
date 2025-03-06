import nodemailer from "nodemailer"
import ejs from "ejs"
import path from "path"

export const sendWelcomeMail = (email, user) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      secure: true,
      port: 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    })

    const file = path.join(process.cwd(), "helpers", "api", "mail", "welcome.ejs")

      ejs.renderFile(file, { user, from: process.env.MAIL_USER  }, (err, data) => {
      if (err) {
        return reject(`There was an error trying to load email template file: ${err}`)
      } else {
        const mainOptions = {
          subject: "Credenciales Salón La Joya",
          from: process.env.MAIL_USER,
          html: data,
          to: email
        }

        transporter.sendMail(mainOptions, err => {
          if (err) {
            return reject(`There was an error with mailer: ${err} `)
          } else {
            return resolve()
          }
        })
      }
    })
  })
}
