import { Button, Row } from "antd"
import { useState, useEffect } from "react"
import { Heading, SearchBar } from "../shared"
import EventsTable from "./table"
import { NewEvent } from "./new-event"
import {
  createEvent ,
  deleteEvent ,
  getEvents ,
  getRooms ,
  getHosts ,
  updateEvent ,
  getDesignsInvitations ,
  getRoomMaps ,
  getPassDesigns
} from "./helpers"
import { useRouter } from "next/router"
import { useService } from "../../hooks/use-service"

export const Events = () => {
  const [state, setState] = useState({
    isModalOpen: false,
    isLoading: true,
    edit: null,
    events: [],
    filteredEvents: undefined
  })
  const [rooms, setRooms] = useState([])
  const [hosts, setHosts] = useState([])
  const { data: invitationsDesigns } = useService(getDesignsInvitations)
  const { data: roomMaps } = useService(getRoomMaps)
  const { data: passDesigns } = useService(getPassDesigns)



  useEffect(() => {
    getEvents(setState)
    getRooms(setRooms)
    getHosts(setHosts)
  }, [])

  const onNew = () => {
    setState({ ...state, edit: null, isModalOpen: true })
  }

  const onCancel = () => {
    setState({ ...state, edit: null, isModalOpen: false })
  }

  const onCreate = async values => {
    await createEvent(values)
    getEvents(setState)
  }

  const onUpdate = async (values, id) => {
    await updateEvent(values, id)
    getEvents(setState)
  }

  const onEdit = event => {
    setState({ ...state, isModalOpen: true, edit: JSON.parse(JSON.stringify(event)) })
  }

  const onRemove = async id => {
    await deleteEvent(id)
    const events = [...state.events].filter(el => el.id !== id)
    setState({ ...state, events })
  }

  const onSearch = value => {
    if (!value || value.length === 0) {
      setState({ ...state, filteredEvents: undefined })
      return
    }

    value = value.toLowerCase()
    const newEvents = [...state.events].filter(event => (
      event.name.toLowerCase().includes(value) ||
      event.assistance.toString().includes(value) ||
      hosts.find(host => host.id === event.hostId)?.email?.toLowerCase().includes(value)
    ))
    setState({ ...state, filteredEvents: newEvents })
  }

  const router = useRouter()

  const handleClickHosting = () => {
    router.push({ pathname: "/roomMap" })
  }

  return (
    <Row className="event events" gutter={[10, 8]}>
      {state?.isModalOpen &&
        <NewEvent
          passDesigns={passDesigns}
          roomMaps={roomMaps}
          invitationsDesigns={invitationsDesigns}
          createEvent={onCreate}
          edit={state.edit}
          onCancel={onCancel}
          hosts={hosts}
          updateEvent={onUpdate}
          open={state.isModalOpen} />
      }
      <Heading
        customActions={[
          <Button
            key="New-btn"
            type="primary"
            onClick={handleClickHosting}>
            Acomodo
          </Button>]}
        isLoading={state.isLoading}
        title="Eventos"
        onClick={onNew} />
      <SearchBar onSearch={onSearch} />
      <EventsTable
        edit={onEdit}
        isLoading={state.isLoading}
        data={state.filteredEvents || state.events}
        hosts={hosts}
        remove={onRemove}
        rooms={rooms} />
    </Row>
  )
}
