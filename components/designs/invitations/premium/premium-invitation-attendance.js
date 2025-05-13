import { useState } from 'react'
import { Button, Row, Typography, Col, InputNumber, Modal, message } from 'antd'
import axios from 'axios'

const { Title, Text } = Typography

const PremiumInvitationAttendance = ({ isEditing, onDataChange, sectionData, invitated, invitationId, globalTitleColor, globalSubtitleColor }) => {
  const [subtitle, setSubtitle] = useState( sectionData?.subtitle ||
    "Para nosotros es muy importante que nos acompañes, por favor confirma tu asistencia para poder considerarte."
  )
  const [confirmedGuests, setConfirmedGuests] = useState(invitated?.numberGuests)
  const [confirmedGuestsEdit, setConfirmedGuestsEdit] = useState(1)

  const handleTextChange = (val) => {
    setSubtitle(val)
    onDataChange?.({ subtitle: val })
  }

  const { confirm } = Modal

  const showConfirm = () => {
    let currentConfirmed = confirmedGuests

    confirm({
      title: "Confirmación",
      content: (
        <div>
          <p>¿Confirmar invitados para {invitated?.invitationName}?</p>
          <InputNumber
            value={currentConfirmed}
            min={1}
            max={invitated?.numberGuests}
            type="number"
            onChange={value => { currentConfirmed = value; setConfirmedGuests(value) }} />
        </div>
      ),
      onOk() {
        handleConfirmation(currentConfirmed)
      },
      onCancel() {}
    })
  }

  const handleConfirmation = async confirmed => {
    if (!confirmed) return
    try {
      await axios.post("/api/invitations/confirm", {
        invitationId,
        confirmed
      })
      message.success("Confirmación enviada")
    } catch (error) {
      console.error("Error al confirmar la invitación:", error)
    }
  }

  const showConfirmEdit = () => {

    confirm({
      title: "Confirmación",
      content: (
        <div>
          <p>¿Confirmar invitados para &quot;solo de ejemplo&quot;?</p>
          <InputNumber
            defaultValue={confirmedGuestsEdit}
            min={0}
            max={100}
            type="number"
            onChange={value => { setConfirmedGuestsEdit(value) }} />
        </div>
      ),
      onOk() {
        handleConfirmationEdit()
      },
      onCancel() {}
    })
  }

  const handleConfirmationEdit = () => {
    message.success("Confirmación enviada")
  }

  return (
    <>
      <Row justify="center">
        <Col xs={24} sm={16}>
          <Title
            level={2}
            style={{ color: globalTitleColor, marginBottom: '10px', fontWeight: 'bold' }}
          >
            Confirmar Asistencia
          </Title>
          <Text
            style={{ fontSize: '18px', color: globalSubtitleColor }}
            editable={isEditing ? {
              triggerType: ['icon', 'text'],
              onChange: handleTextChange
            } : false}
          >
            {subtitle}
          </Text>
        </Col>
      </Row>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button
          type="primary"
          size="large"
          style={{
            backgroundColor: '#8e44ad',
            borderRadius: '8px',
            padding: '15px 30px',
            fontSize: '18px',
            width: '100%',
            maxWidth: '300px',
          }}
          onClick={invitationId ? showConfirm : showConfirmEdit}
        >
          Confirmar Asistencia
        </Button>
      </div>
    </>
  )
}

export default PremiumInvitationAttendance
