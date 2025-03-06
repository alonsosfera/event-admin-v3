import { createPassDesign, getPassDesigns, updatePassDesign, deletePassDesignById } from "../../../helpers/api/design"

async function handler(req, res) {
  if (req.method === "GET") {
    await getPassDesigns(req, res)
  } else if (req.method === "POST") {
    await createPassDesign(req, res)
  } else if (req.method === "PUT") {
    await updatePassDesign(req, res)
  } else if (req.method === "DELETE") {
    await deletePassDesignById (req , res)
  } else {
    res.status(405).json({ error: "Método no permitido" })
  }
}

export default handler
