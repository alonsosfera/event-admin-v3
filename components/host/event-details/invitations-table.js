import { Button, Popconfirm, Space, Table, Tooltip, Dropdown, Menu, Alert } from "antd"
import { SmallDashOutlined } from "@ant-design/icons"
import { DeleteOutlined, DownloadOutlined, SendOutlined } from "@ant-design/icons"
import { useState, useEffect } from "react"
import { DigitalInvitationModal } from "../../digital-invitation/modal"
import { EditRoomMap } from "../../custom-tables-map/edit-room-map"
import { useSession } from "next-auth/react"

const InvitationsTable = ({
  data, onNew, onDownload, onSingleDownload, loadingRoomMap, roomMapRefetch, roomMapData, refetchEvent,
  onResendInvitation, remove, event, invitedGuests
}) => {
  const [openModalInvitation, setOpenModalInvitation] = useState(false)
  const [isInviteButtonDisabled, setIsInviteButtonDisabled] = useState(false)
  const [openEditMapModal, setOpenEditMapModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const handleDigitalModalToggle = () => {
    const coordinates = event?.digitalInvitation?.canvaMap?.coordinates || []
    if (coordinates.length === 0) {
      setShowAlert(true)
    } else {
      setOpenModalInvitation(!openModalInvitation)
    }
  }

  const handleEditMapModalToggle = () => {
    setOpenEditMapModal(!openEditMapModal)
  }

  const fullSpaces = () => {
    if (invitedGuests >= event.assistance) {
      setIsInviteButtonDisabled(true)
    } else {
      setIsInviteButtonDisabled(false)
    }
  }

  const handleRoomMapModalSubmit = () => {
    setOpenEditMapModal(false)
  }

  useEffect(() => {
    fullSpaces()
  }, [invitedGuests])

  const { data: { user } = {} } = useSession()

  const menuDropDown = (
    <Menu>
      {user?.role === "ADMIN" && (
        <Menu.Item key="1">
          <a className="invite-btn" onClick={handleEditMapModalToggle}>
            Editar Mapa
          </a>
        </Menu.Item>
      )}
      <Menu.Item key="2">
        <a onClick={onDownload}>
          Descargar invitaciones
        </a>
      </Menu.Item>
    </Menu>
  )

  return (
    <div>
      {showAlert && (
        <Alert
          message="Favor de comunicarse con administración para que se le asigne una invitación digital"
          type="warning"
          showIcon
          closable
          onClose={() => setShowAlert(false)} />
      )}
      <Table
        size="small"
        className="invitations-table"
        dataSource={data}
        title={() => (
          <Space>
            <Tooltip title={isInviteButtonDisabled && "Los invitados han llegado a su capacidad"}>
              <Button
                type="primary"
                className="invite-btn"
                onClick={onNew}
                disabled={isInviteButtonDisabled}>
                Invitar
              </Button>
            </Tooltip>
            <Button onClick={handleDigitalModalToggle}>
              Invitación Digital
            </Button>
            <Dropdown
              overlay={menuDropDown}
              trigger={["click"]}>
              <Button>
                <SmallDashOutlined />
              </Button>
            </Dropdown>
          </Space>
        )}
        rowKey={row => row.id}
        scroll={{ x: true }}>
        <Table.Column dataIndex="invitationName" title="Nombre" />
        <Table.Column dataIndex="numberGuests" title="Invitados" />
        <Table.Column
          title="Confirmados"
          dataIndex="confirmed"
          defaultSortOrder="descend"
          sorter={(a, b) => a.confirmed - b.confirmed}
          render={confirmed => (
            <span>
              {confirmed ? (
                <span style={{ color: "green" }}>{confirmed}</span>
          ) : (
            <span style={{ color: "red" }}>No confirmado</span>
          )}
            </span>
          )} />
        <Table.Column dataIndex="phone" title="WhatsApp" />
        <Table.Column
          title="Estatus"
          dataIndex="deliveryStatus"
          render={value => (value ? "Enviada" : "No enviada")} />
        <Table.Column
          render={row => (
            <Space>
              <Tooltip title={row.deliveryStatus ? "La invitación ya ha sido enviada" : "Reenviar invitación"}>
                <Button
                  shape="circle"
                  icon={<SendOutlined />}
                  disabled={row.deliveryStatus}
                  onClick={() => onResendInvitation(row)} />
              </Tooltip>
              <Tooltip title="Descargar invitación">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => onSingleDownload(row)}
                  shape="circle" />
              </Tooltip>
              <Popconfirm
                title="¿Estas seguro?"
                onConfirm={() => remove(row.id)}
                okText="Si"
                cancelText="No">
                <Button icon={<DeleteOutlined />} shape="circle" />
              </Popconfirm>
            </Space>
          )}
          width={1} />
      </Table>
      <DigitalInvitationModal
        event={event}
        isVisible={openModalInvitation}
        onCancel={handleDigitalModalToggle}
        onSubmit={handleDigitalModalToggle} />
      <EditRoomMap
        event={event}
        eventId={event.id}
        eventName={event.name}
        roomMapData={roomMapData}
        refetchEvent={refetchEvent}
        loadingRoomMap={loadingRoomMap}
        roomMapRefetch={roomMapRefetch}
        tablesDistribution={event.tablesDistribution}
        handleRoomMapModalSubmit={handleRoomMapModalSubmit}
        handleEditMapModalToggle={handleEditMapModalToggle}
        openEditMapModal={openEditMapModal} />
    </div>
  )
}

export default InvitationsTable
