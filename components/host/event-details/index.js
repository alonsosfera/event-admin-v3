import { Alert, Col, Row, Image} from "antd"
import { useEffect, useState } from "react"
import dayjs from "../../shared/time-zone"
import JsPDF from "jspdf"
import { withForm } from "../../../helpers"
import { NewInvitation } from "./new-invitation"
import InvitationsTable from "./invitations-table"
import { getInvitations, deleteInvitation, updateEvent, getRoomMapByEvent } from "../../events/helpers"
import { invitationPDF, sendInvitation } from "./helpers"
import { useService } from "../../../hooks/use-service"
import { useImageSize } from "react-image-size"
import Link from "next/link"
import { DigitalPassModal } from "../../digital-pass/modal"
import { DigitalInvitationModal } from "@/components/digital-invitation/modal"
import { useRouter } from "next/router"

const EventDetails = ({ data, fullSize, fetchedEvent, setEvent, resetEvent }) => {
  const [state, setState] = useState({ isModalOpen: false })
  const [invitations, setInvitations] = useState([])
  const [dimensions] = useImageSize(data.digitalPass?.fileUrl)
  const [openModalInvitation, setOpenModalInvitation] = useState(false)
  const [openModalPass, setOpenModalPass] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [originalEvent, setOriginalEvent] = useState(null)

  const router = useRouter()
  
  const isPassLoading = data.digitalPass && !dimensions

  const designH = 540, designW = 960

  const handleDigitalModalToggle = () => {
    const digitalInvitation = data?.digitalInvitation || []
    if (digitalInvitation.length === 0) {
      setShowAlert(true)
    } else {
      setOriginalEvent(fetchedEvent)
      setOpenModalInvitation(true)
    }
  }

  const handlePassModalToggle = () => {
    const digitalPass = data?.digitalPass
    if (!digitalPass?.fileUrl) {
      setShowAlert(true)
    } else {
      setOriginalEvent(fetchedEvent)
      setOpenModalPass(true)
    }
  }

  const onCancelInvitationModal = () => {
    if (originalEvent) {
      setEvent(originalEvent)
      setOriginalEvent(null)
    }
    setOpenModalInvitation(false)
  }

  const onCancelPassModal = () => {
    if (originalEvent) {
      setEvent(originalEvent)
      setOriginalEvent(null)
    }
    setOpenModalPass(false)
  }

  const getEventInvitations = () => getInvitations(data.id).then(setInvitations)

  useEffect(() => {
    if (data.id) {
      getEventInvitations()
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
    setEvent(newEvent)
  }

  const onDownload = async () => {
    if (isPassLoading) return
    // Determine if the image is portrait or landscape based on dimensions
    const orientation = dimensions && dimensions.height > dimensions.width ? "p" : "l"
    let pdf = new JsPDF(orientation, "px", [dimensions?.width || designW, dimensions?.height || designH])

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
    // Determine if the image is portrait or landscape based on dimensions
    const orientation = dimensions && dimensions.height > dimensions.width ? "p" : "l"
    let pdf = new JsPDF(orientation, "px", [dimensions?.width || designW, dimensions?.height || designH])
    pdf = await invitationPDF(fetchedEvent, invitation, pdf, dimensions)

    const { invitationName } = invitation
    const pdfName = `${invitationName.split(" ").join("_")}.pdf`
    pdf.save(pdfName)
  }

  const onResendInvitation = async invitation => {
    if (!invitation.phone || isPassLoading) return
    // Determine if the image is portrait or landscape based on dimensions
    const orientation = dimensions && dimensions.height > dimensions.width ? "p" : "l"
    let pdf = new JsPDF(orientation, "px", [dimensions?.width || designW, dimensions?.height || designH])
    pdf = await invitationPDF(fetchedEvent, invitation, pdf, dimensions)

    const file = pdf.output("blob")
    await sendInvitation(invitation, file)
    setEvent(fetchedEvent)
  }

  const handleRedirectToPremiumInvitation = () => {
    const url = `/premium-invitation/${fetchedEvent.id}`;
    window.open(url, '_blank');
  };

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
            <Col xs={24} lg={14}><h1>Detalles de evento</h1>
              <Row style={{ padding: "0", marginBottom: "10px", marginTop: "10px" }} >
                <Col xs={24} sm={8} md={8}><b>Nombre: </b>{fetchedEvent.name}</Col>
                <Col xs={24} sm={8} md={8}><b>Fecha: </b>{dayjs.utc(fetchedEvent.eventDate).tz('America/Mexico_City').format("DD/MM/YYYY hh:mm a")}</Col>
                <Col xs={24} sm={8} md={8}><b>Capacidad: </b>{fetchedEvent.assistance}</Col>
              </Row>
              <Row style={{ padding: "0" }} >
                <Col xs={24} sm={8} md={8}><b>Invitados: </b>{invitedGuests} </Col>
                <Col xs={24} sm={8} md={8}><b>Confirmados: </b>{addConfirmed}</Col>
              </Row>
            </Col>
              <Col xs={0} sm={24} lg={10} style={{ textAlign: "center" }}>
                <Row gutter={12} style={{ display: "flex", justifyContent: "center"}}>
                  <Col sm={12}>
                    <Image
                      alt="pass"
                      preview={false}
                      placeholder={true}
                      src={data.digitalPass.fileUrl}
                      onClick={handlePassModalToggle}
                      style={{ cursor: "pointer" }}/>
                    <Link
                      href="#"
                      passHref
                      onClick={handlePassModalToggle}
                      style={{ display: "block" }}
                      >Editar pase</Link>
                  </Col>
                  <Col
                    onClick={fetchedEvent.digitalInvitation ? handleDigitalModalToggle : handleRedirectToPremiumInvitation } sm={12}
                    style={{ cursor: "pointer" }}>
                    <Image
                      alt="invitation"
                      preview={false}
                      placeholder={true}
                      src={fetchedEvent.digitalInvitation ? data?.digitalInvitation?.fileUrl : "/assets/premium.jpg"}/>
                    <Link
                      href="#"
                      passHref
                      onClick={fetchedEvent.digitalInvitation ? handleDigitalModalToggle : handleRedirectToPremiumInvitation}
                      style={{ display: "block" }}
                      >Editar invitación</Link>
                  </Col>
                </Row>
              </Col>
            </Row>
          <Alert
            className="mobile-alert"
            message="Favor de utilizar un dispositivo de escritorio para editar los pases e invitaciones digitales"
            type="info" />
          <InvitationsTable
            resetEvent={resetEvent}
            setEvent={setEvent}
            event={fetchedEvent}
            originalEvent={originalEvent}
            remove={onRemove}
            data={invitations}
            roomMapData={roomMapData}
            loadingRoomMap={loadingRoomMap}
            roomMapRefetch={roomMapRefetch}
            onDownload={onDownload}
            onSingleDownload={onSingleDownload}
            onResendInvitation={onResendInvitation}
            onNew={onNew}
            isPassLoading={isPassLoading}
            invitedGuests={invitedGuests}
            handleDigitalModalToggle={handleDigitalModalToggle}
            showAlert={showAlert} />
          {state.isModalOpen && (
            <NewInvitation
              event={fetchedEvent}
              dimensions={dimensions}
              roomMapData={roomMapData}
              invitations={invitations}
              getEventInvitations={getEventInvitations}
              onCancel={onCancel}
              open={state.isModalOpen}
              refetchInvitations={refetchInvitations}
              invitedGuests={invitedGuests} />
          )}
          <DigitalInvitationModal
            event={fetchedEvent}
            isOpen={openModalInvitation}
            onCancel={onCancelInvitationModal}
            onSubmit={() => {
              resetEvent()
              setOpenModalInvitation(false)
            }} />
          <DigitalPassModal
            isOpen={openModalPass}
            onCancel={onCancelPassModal}
            onSubmit={() => {
              resetEvent()
              setOpenModalPass(false)
            }}
            event={fetchedEvent}
          />
        </>
      ) : (
        <Alert message="Selecciona un evento" />
      )}
    </Col>
  )
}

export default withForm(EventDetails)
