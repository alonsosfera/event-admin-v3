import { Button, Form, Input, Select, Space } from "antd"
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
      initialValues={{
        phone: {
          countryCode: "52"
        }
      }}
      onFinish={onFinish}>
      <Space.Compact compact="true" style={{ display: "flex" }}>
        <Form.Item name={["phone", "countryCode"]}>
          <Select showSearch>
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
      </Space.Compact>
      <Button type="primary" htmlType="submit">
        Enviar
      </Button>
      <small>
        ¿Iniciar sesión?
        &nbsp;
        <Link href="/">
          Click aquí
        </Link>
      </small>
    </Form>
  )
}
