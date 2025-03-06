import { useState } from "react"
import { Col, Form, Input, Modal, Row, Select, message } from "antd"

export const NewUser = ({ inviteUser, onSuccess, ...props }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    const loading = message.loading("Enviando...")
    setLoading(true)
    try {
      const values = await form.getFieldsValue()
      values.phone = `${values.phone.countryCode || "52"}${values.phone.number}`
      const { user } = await inviteUser(values, "/api/auth/users/new")
      message.success("Invitación enviada")
      onSuccess(user)
    } catch (e) {
      message.warn("Error al enviar invitación")
      console.error(e)
    } finally {
      setLoading(false)
    }
    loading()
  }

  return (
    <Modal
      okButtonProps={{ loading }}
      className="invite-modal"
      onOk={handleSave}
      cancelText="Cancelar"
      okText="Aceptar"
      title="Invitar usuario"
      width={400}
      {...props}>
      <Form form={form} layout="horizontal">
        <Row gutter={[10, 8]}>
          <Col span={24}>
            <Form.Item
              name="name"
              rules={[{ required: true }]}>
              <Input placeholder="Nombre" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="role"
              rules={[{ required: true }]}>
              <Select placeholder="Tipo">
                <Select.Option value="HOST">Host</Select.Option>
                <Select.Option value="ADMIN">Admin</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Input.Group style={{ display: "flex", gap: 8 }}>
              <Form.Item name={["phone", "countryCode"]}>
                <Select showSearch defaultValue="52">
                  <Select.Option value="52">MX +52</Select.Option>
                  <Select.Option value="1">US +1</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name={["phone", "number"]} style={{ flex: 1 }}>
                <Input
                  maxLength={10}
                  autoComplete="off"
                  placeholder="WhatsApp (10 dígitos)" />
              </Form.Item>
            </Input.Group>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
