import React, { useEffect, useState } from "react"
import { Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, message, Tabs, Spin } from "antd"

import { RoomMapPreview } from "./room-map-preview"
import { PassesListItem } from "../designs/passes/passes-list-item"
import { InvitationsListItem } from "../designs/invitations/invitations-list-item"
import { useService } from "../../hooks/use-service"
import { getEventById } from "./helpers"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)

export const NewEvent = ({ createEvent, updateEvent, edit, hosts, invitationsDesigns, passDesigns, roomMaps, ...props }) => {
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState("1")
  const [selectedInvitation, setSelectedInvitation] = useState(null)
  const [selectedPass, setSelectedPass] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [invitationType, setInvitationType] = useState("standard")

  const {
    data: eventData, refetch: eventRefetch, loading
  } = useService(() => getEventById(null, edit?.id), null,  { shouldFetch: false })

  useEffect(() => {
    if (edit) {
      edit.eventDate = dayjs(edit.eventDate)
      form.setFieldsValue(edit)
      eventRefetch(edit.id).then()
    }
  }, [edit])


  useEffect(() => {
    if (!eventData) return

    if (eventData.premiumInvitation) {
      setInvitationType("premium")
      setSelectedInvitation(null)
    } else {
      setInvitationType("standard")
      setSelectedInvitation(eventData.digitalInvitation)
    }
    setSelectedPass(eventData.digitalPass)
    setSelectedRoom(eventData.roomMap)
  }, [eventData])

  const handleSave = async () => {
    const loading = message.loading("Guardando...", 0)
    try {
      await form.validateFields()
      const values = await form.getFieldsValue()
      values.eventDate =  values.eventDate ? values.eventDate.toISOString() : dayjs().toISOString()

      const { id, ...roomMap } = selectedRoom
      const { id: _1, ...digitalPass } = selectedPass
      let digitalInvitation = null;
    if (invitationType === "standard" && selectedInvitation) {
      const { id: _2, ...selectedInv } = selectedInvitation;
      digitalInvitation = {
        ...selectedInv,
      };
    }
      const event = {
        ...values,
        roomMap,
        digitalPass,
        digitalInvitation,
        invitationType
      }
      if (edit) {
        await updateEvent(event, edit.id)
      } else {
        await createEvent(event)
      }
      message.success("Evento guardado")
    } catch (e) {
      message.warning("Error")
      console.error(e)
    }
    loading()
  }

  const onDesignSelect = (value, tab) => {
    
    if (tab === "1") setSelectedPass(passDesigns.find(pass => pass.fileName === value))
    if (tab === "2") setSelectedInvitation(invitationsDesigns.find(invitation => invitation.fileName === value))
    if (tab === "3") setSelectedRoom(roomMaps.find(roomMap => roomMap.name === value))
    setActiveTab(tab)
  }

  const handleTabChange = key => {
    setActiveTab(key)
  }

  const showDesign = selectedInvitation || selectedPass || selectedRoom

  const isShowingMap = activeTab === "3"
  const showDesignModalWidth = isShowingMap ? 1400 : 1000
  return (
    <Modal
      className="event-modal"
      onOk={handleSave}
      cancelText="Cancelar"
      okText="Guardar"
      title={edit ? "Editar evento" : "Crear evento" }
      width={showDesign ? showDesignModalWidth : 600}
      {...props}>
      {loading ? (
        <Spin
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }} />
      ) : (
        <Row gutter={[20, 20]} justify="center">
          <Col span={showDesign ? (isShowingMap ? 8 : 12) : 24}>
            <Form
              requiredMark={false}
              form={form}
              layout="vertical"
              style={{ maxWidth: 600, margin: "0 auto" }}
            >
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item name="name" label="Nombre del evento" rules={[{ required: true }]}>
                    <Input autoComplete="off" placeholder="Nombre del evento" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="eventDate" label="Fecha del evento" rules={[{ required: true }]}>
                        <DatePicker
                          disabledDate={date => date && date.isBefore(dayjs(), "day")}
                          format="DD/MM/YYYY hh:mm A"
                          placeholder="Fecha"
                          showTime={{ format: "hh:mm A" }}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="assistance"
                        label="Cantidad de invitados"
                        rules={[{ required: true }]}
                      >
                        <InputNumber
                          min={10}
                          placeholder="Invitados"
                          step={10}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                <Col span={24}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="mainTable"
                        label="Tipo de evento"
                        rules={[{ required: true }]}
                      >
                        <Select placeholder="Tipo de evento">
                          <Select.Option value={true}>Evento normal</Select.Option>
                          <Select.Option value={false}>Graduación</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="hostId" label="Anfitrión" rules={[{ required: true }]}>
                        <Select
                          showSearch
                          filterOption={(value, option) => option.children.includes(value)}
                          placeholder="Anfitrión"
                        >
                          {hosts?.map(host => (
                            <Select.Option key={host.id} value={host.id}>{host.name}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                <Col span={24}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Boleto Digital">
                        <Select
                          style={{ width: "100%" }}
                          placeholder="Boleto Digital"
                          value={selectedPass?.fileName}
                          onSelect={value => onDesignSelect(value, "1")}
                        >
                          {passDesigns?.map(pass => (
                            <Select.Option key={pass.fileName} value={pass.fileName}>{pass.fileName}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Acomodo de Mesas">
                        <Select
                          style={{ width: "100%" }}
                          placeholder="Acomodo de mesas"
                          value={selectedRoom?.name}
                          onSelect={value => onDesignSelect(value, "3")}
                        >
                          {roomMaps?.map(roomMap => (
                            <Select.Option key={roomMap.name} value={roomMap.name}>{roomMap.name}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Tipo de invitación" required>
                            <Select
                              value={invitationType}
                              onChange={(value) => {
                                setInvitationType(value)
                                setSelectedInvitation(value === "premium" ? { fileName: "premium" } : null)
                              }}
                              style={{ width: "100%" }}
                            >
                              <Select.Option value="standard">Invitación estándar</Select.Option>
                              <Select.Option value="premium">Invitación premium</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        {invitationType === "standard" && (
                          <Col span={12}>
                            <Form.Item label="Invitación Digital">
                              <Select
                                placeholder="Invitación Digital"
                                value={selectedInvitation?.fileName}
                                onSelect={(value) => onDesignSelect(value, "2")}
                              >
                                {invitationsDesigns
                                  ?.filter(inv => !inv.fileName.includes("premium"))
                                  .map(invitation => (
                                    <Select.Option key={invitation.fileName} value={invitation.fileName}>
                                      {invitation.fileName}
                                    </Select.Option>
                                  ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        )}
                      </Row>
                    </Col>

                  </Row>
                </Col>
              </Row>

            </Form>
          </Col>

          {showDesign && (
            <Col span={isShowingMap ? 16 : 12}>
              <Tabs
                activeKey={activeTab} onChange={handleTabChange}
                tabPosition="top">
                
                {!!selectedPass && (
                  <Tabs.TabPane
                    key="1"
                    tab="Boleto Digital"
                    className="limited-width">
                    <PassesListItem item={selectedPass} />
                  </Tabs.TabPane>
                )}
                {!!selectedInvitation && invitationType === "standard" && (
                  <Tabs.TabPane
                    key="2"
                    className="limited-width"
                    tab="Invitación Digital">
                    <InvitationsListItem
                      item={selectedInvitation} />
                  </Tabs.TabPane>
                )}
                {!!selectedRoom && (
                  <Tabs.TabPane tab="Acomodo de Mesas" key="3">
                    <div>
                      <RoomMapPreview roomMapId={selectedRoom.id} />
                    </div>
                  </Tabs.TabPane>
                )}
              </Tabs>
            </Col>
          )}
        </Row>
      )}
    </Modal>
  )
}
