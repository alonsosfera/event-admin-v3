import { prisma } from "../../../../lib/prisma"
import { withAuthApi } from "../../../../helpers/auth/with-api-auth"

export async function getCoordinates(req, res) {
  const { id } = req.query

  if (req.method === "GET") {
    try {
      const coordinates = await prisma.coordinates.findMany({
        where: { canvaMap: { roomMapId: id } },
        select: { id: true, coordinateX: true, coordinateY: true, key: true, customConfig: true }
      })
      res.status(200).json(coordinates)
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
    await getCoordinates(req, res)
  } else {
    res.status(405).json({ error: "Método no permitido" })
  }
}

export default withAuthApi(handler)
