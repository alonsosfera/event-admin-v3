import { Button, Form, Input, message, Select, Space } from "antd"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"

export const Login = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onFinish = async credentials => {
    setIsLoading(true)
    credentials.phone = credentials.phone.number ? `${credentials.phone.countryCode || "52"}${credentials.phone.number}` : credentials.phone
    signIn("credentials", { ...credentials, callbackUrl: "/dashboard" })
      .catch(error => {
        message.error("Número de teléfono o contraseña incorrectos")
        console.error(error)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    const { phone, pass } = router.query

    if (phone && pass) {
      router.replace("/")
        .then(() => onFinish({ phone, password: pass }))
    }

    const { error } = router.query
    if (error && error === "invalid_credentials") {
      message.error("Credenciales inválidas")
    } else if (error && error === "server_error") {
      message.error("Hubo un error")
    }
  }, [router])

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
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Por favor ingresa tu contraseña!" }]}>
        <Input.Password placeholder="Contraseña" />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        loading={isLoading}>
        Entrar
      </Button>
      <small>
        ¿Olvidaste tu contraseña?
        &nbsp;
        <Link href="/recovery">
          Click aqui
        </Link>
      </small>
    </Form>
  )
}
