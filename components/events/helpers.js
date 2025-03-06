import axios from "axios"
import JsPDF from "jspdf"
import { message } from "antd"
import { parseCookies } from "nookies"

import { centerTextValue } from "../host/event-details/helpers"

const { token } = parseCookies()

export const getEvents = setState => {
  axios.get("/api/events", { headers: { "Authorization": `Bearer ${token}` } })
    .then(res => {
      const { data: { result = [] } } = res
      setState({ edit: false, isModalOpen: false, isLoading: false, events: result })
    })
}

export const getEventById = async (setState, eventId) => {
  if (!eventId) return
   const res = await axios.get(`/api/events?id=${eventId}`, { headers: { "Authorization": `Bearer ${token}` } })
  const { data = {  } } = res
  setState && setState({ edit: false, isModalOpen: false, isLoading: false, events: [data] })
  return data
}

export const getEventByIdService = async ({ eventId }) => {
  if (!eventId) return
  const res = await axios.get(`/api/events?id=${eventId}`, { headers: { "Authorization": `Bearer ${token}` } })
  const { data = {  } } = res
  return data
}

export const getEventsByHost = (id, setState) => {
  axios.get(`/api/events/host/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
    .then(res => {
      const { data: { result = [] } } = res
      setState({ isLoading: false, events: result, filteredEvents: undefined })
    })
}

export const deleteEvent = async id => {
  const deleting = message.loading("Borrando...")
  await axios.delete(`/api/events?id=${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  message.success("Borrado exitosamente")
  deleting()
}

export const createInvitation = async values => {
  const { data: { result } } = await axios.post("/api/invitations", values, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  return result
}

export const updateInvitation = async (values, id) => {
  const { data: { result } } = await axios.put(`/api/invitations?invitationId=${id}`, values, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  return result
}

export const deleteInvitation = async id => {
  const deleting = message.loading("Borrando...")
  await axios.delete(`/api/invitations?id=${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  message.success("Borrado exitosamente")
  deleting()
}

export const createEvent = async values => {
  await axios.post("/api/events", values, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export const updateEvent = async (values, id) => {
  const { data: { result } } = await axios.put(`/api/events/update/${id}`, values, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  return result
}

export const getRooms = setState => {
  axios.get("/api/rooms", { headers: { "Authorization": `Bearer ${token}` } })
    .then(res => {
      const { data: { result = [] } } = res
      setState(result)
    })
}

export const getHosts = setState => {
  axios.get("/api/auth/users/hosts", { headers: { "Authorization": `Bearer ${token}` } })
    .then(res => {
      const { data = [] } = res
      setState(data)
    })
}

export const getInvitations = async eventId => {
  const { data: { result = [] } } = await axios.get(`/api/invitations?eventId=${eventId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  return result
}

export const createEventInvitationsPDF = (event, invitations, mapImage) => {
  const pdf = new JsPDF("p", "pt", "a4")

  const title = `Lista de invitados ${event.name}`
  const titleX = centerTextValue(title, 20, 500, 120)
  pdf.setFont("courier", "bold")
  pdf.setFontSize(24)
  pdf.text(title, titleX, 45)

  const columns = ["Nombre", "Invitados", "Mesa(s)", "Email"]

  invitations.sort((a, b) => {
    const mesaA = a.invitationTables[0]?.table.split("-")[1] || 0
    const mesaB = b.invitationTables[0]?.table.split("-")[1] || 0

    return (isNaN(mesaA) ? 0 : mesaA) - (isNaN(mesaB) ? 0 : mesaB)
  })

  const invitationsRows = invitations.map(invitation => {
    const mesa = invitation.invitationTables[0]?.table === "table-main" ? "Mesa de honor" : invitation.invitationTables[0]?.table.split("-")[1]

    return [
      invitation.invitationName,
      invitation.numberGuests,
      invitation.invitationTables.length > 1
        ? invitation.invitationTables.map(invitation => `${invitation.amount}xM${invitation.table.split("-")[1]}`)
        : mesa,
      invitation.email]
  })

  pdf.autoTable(columns, invitationsRows,
    { margin: { top: 70 } }
  )

  pdf.addPage(undefined)
  pdf.addImage(mapImage, "png", 20, 20, 600, 480)
  pdf.save(`Lista de invitaciones ${event.name}.pdf`)
}

export const checkInGuests = async (values, id) => {
  const { data: { result } } = await axios.put(`/api/invitations/${id}/check-in`, values, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  return result
}

export const getRoomMaps = async () => {
  const { data: { result = [] } } = await axios.get("/api/roomMap", {
    headers: { "Authorization": `Bearer ${token}` }
  })
  return result
}

export const getTableCoordinatesByRoomMaps = async ({ roomMapId }) => {
  const { data = [] } = await axios.get(`/api/roomMap/${roomMapId}/table-coordinates`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  return data
}

export const deleteRoomMap = async roomMapId => {
  const { data: { result = [] } } = await axios.delete(`/api/roomMap/${roomMapId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  return result
}

export const updateRoomMap = async (roomMapId, { roomMapName, roomMapCoordinates }) => {
  const { data: { result = [] } } = await axios.put(`/api/roomMap/${roomMapId}`, {
    name: roomMapName,
    roomMapCoordinates
  }, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  return result
}

export const createRoomMap = async ({ roomMapName, roomMapCoordinates, eventId }) => {
  const { data: { result = [] } } = await axios.post("/api/roomMap", {
    name: roomMapName,
    eventId,
    roomMapCoordinates
  }, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  return result
}

export const getRoomMapByEvent = async ({ eventId }) => {
  const { data } = await axios.get(`/api/events/${eventId}/roomMap`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  return data
}

export const getDesignsInvitations = async () => {
  const { data: { invitations = [] } } = await axios.get("/api/design/invitations", {
    headers: { "Authorization": `Bearer ${token}` }
  })
  return invitations
}

export async function getPassDesigns(eventId) {
  try {
    const response = await axios.get("/api/design/passes", {
      params: { eventId }
    })
    return (response.data.passes)
  } catch (error) {
    console.error("Error al obtener pases:", error)
  }
}
