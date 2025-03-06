import { Button, Form, Input, Select } from "antd"
import { Recover } from "../../helpers/auth/recovery"
import Link from "next/link"

export const Recovery = () => {
  const onFinish = async values => {
    values.phone = `${values.phone.countryCode || "52"}${values.phone.number}`
    await Recover(values.phone)
  }

  return (
    <Form
      name="basic"
      layout="vertical"
      onFinish={onFinish}>
      <Input.Group compact style={{ display: "flex" }}>
        <Form.Item name={["phone", "countryCode"]}>
          <Select showSearch defaultValue="52">
            <Select.Option value="52">MX +52</Select.Option>
            <Select.Option value="1">US +1</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          style={{ flex: 1 }}
          name={["phone", "number"]}
          rules={[{ required: true, message: "Por favor ingresa tu número de teléfono!" }]}>
          <Input
            maxLength={10}
            autoComplete="off"
            placeholder="WhatsApp (10 dígitos)" />
        </Form.Item>
      </Input.Group>
      <Button type="primary" htmlType="submit">
        Enviar
      </Button>
      <small>
        ¿Iniciar sesión?
        &nbsp;
        <Link href="/">
          <a>Click aquí</a>
        </Link>
      </small>
    </Form>
  )
}
