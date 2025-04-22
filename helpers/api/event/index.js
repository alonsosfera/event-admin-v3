import { prisma } from "../../../lib/prisma"
import { generateTableSchema } from "../tables"

const COORDS_SELECT = { select: { key: true, coordinateX: true, coordinateY: true, customConfig: true, label: true } }
const FILE_SELECT = {
  select: {
    fileUrl: true,
    fileName: true,
    canvaMap: {
      select: { coordinates: COORDS_SELECT }
    }
  }
}

const createCanvaMapData = canvaMap => ({
  ...canvaMap,
  coordinates: canvaMap.coordinates ? {
    create: canvaMap.coordinates
  } : undefined
})

export async function getEventById(req, res) {
  const eventId = req.query.id
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        roomMap: {
          select: {
            name: true, canvaMap: { select: { coordinates: COORDS_SELECT } }
          }
        },
        digitalPass: FILE_SELECT,
        digitalInvitation: FILE_SELECT
      }
    })
    if (event) {
      res.status(200).json(event)
    } else {
      res.status(204).json({ message: "Evento no encontrado" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error al obtener el evento", error })
  }
}

export async function getAllEvents(req, res) {
  try {
    const events = await prisma.event.findMany({
      include: { room: true, roomMap: true }
    })
    res.json({ result: events.map(event => ({ ...event, room_name: event.room.name })) })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al obtener los eventos." })
  }
}

export async function getEventsByHost(req, res){
  try {
    const events = await prisma.event.findMany({
      where: { hostId: req.query.hostId },
      include: {
        room: true,
        roomMap: {
          select: {
            name: true, canvaMap: { select: { coordinates: COORDS_SELECT } }
          }
        },
        digitalPass: FILE_SELECT,
        digitalInvitation: FILE_SELECT
      }
    })
    res.json({ result: events.map(event => ({ ...event, room_name: event.room.name })) })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al obtener los eventos." })
  }
}

export async function postNewEvent(req, res) {
  const { roomId, roomMap, digitalPass, digitalInvitation, ...eventProperties  } = req.body
  try {
    const tablesDistribution = roomMap.canvaMap?.coordinates.reduce((acc, curr) => {
      acc[curr.key] = { spaces: 12, occupiedSpaces: 0 }
      return acc
    }, {})

    const result = await prisma.event.create({
      data: {
        ...eventProperties,
        tablesDistribution,
        room: { connect: { id: "9bf58a2b-e3bc-4152-92ea-71c056e1cdf1" } },
        roomMap: {
          create: {
            ...roomMap,
            canvaMap: {
              create: {
                ...roomMap.canvaMap,
                coordinates: roomMap.canvaMap?.coordinates ? { create: roomMap.canvaMap.coordinates } : undefined
              }
            }
          }
        },
        digitalPass: {
          create: {
            ...digitalPass,
            canvaMap: {
              create: {
                ...digitalPass.canvaMap,
                coordinates: digitalPass.canvaMap?.coordinates ? { create: digitalPass.canvaMap.coordinates } : undefined
              }
            }
          }
        },
        digitalInvitation: {
          create: {
            ...digitalInvitation,
            canvaMap: {
              create: {
                ...digitalInvitation.canvaMap,
                coordinates: digitalInvitation.canvaMap?.coordinates ? { create: digitalInvitation.canvaMap.coordinates } : undefined
              }
            }
          }
        }
      }
    })

    res.json({ result })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al crear el evento." })
  }
}

export async function putEditEventId(req, res) {
  const { eventId } = req.query
  const eventProperties = req.body
  
  const createRoomMap = eventProperties.roomMap
    ? createCanvaMapData(eventProperties.roomMap.canvaMap)
    : undefined

    const createDigitalPass = eventProperties.digitalPass
    ? createCanvaMapData(eventProperties.digitalPass.canvaMap)
    : undefined

    const createDigitalInvitation = eventProperties.digitalInvitation
    ? createCanvaMapData(eventProperties.digitalInvitation.canvaMap)
    : undefined

  try {
    if (eventProperties.assistance) {
      await updateEventAssistance(eventProperties, eventId)
      delete eventProperties.tableDistribution
    }

    const updateData = {
      ...eventProperties,
      roomMap: eventProperties.roomMap ? {
        upsert: {
          create: {
            ...eventProperties.roomMap,
            canvaMap: {
              create: createRoomMap
            }
          },
          update: {
            ...eventProperties.roomMap,
            canvaMap: {
              delete: true,
              create: createRoomMap
            }
          }
        }
      } : undefined,
      digitalPass: eventProperties.digitalPass ? {
        upsert: {
          create: {
            ...eventProperties.digitalPass,
            canvaMap: {
              create: createDigitalPass
            }
          },
          update: {
            ...eventProperties.digitalPass,
            canvaMap: {
             delete: true,
              create: createDigitalPass
            }
          }
        }
      } : undefined,
      digitalInvitation: eventProperties.digitalInvitation ? {
        upsert: {
          create: {
            ...eventProperties.digitalInvitation,
            canvaMap: {
              create: createDigitalInvitation
            }
          },
          update: {
            ...eventProperties.digitalInvitation,
            canvaMap: {
              delete: true,
              create: createDigitalInvitation
            }
          }
        }
      } : undefined
    }

    const updatedResult = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
      include: {
        room: true
      }
    })

    const { room: { name: room_name, id: roomId } = {}, ...event } = updatedResult

    res.status(200).json({
      message: "Event successfully updated!",
      result: {
        ...event,
        room_name,
        roomId
      }
    })
  } catch (error) {
    console.error(error)
    res.status(400).json({
      error,
      message: "An error occurred while updating the event."
    })
  }
}

