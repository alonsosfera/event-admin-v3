import { Button, Divider, Radio, Space } from "antd"
import React, { useEffect, useState } from "react"
import { SaveOutlined } from "@ant-design/icons"
import { JoyaColumns, JoyaLobby } from "../host/event-details/constants"
import dynamic from "next/dynamic"
import { getNextTable } from "../../helpers/getNextTable"
import { DEFAULT_POSITION } from "../custom-tables-map/helpers"
const CustomTablesMap = dynamic(() => import("../custom-tables-map"), {
  ssr: false
})

export function MapDrawer({ handleSave, roomId, onCoordinateChange, tablesCoords, hideTable, tablesDistribution, setTablesDistribution }) {
  const [showMain, setShowMain] = useState("false")
  const handleShowMainChange = ev => {
    const value = ev.target.value
    setShowMain(value)
    hideTable("table-main", value === "false")
  }

  useEffect(() => {
    const mainTable = (tablesCoords || []).find(t => t.key === "table-main")
    setShowMain(JSON.parse(mainTable?.customConfig || "{}")?.displayElement ? "true" : "false")
  }, [tablesCoords])

  const onDeleteTable = tableName => {
    setTablesDistribution(prev => {
      delete prev[tableName]
      return prev
    })
    const newCoords = tablesCoords.filter(el => el.key !== tableName)
    onCoordinateChange(newCoords)
  }

  const onAddTable = () => {
    const clonedTableDistribution = JSON.parse(JSON.stringify(tablesDistribution))
    const tablesDistributionArray = Object.entries(clonedTableDistribution)
    const nextTable = getNextTable(clonedTableDistribution)
    const nextTableName = `table-${  nextTable}`

    const newTableData = [
      nextTableName,
      {
        spaces: 12,
        occupiedSpaces: 0
      }
    ]
    const newDistributionArray = tablesDistributionArray.toSpliced(nextTable - 1,0, newTableData)

    const newTableDistribution = Object.fromEntries(newDistributionArray)
    setTablesDistribution(newTableDistribution)
    const cloneCoords = [...tablesCoords]

    const newTableCoordinates = {
      "coordinateX": DEFAULT_POSITION[nextTableName]?.x,
      "coordinateY": DEFAULT_POSITION[nextTableName]?.y,
      "key": nextTableName
    }
    onCoordinateChange([...cloneCoords, newTableCoordinates])
  }
  return (
    <div
      key={roomId}
      className="drawer"
      style={{ display: "flex", flexDirection: "row"  }}>
      <div className="drawer-content" style={{ display:"flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button disabled={!roomId} onClick={onAddTable}>Agregar mesa</Button>
          <Divider style={{ height: "100%" }} type="vertical" />
          <Radio.Group disabled={!roomId} onChange={handleShowMainChange} value={showMain}>
            <Radio.Button value="true">Mostrar mesa de honora</Radio.Button>
            <Radio.Button style={{ marginLeft: "1rem" }} value="false">No mostrar mesa de honor</Radio.Button>
          </Radio.Group>
        </div>
        <CustomTablesMap
          invitations={[]}
          className={"joya"}
          setState={() => {}}
          columns={JoyaColumns}
          lobby={<JoyaLobby />}
          onDeleteTable={onDeleteTable}
          allowEditTablesPosition={true}
          allowAddInvitations={false}
          onCoordinateChange={onCoordinateChange}
          initialCoordinates={tablesCoords}
          distribution={roomId ? tablesDistribution : []} />
        <div style={{ display: "flex", justifyContent: "end" }}>
          <Space>
            <Button
              disabled={!roomId}
              type="primary"
              onClick={() => handleSave(roomId)}
              icon={<SaveOutlined />}>
              Guardar
            </Button>
          </Space>
        </div>
      </div>
    </div>
  )
}
