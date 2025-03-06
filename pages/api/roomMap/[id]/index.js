import { prisma } from "../../../../lib/prisma"
import { withAuthApi } from "../../../../helpers/auth/with-api-auth"

export async function putRoomMap(req, res) {
  const { id } = req.query
  const { roomMapCoordinates, ...body } = req.body

  const createCanvaMapCoordinates = coordinates => (
    (coordinates.length || 0) > 1
      ? coordinates
      : undefined
  )

  try {
    delete req.body.roomMapCoordinates
    const updateData = {
      ...body,
      canvaMap: roomMapCoordinates ? {
        upsert: {
          create: {
            coordinates: {
              create: createCanvaMapCoordinates(roomMapCoordinates)
            }
          },
          update: {
            coordinates: {
              deleteMany: {},
              create: createCanvaMapCoordinates(roomMapCoordinates)
            }
          }
        }
      } : undefined
    }

    const updatedRoomMap = await prisma.roomMap.update({
      where: { id },
      data: updateData
    })

    res.json({ result: updatedRoomMap })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message, message: "Error al actualizar datos." })
  }
}

export async function deleteRoomMap(req, res) {
  try {
    const { id } = req.query
    const roomMap = await prisma.roomMap.delete({
      where: { id }
    })
    res.json({ result: roomMap })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message, message: "Error al eliminar datos." })
  }
}

async function handler(req, res) {
  if (req.method === "DELETE") {
    await deleteRoomMap(req, res)
  } else if (req.method === "PUT") {
    await putRoomMap(req, res)
  } else {
    res.status(405).json({ error: "Método no permitido" })
  }
}

export default withAuthApi(handler)
