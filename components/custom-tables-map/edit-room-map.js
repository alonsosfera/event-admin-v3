import { Button, Modal } from "antd"
import { JoyaColumns, JoyaLobby } from "../host/event-details/constants"
import React, { useState } from "react"
import dynamic from "next/dynamic"
import { createRoomMap, updateEvent, updateRoomMap } from "../events/helpers"
import { getNextTable } from "../../helpers/getNextTable"
import { DEFAULT_POSITION } from "./helpers"
const CustomTablesMap = dynamic(() => import("../custom-tables-map"), {
  ssr: false
})

export const EditRoomMap = ({
  event,
  eventId,
  eventName,
  roomMapData,
  refetchEvent,
  roomMapRefetch,
  loadingRoomMap,
  openEditMapModal,
  tablesDistribution,
  handleEditMapModalToggle,
  handleRoomMapModalSubmit
}) => {
  const [loading, setLoading] = useState(false)
  const [roomMapCoordinates, setRoomMapCoordinates] = useState([])

  const handleSave = async () => {
    setLoading(true)
    try {
      if (roomMapData?.id) await updateRoomMap(roomMapData?.id, { roomMapCoordinates })
      else await createRoomMap({ roomMapCoordinates, roomMapName: eventName, eventId })
      await roomMapRefetch({ eventId })
      await updateEvent({ tablesDistribution }, eventId)
      handleRoomMapModalSubmit()
    } catch (err) {
      console.error(err)
    }
    finally {
      setLoading(false)
    }
  }

  const onDeleteTable = (tableName) => {
    const newTableDistribution = JSON.parse(JSON.stringify(tablesDistribution))
    delete newTableDistribution[tableName]
    refetchEvent({ ...event, tablesDistribution: newTableDistribution })
  }
  const onAddTable = () => {
    const clonedTableDistribution = JSON.parse(JSON.stringify(tablesDistribution))
    const tablesDistributionArray = Object.entries(clonedTableDistribution)
    const nextTable = getNextTable(tablesDistribution)
    const nextTableName = `table-${nextTable}`

    const newTableData = [
      nextTableName,
      { spaces: 12, occupiedSpaces: 0 }
    ]
    const newDistributionArray = tablesDistributionArray.toSpliced(nextTable - 1,0, newTableData)

    const newTableDistribution = Object.fromEntries(newDistributionArray)
    const newTableCoordinates = {
      "coordinateX": DEFAULT_POSITION[nextTableName]?.x,
      "coordinateY": DEFAULT_POSITION[nextTableName]?.y,
      "key": nextTableName
    }
    setRoomMapCoordinates(prev => [...prev, newTableCoordinates])
    refetchEvent({ ...event, tablesDistribution: newTableDistribution })
  }

  return (
    <Modal
      width={950}
      onOk={handleSave}
      destroyOnClose
      okText="Guardar"
      title="Editar Mapa"
      visible={openEditMapModal}
      onCancel={handleEditMapModalToggle}
      confirmLoading={loading || loadingRoomMap}
      okButtonProps={{ loading: loading || loadingRoomMap }}>
      <>
        <Button
          style={{ marginBottom: "1rem" }}
          onClick={onAddTable}>Agregar mesa</Button>
        <CustomTablesMap
          invitations={[]}
          initialCoordinates={roomMapData?.canvaMap?.coordinates}
          className={"joya"}
          columns={JoyaColumns}
          lobby={<JoyaLobby />}
          onDeleteTable={onDeleteTable}
          allowEditTablesPosition={true}
          allowAddInvitations={false}
          onCoordinateChange={setRoomMapCoordinates}
          setState={() => {}}
          distribution={tablesDistribution} />
      </>
    </Modal>
  )
}
