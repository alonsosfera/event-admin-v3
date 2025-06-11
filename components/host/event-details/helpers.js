import { message } from "antd"
import axios from "axios"
import JsPDF from "jspdf"
import QRCode from "qrcode"
import dayjs from "../../shared/time-zone"
dayjs.locale("es")

import { createInvitation } from "../../events/helpers"

export const centerTextValue = (text, pixelsByLetter, length = 500, start = 150) => {
  return start + Math.floor((length - (text.length * pixelsByLetter)) / 2)
}

const getCenteredXCoordinate = (text, width, position) => {
  return position - (width / 2)
}

const getLeftXCoordinate = (position) => {
  return position
}

const getXCoordinateByAlignment = (text, width, position, alignment) => {
  if (alignment === "left") {
    return getLeftXCoordinate(position)
  } else {
    return getCenteredXCoordinate(text, width, position)
  }
}

const getCenteredYCoordinate = position => {
  return position + 10
}

export const invitationPDF = async (event, invitation, pdf, dimensions) => {
  const { id, invitationName, invitationTables, numberGuests } = invitation
  const { eventDate, name, digitalPass } = event

  const itemsByKey = digitalPass?.canvaMap?.coordinates.reduce((acc, curr) => {
    acc[curr.key] = curr
    return acc
  }, {})

  const template = new Image()
  template.src = digitalPass?.fileUrl || `/assets/invitation_template.webp`
  pdf.addImage(template, "PNG", 0, 0, dimensions?.width || 960, dimensions?.height || 540)

  const defaultCenterX = (dimensions?.width || 960) / 2

  pdf.setFont("helvetica", "normal")

  // Event name
  const title = itemsByKey?.["Nombre del evento"]
  const titleCustomConfig = JSON.parse(title?.customConfig || "{}")
  pdf.setFontSize(titleCustomConfig.fontSize || 38)
  pdf.setTextColor(titleCustomConfig.fontColor || "#000")
  pdf.setFont("helvetica", "bold")
  const titleX = getXCoordinateByAlignment(
    name, 
    pdf.getTextWidth(name), 
    title?.coordinateX || defaultCenterX, 
    titleCustomConfig.textAlign || "center"
  )
  pdf.text(name, titleX, title?.coordinateY || 180)

  // Guest name
  const guest = itemsByKey?.["Nombre de invitado"]
  const guestCustomConfig = JSON.parse(guest?.customConfig || "{}")
  pdf.setFontSize(guestCustomConfig.fontSize || 38)
  pdf.setTextColor(guestCustomConfig.fontColor || "#000")
  pdf.setFont("helvetica", "normal")
  const guestX = getXCoordinateByAlignment(
    invitationName, 
    pdf.getTextWidth(invitationName), 
    guest?.coordinateX || defaultCenterX,
    guestCustomConfig.textAlign || "center"
  )
  pdf.text(invitationName, guestX, guest?.coordinateY || 230)

  // Number of guests
  const guestsNumber = itemsByKey?.["# de invitados"]
  const guestNumberLabel = `${numberGuests} Invitados`
  const guestsNumberCustomConfig = JSON.parse(guestsNumber?.customConfig || "{}")
  pdf.setFontSize(guestsNumberCustomConfig.fontSize || 38)
  pdf.setTextColor(guestsNumberCustomConfig.fontColor || "#000")
  pdf.setFont("helvetica", "normal")
  const guestsX = getXCoordinateByAlignment(
    guestNumberLabel, 
    pdf.getTextWidth(guestNumberLabel), 
    guestsNumber?.coordinateX || defaultCenterX,
    guestsNumberCustomConfig.textAlign || "center"
  )
  pdf.text(guestNumberLabel, guestsX, guestsNumber?.coordinateY || 280)

  // Tables
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
  pdf.setFont("helvetica", "normal")
  const tableX = getXCoordinateByAlignment(
    tables, 
    pdf.getTextWidth(tables), 
    table?.coordinateX || defaultCenterX,
    tableCustomConfig.textAlign || "center"
  )
  pdf.text(tables, tableX, table?.coordinateY || 320)

  // Date and Time
  const dateCoordinate = itemsByKey?.Fecha
  const timeCoordinate = itemsByKey?.Hora
  const momentDate = dayjs.utc(eventDate).tz('America/Mexico_City')
  const date = momentDate.format("DD [de] MMMM")
  const time = momentDate.format("h:mm a")

  // Calculate positions for date and time to be side by side
  const dateCustomConfig = JSON.parse(dateCoordinate?.customConfig || "{}")
  pdf.setFontSize(dateCustomConfig.fontSize || 38)
  pdf.setTextColor(dateCustomConfig.fontColor || "#000")
  pdf.setFont("helvetica", "bold")

  const dateWidth = pdf.getTextWidth(date)
  const timeWidth = pdf.getTextWidth(time)
  const spacing = 40 // Space between date and time
  const totalWidth = dateWidth + timeWidth + spacing

  const defaultDateX = defaultCenterX - (totalWidth / 2)
  const defaultTimeX = defaultCenterX + (totalWidth / 2) - timeWidth

  const dateX = getXCoordinateByAlignment(
    date, 
    dateWidth, 
    dateCoordinate?.coordinateX || defaultDateX,
    dateCustomConfig.textAlign || "center"
  )
  pdf.text(date, dateX, dateCoordinate?.coordinateY || 360)

  const timeCustomConfig = JSON.parse(timeCoordinate?.customConfig || "{}")
  pdf.setFontSize(timeCustomConfig.fontSize || 38)
  const timeX = getXCoordinateByAlignment(
    time, 
    timeWidth, 
    timeCoordinate?.coordinateX || defaultTimeX,
    timeCustomConfig.textAlign || "center"
  )
  pdf.text(time, timeX, timeCoordinate?.coordinateY || 360)

  // QR Code
  const QR = await QRCode.toDataURL(`${process.env.NEXT_PUBLIC_APP_URI}/qr/${id}`)
  const QR_COORD = itemsByKey?.QR_CODE
  const qrCustomConfig = JSON.parse(QR_COORD?.customConfig || "{}")
  const qrSize = qrCustomConfig.qrSize || 250
  
  pdf.addImage(QR, "PNG", 
    QR_COORD?.coordinateX || 755, 
    QR_COORD?.coordinateY || 320, 
    qrSize,
    qrSize
  )

  return pdf
}

export const sendInvitation = async (invitation, file, premium) => {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("phone", invitation.phone)
    formData.append("invitationId", invitation.id)
    formData.append("invitationName", invitation.invitationName)
    formData.append("premium", premium)

    await axios.post("/api/whatsapp/send-message", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    message.success("Invitación enviada")
  } catch (e) {
    message.error("Error al enviar invitación")
  }
}

export const generatePDF = async (event, invitation, dimensions) => {
  if (invitation.phone) {
    // Determine if the image is portrait or landscape based on dimensions
    const orientation = dimensions && dimensions.height > dimensions.width ? "p" : "l"
    
    let pdf = new JsPDF(orientation, "px", [
      dimensions?.width || 960, 
      dimensions?.height || 540
    ])
    
    pdf = await invitationPDF(event, invitation, pdf, dimensions)

    const file = pdf.output("blob")
    const premium = event.premiumInvitation ? true : false;

    await sendInvitation(invitation, file, premium)
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
