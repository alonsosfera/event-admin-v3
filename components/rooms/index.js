import { Row } from "antd"
import { useState, useEffect } from "react"
import { Heading } from "../shared"
import RoomsList from "./list"
import { NewRoom } from "./new-room"
import { getRooms, createRoom, updateRoom, deleteRoom } from "./helpers"

export const Rooms = () => {
  const [state, setState] = useState({
    isModalOpen: false,
    isLoading: true,
    rooms: [],
    edit: null
  })

  useEffect(() => {
    getRooms(setState)
  }, [])

  const onNew = () => {
    setState({ ...state, isModalOpen: true })
  }

  const onCancel = () => {
    setState({ ...state, edit: null, isModalOpen: false })
  }

  const onCreate = async values => {
    await createRoom(values)
    getRooms(setState)
  }

  const onUpdate = async (values, id) => {
    await updateRoom(values, id)
    getRooms(setState)
  }

  const onDelete = async id => {
    await deleteRoom(id)
    getRooms(setState)
  }

  const onEdit = room => {
    setState({ ...state, isModalOpen: true, edit: room })
  }

  return (
    <Row
      className="event admin rooms"
      justify="center">
      {state?.isModalOpen &&
        <NewRoom
          createRoom={onCreate}
          edit={state.edit}
          onCancel={onCancel}
          updateRoom={onUpdate}
          open={state.isModalOpen} />
      }
      <Heading
        isLoading={state.isLoading}
        title="Salón"
        onClick={onNew} />
      <RoomsList
        data={state.rooms}
        onDelete={onDelete}
        onEdit={onEdit}
        isLoading={state.isLoading} />
    </Row>
  )
}
