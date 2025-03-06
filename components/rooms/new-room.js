import { Col, Form, Input, InputNumber, Modal, Row, message } from "antd"
import { useEffect } from "react"

export const NewRoom = ({ createRoom, updateRoom, edit, ...props }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (edit) {
      form.setFieldsValue(edit)
    }
  }, [edit])

  const handleSave = async () => {
    const loading = message.loading("Guardando...")
    try {
      await form.validateFields()
      const values = await form.getFieldsValue()

      if (edit) {
        updateRoom(values, edit.id)
      } else {
        await createRoom(values)
      }
      message.success("Salón guardado")
    } catch (e) {
      message.warn("Error")
      console.error(e)
    }
    loading()
  }

  return (
    <Modal
      onOk={handleSave}
      cancelText="Cancelar"
      okText="Guardar"
      title="Crear salón"
      width={300}
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
              name="address"
              rules={[{ required: true, min: 15 }]}>
              <Input placeholder="Dirección" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="capacity"
              rules={[{ required: true }]}>
              <InputNumber
                min={1}
                placeholder="Capacidad"
                step={10}
                style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
