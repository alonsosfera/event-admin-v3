import { prisma } from "../../../lib/prisma"
import { withAuthApi } from "../../../helpers/auth/with-api-auth"

export async function getRoomMap(req, res) {
  try {
    const allRooms = await prisma.roomMap.findMany({
      where: { eventId: null },
      select: {
        id: true,
        name: true,
        creationDate: true,
        canvaMap: {
          select: { coordinates: { select: { key: true, coordinateX: true, coordinateY: true, customConfig: true } } }
        }
      }
    })
    res.json({ result: allRooms })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message, message: "Error al obtener los datos." })
  }
}

export async function postRoomMap(req, res) {
  const { roomMapCoordinates = [], eventId, ...restBody } = req.body

  try {
      let newRoomMap
    if (eventId) {
      newRoomMap = await prisma.roomMap.update({
        where: { eventId },
        data: {
          ...restBody,
          canvaMap: {
            update: {
              coordinates: {
                deleteMany: {},
                create: roomMapCoordinates
              }
            }
          }
        }
      })
    } else {
      newRoomMap = await prisma.roomMap.create({
        data: {
          ...restBody,
          canvaMap: {
            create: {
              coordinates: {
                create: roomMapCoordinates
                }
              }
            }
          }
      })
    }
    res.json({ result: newRoomMap })
  } catch (error) {
    console.error("Error in postRoomMap:", error)
    res.status(500).json({
      error: error.message,
      message: "Error al crear o actualizar datos."
    })
    }
  }



async function handler(req, res) {
  if (req.method === "GET") {
    await getRoomMap(req, res)
  } else if (req.method === "POST") {
    await postRoomMap(req, res)
  } else {
    res.status(405).json({ error: "Método no permitido" })
  }
}


export default withAuthApi(handler)
