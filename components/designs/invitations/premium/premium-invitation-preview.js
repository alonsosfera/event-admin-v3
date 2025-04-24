import { Tooltip, FloatButton } from 'antd'
import { EyeOutlined } from '@ant-design/icons'

const PremiumInvitationPreview = ({ setIsEditing, setIsPreviewShown }) => {
   
  const invitationPreview = () => {
    setIsEditing(prev => !prev)
    setIsPreviewShown(true)
  }

  return (
    <Tooltip title="Vista previa" placement="left">
      <FloatButton
        type="primary"
        shape="square"
        style={{
          position: 'fixed',
          top: '90%',
          right: 24,
          transform: 'translateY(-50%)',
          zIndex: 1000,
          width: '70px',
          height: '40px',
        }}
        icon={<EyeOutlined style={{ fontSize: '23px' }} />}
        onClick={invitationPreview}
      />
    </Tooltip>
  )
}

export default PremiumInvitationPreview
