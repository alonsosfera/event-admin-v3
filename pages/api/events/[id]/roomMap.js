import { prisma } from "../../../../lib/prisma"
import { withAuthApi } from "../../../../helpers/auth/with-api-auth"

export async function getRoomMapByEvent(req, res) {
  const { id } = req.query

  if (req.method === "GET") {
    try {
      const roomMap = await prisma.roomMap.findUnique({
        where: { eventId: id },
        include: {
          canvaMap: {
            include: {
              coordinates: {
                select: { id: true, coordinateX: true, coordinateY: true, key: true, customConfig: true  }
              }
            }
          }
        }
      })
      res.status(200).json(roomMap)
    } catch (error) {
      res.status(500).json({ error: "No se han podido obtener las coordenadas" })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function handler(req, res) {
  if (req.method === "GET") {
    await getRoomMapByEvent(req, res)
  } else {
    res.status(405).json({ error: "Método no permitido" })
  }
}

export default withAuthApi(handler)
