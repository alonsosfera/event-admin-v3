import nodemailer from "nodemailer"

export default async (req, res) => {
  return new Promise(resolve => {
    const { email: to, mailable: path, subject } = JSON.parse(req.body)

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      secure: true,
      port: 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    })

    const mailOption = {
      from: process.env.MAIL_USER,
      to,
      subject,
      attachments: [
        {
          filename: "Invitacion.pdf",
          path,
          contentType: "application/pdf",
          encoding: "base64"
        }
      ]
    }

    transporter.sendMail(mailOption, err => {
      if (err) {
        console.log(err)
        res.status(500).end()
      } else {
        res.end()
      }
      return resolve()
    })
  })
}
