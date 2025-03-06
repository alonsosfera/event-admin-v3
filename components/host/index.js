import { Row } from "antd"
import { useState, useEffect } from "react"
import { Heading, SearchBar } from "../shared"
import EventsTable from "./table"
import EventDetails from "./event-details"
import { getEventByIdService, getEventsByHost, getRooms } from "../events/helpers"
import { useSession } from "next-auth/react"
import { useService } from "../../hooks/use-service"

export const HostDashboard = ({ eventId }) => {
  const { data: { user } = {} } = useSession()
  const [state, setState] = useState({
    isLoading: true,
    events: [],
    filteredEvents: undefined
  })
  const [rooms, setRooms] = useState([])
  const [event, setEvent] = useState({})

  const {
    data: eventData, refetch: refetchEvent
  } = useService(getEventByIdService, null,  { shouldFetch: false })

  const hideHostEventsList = state.events.length <= 1

  const hideEventsList =  Boolean(eventId) || hideHostEventsList

  useEffect(() => {
    if (eventId) {
      refetchEvent({ eventId }).then(res => {
        setState({ edit: false, isModalOpen: false, isLoading: false, events: [res] })
        setEvent(res)
      })
    } else {
      user && getEventsByHost(user.id, setState)
    }
    getRooms(setRooms)
  }, [user])

  useEffect(() => {
    if (state.events.length === 1) {
      setEvent(state.events[0])
    }
  },[state])

  const onSearch = value => {
    if (!value || value.length === 0) {
      setState({ ...state, filteredEvents: undefined })
      return
    }

    value = value.toLowerCase()
    const newEvents = [...state.events].filter(event => (
      event.name.toLowerCase().includes(value) ||
      event.assistance.toString().includes(value)
    ))
    setState({ ...state, filteredEvents: newEvents })
  }

  return (
    <Row className="event host events" gutter={[10, 8]}>
      <Heading
        backDisabled
        fullSize={hideEventsList}
        isLoading={state.isLoading}
        title={hideEventsList ? event.name : "Eventos"} />
      {
        !hideEventsList ? (
          <>
            <SearchBar onSearch={onSearch} />
            <EventsTable
              isLoading={state.isLoading}
              data={state.filteredEvents || state.events}
              selectRow={event => setEvent(event)}
              rooms={rooms} />
          </>
        ) : null
      }
      <EventDetails
        isLoading={state.isLoading}
        data={eventData || event}
        fetchedEvent={event}
        refetchEvent={event => setEvent(event)}
        fullSize={hideEventsList} />
    </Row>
  )
}
