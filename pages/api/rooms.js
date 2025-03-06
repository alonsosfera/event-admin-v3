import { deleteRoomById, getAllRooms, newRoom, putEditRoom, getAllRoomsById } from "../../helpers/api/room"
import { withAuthApi } from "../../helpers/auth/with-api-auth"

async function handler (req,res){
  if (req.method === "GET"){
    if (req.query.id) {
      await getAllRoomsById (req, res)
    } else {
      await getAllRooms (req, res)
    }
  } else if (req.method === "POST") {
    await newRoom (req,res)
  } else if (req.method === "PUT") {
    await putEditRoom (req, res)
  } else if (req.method === "DELETE") {
    await deleteRoomById (req, res)
  } else {
    res.status(405).json({ error: "Método no permitido" })
  }
}

export default withAuthApi(handler)
