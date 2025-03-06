import { message } from "antd"
import axios from "axios"
import JsPDF from "jspdf"
import QRCode from "qrcode"
import moment from "moment"
moment.locale("es")
import { createInvitation } from "../../events/helpers"

export const centerTextValue = (text, pixelsByLetter, length = 500, start = 150) => {
  return start + Math.floor((length - (text.length * pixelsByLetter)) / 2)
}

export const COORDINATES_BY_EVENT_TYPE = {
  "invitation_template":{
    valuesX: 20,
    valuesY: 0,
    subtitleX: 20,
    subtitleY: 0,
    dayX: 10,
    dayY: 10
  },
  "baptism": {
    valuesX: 180,
    subtitleX: 185,
    dayX: 180,
    qrCodeX: -730
  },
  "wedding": {
    valuesX: 80,
    subtitleX: 80,
    dayX: 80
  },
  "graduation": {
    valuesX: -80,
    subtitleX: 20,
    dayX: 20,
    qrCodeX: -150,
    qrCodeY: -150
  },
  "quince_1": {
    valuesY: 150,
    valuesX: 85,
    subtitleX: 100,
    subtitleY: 40,
    dayX: 110,
    dayY: 130
  },
  "quince_2": {
    valuesY: 30,
    valuesX: 170,
    subtitleY: -20,
    subtitleX: 170,
    dayX: 150,
    dayY: -35
  },
  "graduation2":{
    valuesX: 55,
    valuesY: 710,
    qrCodeY: 800,
    qrCodeX: 450,
    designH: 1400,
    designW: 1400,
    subtitleX: -101,
    subtitleY: 695,
    dayX: 215,
    dayY: 733
  },
  "graduation3":{
    valuesX: 355,
    valuesY: 470,
    subtitleX: 360,
    subtitleY: 465,
    dayX: 350,
    dayY: 480,
    qrCodeY: 730,
    qrCodeX: -97,
    designH: 1400,
    designW: 1500
  },
  "graduation4":{
    valuesX: 350,
    valuesY: 870,
    subtitleX: 350,
    subtitleY: 875,
    dayX: 350,
    dayY: 870,
    qrCodeY: 800,
    qrCodeX: 450,
    designH: 1400,
    designW: 1500
  },
  "graduation5":{
    valuesX: 480,
    valuesY: 1150,
    subtitleX: 500,
    subtitleY: 755,
    dayX: 480,
    dayY: 1090,
    qrCodeY: 1000,
    qrCodeX: 750,
    designH: 1600,
    designW: 1750
  }
}

const getCenteredXCoordinate = (text, length, position) => {
  return position - length / 2
}

const getCenteredYCoordinate = position => {
  return position + (38 * 0.45) / 2
}

