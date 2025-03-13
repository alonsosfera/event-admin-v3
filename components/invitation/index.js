import { Button, Col, Card, Form, InputNumber, Row, Typography, message, Skeleton } from "antd"
import { useState, useEffect } from "react"
import dayjs from "dayjs"
import "dayjs/locale/es"
dayjs.locale("es")
import { getInvitation } from "./helpers"
import { checkInGuests } from "../events/helpers"

export const Invitation = ({ id }) => {
  const [form] = Form.useForm()
  const [invitation, setInvitationState] = useState(undefined)

  useEffect(() => {
    getInvitation(setInvitationState, id)
  }, [])

  const onSave = async () => {
    const saving = message.loading("Guardando...")
    try {
      const { guestsToCheckIn } = await form.getFieldsValue()
      if (guestsToCheckIn === 0) return

      const updatedInvitation = await checkInGuests({ guestsToCheckIn, event: invitation.event }, id)
      setInvitationState(updatedInvitation)
      message.success("Guardado")
    } catch (e) {
      message.error("Hubo un error...")
      console.error(e)
    }
    saving()
  }

  const dateApproved = () => {
    if (invitation && dayjs(invitation.event.eventDate).isSame(dayjs(), "day")) {
      return true
    } else {
      return false
    }
  }


  return (
    <Row
      className="event invitation"
      align="center"
      gutter={[10, 8]}>
      <Col span={24} lg={12}>
        <Card>
          {invitation ? (
            <>
              {dayjs(invitation?.eventDate).isSame(dayjs(), "day") ? (
                <>
                  <Typography.Title className="title" level={1}>Detalles de la invitación</Typography.Title>
                  <Row
                    className="details" align="space-around"
                    gutter={[10, 20]}>
                    <Col>
                      <Typography.Paragraph type="secondary">Evento</Typography.Paragraph>
                      <Typography.Title level={4}>{invitation?.event?.name}</Typography.Title>
                    </Col>
                    <Col>
                      <Typography.Paragraph type="secondary">Fecha</Typography.Paragraph>
                      <Typography.Title level={4}>
                        {dayjs(invitation.event.eventDate).format("DD MMMM, YYYY")}
                      </Typography.Title>
                    </Col>
                    <Col>
                      <Typography.Paragraph type="secondary">Nombre de invitación</Typography.Paragraph>
                      <Typography.Title level={4}>{invitation?.invitationName}</Typography.Title>
                    </Col>
                    <Col>
                      <Typography.Paragraph type="secondary">Invitados restantes</Typography.Paragraph>
                      <Typography.Title level={4}>
                        {invitation?.numberGuests - invitation?.arrivedGuests}
                      </Typography.Title>
                    </Col>
                  </Row>
                  <Row className="form" align="center">
                    <Col span={12} lg={6}>
                      <Form form={form}>
                        <Form.Item
                          initialValue={invitation?.numberGuests - (invitation?.arrivedGuests || 0)}
                          name="guestsToCheckIn">
                          <InputNumber
                            max={invitation?.numberGuests - invitation?.arrivedGuests}
                            min={0}
                            placeholder="Invitados" />
                        </Form.Item>
                        {dateApproved() ? (
                          <Button
                            disabled={(invitation?.numberGuests - invitation?.arrivedGuests) === 0}
                            onClick={onSave}
                            type="primary">
                            Recibir Invitados
                          </Button>
                        ) : (
                          <div style={{ textAlign: "center" }}>
                            <Typography.Text className="out-of-time">
                              Fuera de tiempo
                            </Typography.Text>
                          </div>
                        )}
                      </Form>
                    </Col>
                  </Row>
                </>
              ) : (
                <Typography.Title className="title" level={1}>
                  La fecha de este evento es: {dayjs(invitation?.eventDate).format("DD MMMM, YYYY")}
                </Typography.Title>
              )}
            </>
          ) : (
            <Skeleton loading />
          )}
        </Card>
      </Col>
    </Row>
  )
}
