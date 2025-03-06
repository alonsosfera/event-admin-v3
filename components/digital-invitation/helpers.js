import axios from "axios"

export const getEventByInvitationId = async invitationId => {
  const { data } = await axios.get(`/api/invitations/${invitationId}/event`)
  return data
}

export const getEventById = async eventId => {
  const { data } = await axios.get(`/api/events/byId/${eventId}`)
  return data
}
