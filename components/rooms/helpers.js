import { message } from "antd"
import axios from "axios"
import { parseCookies } from "nookies"

const { token } = parseCookies()

export const getRooms = setState => {
  axios.get("/api/rooms", { headers: { "Authorization": `Bearer ${token}`}})
    .then(res => {
      const { data: { result = [] }} = res
      setState({ edit: false, isModalOpen: false, isLoading: false, rooms: result })
    })
}

export const createRoom = async values => {
  await axios.post("/api/rooms", values, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export const updateRoom = async (values, id) => {
  await axios.put(`/api/rooms?roomId=${id}`, values, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export const deleteRoom = async id => {
  const deleting = message.loading("Borrando...")
  await axios.delete(`/api/rooms?roomId=${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  message.success("Borrado exitosamente")
  deleting()
}
