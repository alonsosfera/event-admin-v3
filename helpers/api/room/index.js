import { prisma } from "../../../lib/prisma"

export const getAllRoomsById = async (req, res) => {
  try {
    const { id } = req.query.id
    const room = await prisma.room.findUnique({ where: { id } })
    res.json(room)
  } catch (error) {
    res.json(500).json({ error, message: "Error al obtener el salón" })
  }
}

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany()
    res.json({ result: rooms })
  } catch (error) {
    res.status(500).json({ error, message: "Error al obtener los salones" })
  }
}

export const newRoom = async (req, res) => {
  try {
    const { name, address, capacity } = req.body
    const room = await prisma.room.create({
      data: { name, address, capacity }
    })
    res.json(room)
  } catch (error) {
    res.status(500).json({ error, message: "Error al crear el salón" })
  }
}

export const putEditRoom = async (req, res) => {
  try {
    const { roomId } = req.query
    const { name, address, capacity } = req.body
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: { name, address, capacity }
    })
    if (updatedRoom) {
      res.json(updatedRoom)
    } else {
      res.status(204).json({ error : "Salon no encontrado" })
    }
  } catch (error) {
    res.status(500).json({ error, message: "Error al actualizar el salón" })
  }
}

export const deleteRoomById = async (req, res) => {
  try {
    const { roomId } = req.query
    await prisma.room.delete({ where: { id: roomId } })
    res.status(200).end()
  } catch (error) {
    res.status(500).json({ error, message: "Error al borrar salón" })
  }
}
