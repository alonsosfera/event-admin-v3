import { prisma } from "../../../lib/prisma"

export async function getInvitationDesigns(req, res) {
  try {
    const { query: { eventId } } = req
    const where = eventId ? { OR: [{ eventId }, { eventId: null }] } : { eventId: null }
    const invitations = await prisma.digitalInvitation.findMany({
      where,
      select: {
        id: true,
        fileUrl: true,
        fileName: true,
        canvaMap: {
          select: {
            coordinates: {
              select: {
                key: true, coordinateX: true, coordinateY: true, customConfig: true, label: true
              }
            }
          }
        }
      }
    })
    res.status(200).json({ invitations })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al obtener invitaciones." })
  }
}

export async function createInvitationDesign(req, res) {
  try {
    const newInvitation = await prisma.digitalInvitation.create({ data: req.body })
    res.status(200).json({ savedFile: newInvitation })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al guardar invitación." })
  }
}

export async function updateInvitationDesign(req, res) {
  try {
    const { canvaMap, ...rest } = req.body
    const updatedInvitation = await prisma.digitalInvitation.update({
      where: { id: req.body.id },
      data: {
        ...rest,
        canvaMap: {
          upsert: { // Upsert ensures that if canvaMap doesn't exist, it will be created
            create: {
              coordinates: { create: canvaMap.coordinates }
            },
            update: {
              coordinates: {
                deleteMany: {}, // Deletes all existing coordinates first
                create: canvaMap.coordinates
              }
            }
          }
        }
      }
    })
    res.status(200).json({ updatedFile: updatedInvitation })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al actualizar invitación." })
  }
}

export const deleteInvitationDesignById = async (req, res) => {
  try {
    const { id } = req.query
    await prisma.digitalInvitation.delete({ where: { id } })
    res.status(200).end()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al eliminar la invitación." })
  }
}


export async function getPassDesigns(req, res) {
  try {
    const { query: { eventId } } = req
    const where = eventId ? { OR: [{ eventId }, { eventId: null }] } : { eventId: null }
    const passes = await prisma.digitalPass.findMany({
      where,
      select: {
        id: true,
        fileUrl: true,
        fileName: true,
        canvaMap: {
          select: {
            coordinates: {
              select: {
                key: true, coordinateX: true, coordinateY: true, customConfig: true, label: true
              }
            }
          }
        }
      }
    })
    res.status(200).json({ passes })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al obtener pases." })
  }
}

export async function createPassDesign(req, res) {
  try {
    const newPass = await prisma.digitalPass.create({ data: req.body })
    res.status(200).json({ savedFile: newPass })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al guardar pase." })
  }
}

export async function updatePassDesign(req, res) {
  try {
    const { canvaMap, ...rest } = req.body
    const updatedPass = await prisma.digitalPass.update({
      where: { id: req.body.id },
      data: {
        ...rest,
        canvaMap: {
          upsert: { // Upsert ensures that if canvaMap doesn't exist, it will be created
            create: {
              coordinates: { create: canvaMap.coordinates }
            },
            update: {
              coordinates: {
                deleteMany: {}, // Deletes all existing coordinates first
                create: canvaMap.coordinates
              }
            }
          }
        }
      }
    })
    res.status(200).json({ updatedFile: updatedPass })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al actualizar pase." })
  }
}

export async function deletePassDesignById(req, res) {
  try {
    const { id } = req.query
    await prisma.digitalPass.delete({ where: { id } })
    res.status(200).end()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al eliminar el pase." })
  }
}