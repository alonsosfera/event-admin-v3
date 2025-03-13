import "jspdf-autotable"
import dayjs from "dayjs"
import { useRef, useState } from "react"
import { Button, Col, Popconfirm, Space, Table } from "antd"
import { EditOutlined, DeleteOutlined, DownloadOutlined  } from "@ant-design/icons"

import { withForm } from "../../helpers"
import dynamic from "next/dynamic"
const CustomTablesMap = dynamic(() => import("../custom-tables-map"), {
  ssr: false
})
import { createEventInvitationsPDF, getInvitations, getTableCoordinatesByRoomMaps } from "./helpers"
import { JoyaColumns } from "../host/event-details/constants"
import Link from "next/link"

const EventsTable = ({ data, edit, remove, hosts }) => {
  const [eventToDownload, setEventToDownload] = useState(null)
  const [tableCoordinatesToDownload, setTableCoordinatesToDownload] = useState([])
  const [invitations, setInvitations] = useState([])
  const stageRef = useRef(null)
  const getHostName = hostId => {
    return hosts.find(host => host.id === hostId)?.name
  }
  const onDownload =  async event => {
    const invitations = await getInvitations(event.id)
    setInvitations(invitations)
    setEventToDownload(event)
    if (event.roomMap) {
      const tableCoordinates = await getTableCoordinatesByRoomMaps({ roomMapId: event.roomMap.id })
      setTableCoordinatesToDownload(tableCoordinates)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    const mapBlob = stageRef.current.toDataURL()
    createEventInvitationsPDF(event, invitations, mapBlob)
  }

  const renderEvent = (text,data) => {
    const eventId = data.id
    return (
      <Link
        href={`/event/${eventId}`}
        rel="noopener noreferrer">
        {text}
      </Link>
    )
  }

  const now = dayjs()

  const sortedData = data.sort((a, b) => {
    const dateA = dayjs(a.eventDate)
    const dateB = dayjs(b.eventDate)

    if (dateA.isAfter(now) && dateB.isBefore(now)) return -1
    if (dateA.isBefore(now) && dateB.isAfter(now)) return 1

    return dateA.diff(now) - dateB.diff(now)
})

  return (
    <Col span={24}>
      <Table
        dataSource={sortedData}
        rowKey={row => row.id}
        scroll={{ x: true }}>
        <Table.Column
          dataIndex="name"
          sorter={(a, b) => (a.name || "").localeCompare(b.name || "")}
          title="Nombre"
          render={renderEvent} />
        <Table.Column
          dataIndex="eventDate"
          render={text => dayjs(text).format("DD/MM/YYYY hh:mm a")}
          sorter={(a, b) => (a.eventDate || "").localeCompare(b.eventDate || "")}
          title="Fecha" />
        <Table.Column
          dataIndex="assistance"
          sorter={(a, b) => (a.assistance || 0) - (b.assistance || 0)}
          title="Numero de Invitados" />
        <Table.Column
          title="Invitados Restantes"
          render={(text, record) => (record.assistance || 0) - (record.arrivedGuests || 0)} />,
        <Table.Column
          dataIndex="hostId"
          render={value => getHostName(value)}
          sorter={(a, b) => (getHostName(a.hostId) || "").localeCompare(getHostName(b.hostId) || "")}
          title="Anfitrión" />
        <Table.Column
          render={(t, row) =>
            <Space>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => onDownload(row)}
                shape="circle" />
              <Button
                icon={<EditOutlined />}
                onClick={() => edit(row)}
                shape="circle" />
              <Popconfirm
                cancelText="No"
                onConfirm={() => remove(row.id)}
                okText="Sí"
                title="¿Eliminar?">
                <Button
                  icon={<DeleteOutlined />}
                  shape="circle" />
              </Popconfirm>
            </Space>
          }
          width={1} />
      </Table>
      {eventToDownload && (
        <Col id="event-map" span={14}>
          <CustomTablesMap
            className="joya"
            setState={() => {}}
            stageRef={stageRef}
            columns={JoyaColumns}
            invitations={invitations}
            initialCoordinates={tableCoordinatesToDownload}
            distribution={eventToDownload.tablesDistribution}
            state={{ amount: null, distribution: eventToDownload.tablesDistribution, selected: [] }} />
        </Col>
      )}
    </Col>
  )
}

export default withForm(EventsTable)