async function updateEventAssistance(eventProperties, eventId) {
  const { assistance, tablesDistribution } = await prisma.event.findUnique({
    where: { id: eventId }
  })

  if (eventProperties.assistance > assistance) {
    try {
      const startFrom = parseInt(
        Object.keys(tablesDistribution)
          .filter(table => !table.includes("main"))
          .map(table => table.split("-")[1])
          .splice(-1)[0]
      )

      const newTables = generateTableSchema(
        eventProperties.assistance - assistance, startFrom
      )

      await prisma.event.update({
        where: { id: eventId },
        data: {
          tablesDistribution: {
            ...eventProperties.tablesDistribution ? eventProperties.tablesDistribution : tablesDistribution,
            ...newTables
          }
        }
      })
    }
    catch (error){
      throw new Error(error.message)
    }
  }
}

export async function deleteEventById(req, res) {
  try {
    const { id } = req.query
    await prisma.event.delete({ where: { id } })
    res.status(200).json({ message: "Evento eliminado con éxito!" })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error,
      message: "Ocurrió un error al eliminar el evento"
    })
  }
}

export async function updateDigitalInvitation(req, res) {
  const { eventId } = req.query
  const { digitalInvitation } = req.body
  
  if (!digitalInvitation) {
    return res.status(400).json({
      error: "No digital invitation data provided",
      message: "Digital invitation data is required"
    })
  }

  try {
    const createDigitalInvitation = createCanvaMapData(digitalInvitation.canvaMap)

    const updateData = {
      digitalInvitation: {
        upsert: {
          create: {
            ...digitalInvitation,
            canvaMap: {
              create: createDigitalInvitation
            }
          },
          update: {
            ...digitalInvitation,
            canvaMap: {
              delete: true,
              create: createDigitalInvitation
            }
          }
        }
      }
    }

    const updatedResult = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
      include: {
        digitalInvitation: {
          include: {
            canvaMap: {
              include: {
                coordinates: true
              }
            }
          }
        }
      }
    })

    res.status(200).json({
      message: "Digital invitation successfully updated!",
      result: updatedResult.digitalInvitation
    })
  } catch (error) {
    console.error(error)
    res.status(400).json({
      error,
      message: "An error occurred while updating the digital invitation."
    })
  }
}
