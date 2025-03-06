import { Col, Form, Input, message, Modal, Row, Typography } from "antd"
import { useState, useEffect } from "react"
import { Login } from "./login"
import { Recovery } from "./recovery"
import { useRouter } from "next/router"
import { axios } from "../../helpers"

export const Auth = ({ login }) => {
  const [form] = Form.useForm()
  const router = useRouter()
  const [recoveryId, setRecoveryId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setState(state => {
        if (state === 5){
          return 1
        } else {
          return state + 1
        }
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const recovery = router.query.recovery
  const onPasswordRecovery = async () => {
    setLoading(true)
    try {
      const { password, confirmation } = form.getFieldsValue()
      if (password !== confirmation) {
        message.error("Las contraseñas no coinciden")
        return
      }

      await axios.post("/api/auth/password-change", { recovery: recoveryId, password })
      message.success("Contraseña restablecida")
      setRecoveryId(null)
    } catch (error) {
      console.error(error)

      if (error.response?.data?.expired) {
        message.error(error.response?.data?.message)
        setRecoveryId(null)
      } else {
        message.error("Ocurrió un error al restablecer la contraseña")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (recovery) {
      setRecoveryId(recovery)
      router.replace("")
    }
  }, [recovery])

  const sizeProps = { xs: 18, sm: 18, md: 10, lg: 6 }

  return (
    <Row
      align="middle"
      className={`event login container img_${state}`}
      justify="center">
      <Col {...sizeProps}>
        <Typography.Title>
          Salón La Joya
        </Typography.Title>
        <Typography.Paragraph>
          <Typography.Text strong>
            {login ? "Bienvenido" : "Recuperar contraseña"}
          </Typography.Text>
        </Typography.Paragraph>
        {login ? <Login /> : <Recovery />}
      </Col>
      <Modal
        okText="Restablecer"
        cancelText="Cancelar"
        visible={!!recoveryId}
        onOk={onPasswordRecovery}
        okButtonProps={{ loading }}
        title="Restablecer contraseña"
        onCancel={() => setRecoveryId(null)}>
        <Form form={form}>
          <Form.Item label="Nueva contraseña" name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Confirmar contraseña" name="confirmation">
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  )
}
