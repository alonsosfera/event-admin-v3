import { Alert, Col, Row, Flex } from "antd"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import JsPDF from "jspdf"
import { withForm } from "../../../helpers"
import { NewInvitation } from "./new-invitation"
import InvitationsTable from "./invitations-table"
import { getInvitations, deleteInvitation, updateEvent, getRoomMapByEvent } from "../../events/helpers"
import { COORDINATES_BY_EVENT_TYPE, invitationPDF, sendInvitation } from "./helpers"
import { useService } from "../../../hooks/use-service"
import { useImageSize } from "react-image-size"
import { PassesListItem } from "@/components/designs/passes/passes-list-item"
import { InvitationsListItem } from "@/components/designs/invitations/invitations-list-item"

const EventDetails = ({ data, refetchEvent, fullSize, fetchedEvent }) => {
  const [state, setState] = useState({ isModalOpen: false })
  const [invitations, setInvitations] = useState([])
  const [dimensions] = useImageSize(data.digitalPass?.fileUrl)
  
  const isPassLoading = data.digitalPass && !dimensions

  const { designH = 540, designW = 960 } = COORDINATES_BY_EVENT_TYPE[fetchedEvent.type] || {}

  useEffect(() => {
    if (data.id) {
      getInvitations(data.id)
        .then(setInvitations)
      roomMapRefetch({ eventId: data.id }).then()
    }
  }, [data])

  const {
    data: roomMapData, refetch: roomMapRefetch, loading: loadingRoomMap
  } = useService(getRoomMapByEvent, null,  { shouldFetch: false })

  const onNew = () => {
    setState({ ...state, isModalOpen: true })
  }

  const onCancel = () => {
    setState({ ...state, isModalOpen: false })
  }

  const onRemove = async id => {
    await deleteInvitation(id)

    const tablesDistribution = { ...fetchedEvent.tablesDistribution }
    const { invitationTables } = invitations.find(invitation => invitation.id === id)

    invitationTables.forEach(el => {
      const prevDistribution = tablesDistribution[el.table]
      tablesDistribution[el.table] = {
        ...prevDistribution,
        occupiedSpaces: prevDistribution.occupiedSpaces - el.amount
      }
    })
    const newEvent = await updateEvent({ tablesDistribution }, fetchedEvent.id)
    refetchEvent(newEvent)
  }

  const onDownload = async () => {
    if (isPassLoading) return
    let pdf = new JsPDF("l", "px", [dimensions?.width || designW, dimensions?.height || designH])

    for (const invitation of invitations) {
      if (invitations.indexOf(invitation) !== 0) {
        pdf.addPage()
      }
      pdf = await invitationPDF(fetchedEvent, invitation, pdf, dimensions)
    }
    pdf.save("Lista_Invitaciones.pdf")
  }

  const onSingleDownload = async invitation => {
    if (isPassLoading) return
    let pdf = new JsPDF("l", "px", [dimensions?.width || designW, dimensions?.height || designH])
    pdf = await invitationPDF(fetchedEvent, invitation, pdf, dimensions)

    const { invitationName } = invitation
    const pdfName = `${invitationName.split(" ").join("_")}.pdf`
    pdf.save(pdfName)
  }

  const onResendInvitation = async invitation => {
    if (!invitation.phone || isPassLoading) return
    let pdf = new JsPDF("l", "px", [dimensions?.width || designW, dimensions?.height || designH])
    pdf = await invitationPDF(fetchedEvent, invitation, pdf, dimensions)

    const file = pdf.output("blob")
    await sendInvitation(invitation, file)
    refetchEvent(fetchedEvent)
  }

  const invitedGuests = invitations.reduce((prev, current) => prev + current.numberGuests, 0)

  const refetchInvitations = async () => {
    if (!fetchedEvent.id) return
    const updatedInvitations = await getInvitations(fetchedEvent.id)
    setInvitations(updatedInvitations)
  }

  const addConfirmed = invitations.reduce((acumulador, invitation) => {
    return acumulador + (Number(invitation.confirmed) || 0)
  }, 0)

  return (
    <Col
      className="event-info"
      span={!fullSize ? 12 : 18}
      offset={!fullSize ? 0 : 3}>
      {fetchedEvent.name ? (
        <>
          <Row>
            <Col xs={24} lg={16}><h1>Detalles de evento</h1>
              <Row style={{ padding: "0" }} >
                <Col xs={24} sm={8} md={8}><b>Nombre: </b>{fetchedEvent.name}</Col>
                <Col xs={24} sm={8} md={8}><b>Salón: </b>{fetchedEvent.room_name}</Col>
                <Col xs={24} sm={8} md={8}><b>Fecha: </b>{dayjs(fetchedEvent.eventDate).format("DD/MM/YYYY hh:mm a")}</Col>
              </Row>
              <Row style={{ padding: "0" }} >
                <Col xs={24} sm={8} md={8}><b>Capacidad: </b>{fetchedEvent.assistance}</Col>
                <Col xs={24} sm={8} md={8}><b>Invitados: </b>{invitedGuests} </Col>
                <Col xs={24} sm={8} md={8}><b>Confirmados: </b>{addConfirmed}</Col>
              </Row>
            </Col>
              <Col xs={24} lg={8}>
                <Row gutter={12}>
                  <Col sm={12}>
                    <PassesListItem 
                      item={data.digitalPass}  
                    />
                    <h4>Pase digital</h4>
                  </Col>
                  <Col sm={12}>                    
                    <InvitationsListItem
                      item={data.digitalInvitation}                     
                    />
                    <h4>Invitación digital</h4>
                  </Col>
                </Row>
              </Col>            
            </Row>
          <Alert
            className="mobile-alert"
            message="Favor de utilizar un dispositivo de escritorio para crear invitaciones"
            type="info" />
          <InvitationsTable
            event={fetchedEvent}
            remove={onRemove}
            data={invitations}
            roomMapData={roomMapData}
            refetchEvent={refetchEvent}
            loadingRoomMap={loadingRoomMap}
            roomMapRefetch={roomMapRefetch}
            onDownload={onDownload}
            onSingleDownload={onSingleDownload}
            onResendInvitation={onResendInvitation}
            onNew={onNew}
            isPassLoading={isPassLoading}
            invitedGuests={invitedGuests} />
          {state.isModalOpen && (
            <NewInvitation
              event={fetchedEvent}
              dimensions={dimensions}
              roomMapData={roomMapData}
              invitations={invitations}
              refetchEvent={refetchEvent}
              onCancel={onCancel}
              open={state.isModalOpen}
              refetchInvitations={refetchInvitations}
              invitedGuests={invitedGuests} />
          )}
        </>
      ) : (
        <Alert message="Selecciona un evento" />
      )}
    </Col>
  )
}

export default withForm(EventDetails)