export const invitationPDF = async (event, invitation, pdf, dimensions) => {
  const { id, invitationName, invitationTables, numberGuests } = invitation
  const { eventDate, name, digitalPass } = event

  const itemsByKey = digitalPass?.canvaMap?.coordinates.reduce((acc, curr) => {
    acc[curr.key] = curr
    return acc
  }, {})

  const {
    valuesX = 0,
    valuesY = 0,
    qrCodeX = 0,
    qrCodeY = 0,
    designH = 540,
    designW = 960,
    subtitleX = 0,
    subtitleY = 0,
    dayX = 0,
    dayY = 0
  } = COORDINATES_BY_EVENT_TYPE[event.type] || {}

  const template = new Image()
  template.src = digitalPass?.fileUrl || `/assets/${event.type ? `${event.type}.webp` : "invitation_template.webp"}`
  pdf.addImage(template, "PNG", 0, 0, dimensions?.width || designW, dimensions?.height || designH)

  pdf.setFont("helvetica", "normal")

  const title = itemsByKey?.["Nombre del evento"]
  const titleX = title ? getCenteredXCoordinate(name, pdf.getTextWidth(name), title?.coordinateX) : centerTextValue(name, 15) + valuesX
  const titleCustomConfig = JSON.parse(title?.customConfig || "{}")
  pdf.setFontSize(titleCustomConfig.fontSize || 38)
  pdf.setTextColor(titleCustomConfig.fontColor || "#000")
  pdf.setFont("helvetica", "bold")
  pdf.text(name, titleX, title ? getCenteredYCoordinate(title?.coordinateY) : 180 + valuesY)

  const guest = itemsByKey?.["Nombre de invitado"]
  const invitationX = guest ? getCenteredXCoordinate(invitationName, pdf.getTextWidth(invitationName), guest?.coordinateX) : centerTextValue(invitationName, 20) + valuesX
  const guestCustomConfig = JSON.parse(guest?.customConfig || "{}")
  pdf.setFontSize(guestCustomConfig.fontSize || 38)
  pdf.setTextColor(guestCustomConfig.fontColor || "#000")
  pdf.setFont("helvetica", "normal")
  pdf.text(invitationName, invitationX, guest ? getCenteredYCoordinate(guest?.coordinateY) : 230 + valuesY)

  const guestsNumber = itemsByKey?.["# de invitados"]
  const guestNumberLabel = `${numberGuests} Invitados`
  const guestsNumberCustomConfig = JSON.parse(guestsNumber?.customConfig || "{}")
  pdf.setFontSize(guestsNumberCustomConfig.fontSize || 38)
  pdf.setTextColor(guestsNumberCustomConfig.fontColor || "#000")
  pdf.text(guestNumberLabel, guestsNumber ? getCenteredXCoordinate(guestNumberLabel, pdf.getTextWidth(guestNumberLabel), guestsNumber?.coordinateX) : 300 + valuesX, guestsNumber ? getCenteredYCoordinate(guestsNumber?.coordinateY) : 280 + valuesY)

  const tables = `Mesa(s): ${invitationTables.map(el => {
    const number = el.table.split("-")[1]
    if (number.includes("main")){
      if (number.length === 4) {
        return "Honor"
      } else {
        return `E${number[4]}`
      }
    } else {
      return number
    }
  }).join(", ")}`
  const table = itemsByKey?.Mesa
  const tableCustomConfig = JSON.parse(table?.customConfig || "{}")
  pdf.setFontSize(tableCustomConfig.fontSize || 38)
  pdf.setTextColor(tableCustomConfig.fontColor || "#000")
  pdf.text(tables, table ? getCenteredXCoordinate(tables, pdf.getTextWidth(tables), table?.coordinateX) : centerTextValue(tables, 15) + dayX, table ? getCenteredYCoordinate(table?.coordinateY) : 320 + dayY)

  const dateCoordinate = itemsByKey?.Fecha
  const momentDate = moment(eventDate)
  const date = momentDate.format("DD [de] MMMM")
  const dateX = dateCoordinate ? getCenteredXCoordinate(date, pdf.getTextWidth(date), dateCoordinate?.coordinateX) : centerTextValue(date, 15) + subtitleX - 100
  pdf.setFont("helvetica", "bold")
  const dateCustomConfig = JSON.parse(dateCoordinate?.customConfig || "{}")
  pdf.setFontSize(dateCustomConfig.fontSize || 38)
  pdf.setTextColor(dateCustomConfig.fontColor || "#000")
  pdf.text(date, dateX, dateCoordinate ? getCenteredYCoordinate(dateCoordinate?.coordinateY) : 360 + subtitleY)

  const timeCoordinate = itemsByKey?.Hora
  const time = momentDate.format("h:mm a")
  const timeX = timeCoordinate ? getCenteredXCoordinate(time, pdf.getTextWidth(time), timeCoordinate?.coordinateX) : centerTextValue(date, 15) + subtitleX + 100
  const timeCustomConfig = JSON.parse(timeCoordinate?.customConfig || "{}")
  pdf.setFontSize(timeCustomConfig.fontSize || 38)
  pdf.setTextColor(timeCustomConfig.fontColor || "#000")
  pdf.text(time, timeX, timeCoordinate ? getCenteredYCoordinate(timeCoordinate?.coordinateY) : 360 + subtitleY)

  const QR = await QRCode.toDataURL(
    `${process.env.NEXT_PUBLIC_APP_URI}/qr/${id}`
  )
  const QR_COORD = itemsByKey?.QR_CODE
  pdf.addImage(QR, "PNG", QR_COORD?.coordinateX || 755 + qrCodeX, QR_COORD?.coordinateY || 320 + qrCodeY, itemsByKey ? 250 : 180, itemsByKey ? 250 : 180)

  return pdf
}

export const sendInvitation = async (invitation, file) => {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("phone", invitation.phone)
    formData.append("invitationId", invitation.id)
    formData.append("invitationName", invitation.invitationName)

    await axios.post("/api/whatsapp/send-message", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    message.success("Invitación enviada")
  } catch (e) {
    message.error("Error al enviar invitación")
  }
}

export const generatePDF = async (event, invitation, dimensions) => {
  const {
    designW = 960,
    designH = 540
  } = COORDINATES_BY_EVENT_TYPE[event.type] || {}
  if (invitation.phone) {
    let pdf = new JsPDF("l", "px", [dimensions?.width || designW, dimensions?.height || designH])
    pdf = await invitationPDF(event, invitation, pdf, dimensions)

    const file = pdf.output("blob")
    await sendInvitation(invitation, file)
  }
}

export const handleSaveHelper = async (event, form, guests) => {

  await form.validateFields()
  const values = await form.getFieldsValue()

  values.arrivedGuests = 0
  values.event = event.id
  values.invitationTables = Array.from(guests.selected)
  values.eventTableDistribution = guests.distribution
  values.phone = `${values.phone.countryCode || "52"}${values.phone.number}`

  const result = await createInvitation(values)

  form.resetFields()
  return result.invitation
}
