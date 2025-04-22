import { Col, Form, Input, InputNumber, message, Modal, Row, Select, Typography, Space } from "antd"
import { useEffect, useState } from "react"

import { handleSaveHelper, generatePDF } from "./helpers"
import { JoyaColumns, JoyaLobby } from "./constants"
import dynamic from "next/dynamic"
const CustomTablesMap = dynamic(() => import("../../custom-tables-map"), {
  ssr: false
})

export const NewInvitation = ({
  invitations,
  event,
  getEventInvitations,
  refetchInvitations,
  invitedGuests,
  roomMapData,
  dimensions,
  ...props
}) => {
  const [form] = Form.useForm()

  const [guests, setGuests] = useState({
    amount: undefined,
    distribution: event.tablesDistribution,
    selected: []
  })

  const handleSave = async () => {
    const loading = message.loading("Generando...")
    try {
      const invitation = await handleSaveHelper(event, form, guests)
      await generatePDF(event, invitation, dimensions)
      getEventInvitations()
      await refetchInvitations()
    } catch (e) {
      console.error(e)
      message.error("Hubo un error...")
    } finally {
      loading()
    }
  }

  useEffect(() => {
    setGuests({
      amount: undefined,
      distribution: event.tablesDistribution,
      selected: []
    })
  }, [event])

  const onGuestsChange = ({ target: { value } }) => {
    const amount = Number(value)
    setGuests({ amount, distribution: event.tablesDistribution, selected: [] })
  }

  const calculateRemainingGuests = () => {
    return event.assistance - invitedGuests
  }

  const spacesDisable = () => {
    if ((event.assistance - invitedGuests) <= 10) {
      message.warning(`Solo puedes invitar ${calculateRemainingGuests()} persona más`)
    }
  }
  useEffect(() => {
    spacesDisable()
  }, [invitedGuests])

  return (
    <Modal
      className="invitation-modal"
      onOk={handleSave}
      cancelText="Cerrar"
      okText="Invitar"
      title="Generar invitación"
      width={950}
      {...props}>
      <Form
        form={form}
        layout="horizontal"
        initialValues={{
          phone: {
            countryCode: "52"
          }
        }}>
        <Row gutter={[10, 8]} align="center">
          <Col span={24} md={10}>
            <Form.Item
              name="invitationName"
              rules={[{ required: true }]}>
              <Input autoComplete="off" placeholder="Nombre (Ej. Fam. Gonzalez)" />
            </Form.Item>
          </Col>
          <Col span={24} md={3}>
            <Form.Item
              name="numberGuests"
              rules={[{ required: true }]}>
              <InputNumber
                autoComplete="off"
                min={1}
                onBlur={onGuestsChange}
                placeholder="Invitados"
                style={{ width: "100%" }}
                max={event.assistance - invitedGuests} />
            </Form.Item>
          </Col>
          <Col span={24} md={8}>
            <Form.Item>
              <Space.Compact compact="true">
                <Form.Item name={["phone", "countryCode"]}>
                  <Select showSearch>
                    <Select.Option value="52">MX +52</Select.Option>
                    <Select.Option value="1">US +1</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name={["phone", "number"]}>
                  <Input
                    maxLength={10}
                    autoComplete="off"
                    placeholder="WhatsApp (10 dígitos)" />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
          {guests.amount !== undefined && (
            <Col span={24}>
              <Typography.Text strong>
                Selecciona las mesas para los invitados ({guests.amount} restantes)
              </Typography.Text>
            </Col>
          )}
          <Col className="map-col" span={24}>
            <CustomTablesMap
              invitations={invitations}
              className={"joya"}
              columns={JoyaColumns}
              lobby={<JoyaLobby />}
              allowEditTablesPosition={false}
              allowAddInvitations={true}
              state={guests}
              setState={setGuests}
              distribution={event.tablesDistribution}
              initialCoordinates={roomMapData?.canvaMap?.coordinates} />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
