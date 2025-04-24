import { Tooltip, FloatButton } from 'antd'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'

const PremiumInvitationPreview = ({ isEditing, setIsEditing, setIsPreviewShown }) => {
   
  const invitationPreview = () => {
    setIsEditing(prev => !prev)
    setIsPreviewShown(true)
  }

  return (
    <Tooltip title={ isEditing ? "Ver vista previa" : "Ir a modo edición" }  placement="left">
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
        icon={ isEditing ? (<EyeOutlined style={{ fontSize: '23px' }} /> ) : (<EditOutlined style={{ fontSize: '23px' }}   />)}
        onClick={invitationPreview}
      />
    </Tooltip>
  )
}

export default PremiumInvitationPreview
