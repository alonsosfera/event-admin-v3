import { prisma } from "../../../lib/prisma"
import short from "short-uuid"

export const getInvitationById = async (req, res) => {
  try {
    const { id } = req.query
    const result = await prisma.invitation.findUnique({
      where: { id: id.toString() },
      include: { event: true }
    })
    if (result) {
      res.json(result)
    } else {
      res.status(204).json({ error: "Invitación no encontrada" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al obtener la invitación." })
  }
}

export const getEventInvitations = async (req, res) => {
  try {
    const { eventId } = req.query
    const result = await prisma.invitation.findMany({
      where: { event: { id: eventId } },
      include: { event: true }
    })
    res.json({ result })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al obtener la invitación." })
  }
}

export const postNewInvitation = async (req, res) => {
  try {
    const { eventTableDistribution, ...invitationProperties } = req.body
    const invitation = await prisma.invitation.create({
      data: {
        ...invitationProperties,
        event: { connect: { id : invitationProperties.event } }
      }
    })

    const updatedEvent = await prisma.event.update({
      where: { id: invitationProperties.event },
      data: { tablesDistribution: eventTableDistribution },
      include: {
        room: true
      }
    })
    const { room: { name: room_name, id: roomId } = {}, ...event } = updatedEvent

    res.json({ result: { invitation, event: { ...event, room_name, roomId } } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al crear la invitación." })
  }
}

export const putEditInvitationById = async (req, res) => {
  const { invitationId } = req.query
  try {
    const result = await prisma.invitation.update({
      where: { id: invitationId },
      data: req.body
    })

    res.json({ result })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al actualizar la invitación." })
  }
}

export const deleteInvitationById = async (req, res) => {
  try {
    const { id } = req.query
    await prisma.invitation.delete({ where: { id } })
    res.status(200).end()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al eliminar la invitación." })
  }
}

export const getEventByInvitationById = async (req, res) => {
  try {
    const { id } = req.query
    const translator = short()
    const canvaInclude = { include: { canvaMap: { include: { coordinates: true } } } }
    const result = await prisma.invitation.findUnique({
      where: { id: translator.toUUID(id) },
      include: {
        event: {
          include: {
            digitalInvitation: canvaInclude,
            digitalPass: canvaInclude
          }
        }
      }
    })
    if (result) {
      res.json(result)
    } else {
      res.status(204).json({ error: "Invitación no encontrada" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al obtener el evento." })
  }
}

export const checkInGuest = async (req, res) => {
  try {
    const { id } = req.query
    const { guestsToCheckIn, event } = req.body
    const result = await prisma.invitation.update({
      where: { id },
      include: { event: true },
      data: { arrivedGuests: { increment: guestsToCheckIn } }
    })
    await prisma.event.update({
      where: { id: event.id },
      data: { arrivedGuests: { increment: guestsToCheckIn } }
    })
    res.json({ result })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al registrar invitado." })
  }
}
