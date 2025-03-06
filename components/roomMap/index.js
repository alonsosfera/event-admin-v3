import React, { useEffect, useState } from "react"
import { Col, Button, List, Row, Input } from "antd"
import { Heading } from "../shared"
import { MapDrawer } from "./mapDrawer"
import { deleteRoomMap, getRoomMaps, getTableCoordinatesByRoomMaps, updateRoomMap, createRoomMap } from "../events/helpers"
import { useService } from "../../hooks/use-service"
import { CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { DEFAULT_POSITION } from "../custom-tables-map/helpers"
import { addMainTable, generateTableSchema } from "../../helpers/api/tables"

export const MapRoom = () => {
  const [roomMaps, setRoomMaps] = useState([])
  const [roomMapOnEdit, setRoomMapOnEdit] = useState(null)
  const [editedRoomMapName, setEditedRoomMapName] = useState("")
  const [loadingTables, setLoadingTables] = useState(false)
  const [roomMapCoordinates, setRoomMapCoordinates] = useState(null)
  const { data, loading, refetch } = useService(getRoomMaps)
  const [tablesDistribution, setTablesDistribution] = useState({})

  useEffect(() => {
    if (!data) return
    setRoomMaps(data)
  }, [data])

  const handleEdit = async (id, name) => {
    setLoadingTables(true)
    setRoomMaps(prev => {
      return prev.filter(map => !map.isGeneric)
    })
    try {
      setRoomMapOnEdit(id)
      setEditedRoomMapName(name)
      const tableCoordinates = await getTableCoordinatesByRoomMaps({ roomMapId: id })
      const newTablesDistribution = tableCoordinates.reduce((acc, table) => {
        acc[table.key] = {
          spaces: 12,
          occupiedSpaces: 0
        }
        return acc
      }, {})

      setTablesDistribution(newTablesDistribution)
      setRoomMapCoordinates(tableCoordinates)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingTables(false)
    }
  }
  const handleCancelEdit = isGeneric => {
    isGeneric && setRoomMaps(prev => {
      return prev.filter(map => map.id !== roomMapOnEdit)
    })
    setRoomMapOnEdit(null)
    setEditedRoomMapName("")
    setRoomMapCoordinates(null)
  }

  const handleSave = async id => {
    if (!roomMapOnEdit || id !== roomMapOnEdit) return
    setLoadingTables(true)
    try {
      const isGeneric = roomMaps.some(map => map.id === id && map.isGeneric)
      if (isGeneric) {
        await createRoomMap({ roomMapName: editedRoomMapName, roomMapCoordinates })
      } else {
        await updateRoomMap(id, { roomMapName: editedRoomMapName, roomMapCoordinates })
      }
      handleCancelEdit()
      await refetch()
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingTables(false)
    }
  }

  const handleDelete = async id => {
    setLoadingTables(true)
    try {
      await deleteRoomMap(id)
      handleCancelEdit()
      await refetch()
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingTables(false)
    }
  }

  const onCoordinateChange = map => {
    setRoomMapCoordinates(map)
  }

  const addNewItem = () => {
    const genericId = crypto.randomUUID()
    setRoomMapOnEdit(genericId)
    const mainCustomConfig = {
      displayElement: false
    }
    const firstCoordinatesMap = Object.entries(DEFAULT_POSITION).map(([tableName, coords]) => ({
      coordinateX: coords.x,
      coordinateY: coords.y,
      key: tableName,
      customConfig: tableName === "table-main" ? JSON.stringify(mainCustomConfig) : null
    }))
    setRoomMapCoordinates(firstCoordinatesMap)
    const initial = generateTableSchema(240, null)
    addMainTable(initial)
    setTablesDistribution(initial)
    setEditedRoomMapName("")
    setRoomMaps(prev => ([{ isGeneric: true, id: genericId }, ...prev ]))
  }

  const hideTable = (tableName, hideTable) => {
    setRoomMapCoordinates(prev => {
      const table = prev.find(map => map.key === tableName)
      const filteredCoords = prev.filter(coord => coord.key !== tableName)
      const customConfig = {
        displayElement: !hideTable
      }
      const updatedTable = {
        ...(table || {}),
        key: tableName,
        customConfig: JSON.stringify(customConfig)
      }

      return [...filteredCoords, updatedTable]
    })
  }

  return (
    <Row className="room-map-container">
      <Heading title="Acomodo de mesas" />
      <Col
        style={{ background: "#fff", padding: "1rem" }} span={24}
        lg={9} className="map-room-container">
        <Button
          type="primary" icon={<PlusOutlined />}
          onClick={addNewItem}>
          Crear Room Map
        </Button>
        <List
          dataSource={roomMaps}
          loading={loadingTables || loading}
          renderItem={item => (
            <List.Item
              style={{ minHeight: "83px" }}
              actions={[
                roomMapOnEdit === item.id
                  ? (
                    <Button
                      type="primary"
                      shape="circle"
                      ghost
                      key={`${item.id  } close`}
                      icon={<CloseOutlined />}
                      onClick={() => handleCancelEdit(item.isGeneric)} />
                  ) : undefined,
                <Button
                  type="primary"
                  shape="circle"
                  key={`${item.id  } edit`}
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(item.id, item.name)} />,
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  key={`${item.id  } delete`}
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(item.id)} />
              ]}>
              <List.Item.Meta
                title={roomMapOnEdit === item.id
                  ? (
                    <Input
                      placeholder="Ingrese nombre del nuevo mapa"
                      value={editedRoomMapName}
                      onChange={e => setEditedRoomMapName(e.target.value)} />
                  ) : item.name
                }
                description={item.creationDate && `Creada el ${new Date(item.creationDate).toLocaleDateString("es")}`} />
            </List.Item>
          )}
          rowKey={row => row.id} />
      </Col>
      <Col
        sm={24}
        lg={15}
        style={{ background: "#fff", padding: "1rem" }}>
        <MapDrawer
          hideTable={hideTable}
          mainTableType={"main"}
          handleSave={handleSave}
          roomId={roomMapOnEdit}
          tablesCoords={roomMapCoordinates}
          tablesDistribution={tablesDistribution}
          onCoordinateChange={onCoordinateChange}
          setTablesDistribution={setTablesDistribution} />
      </Col>
    </Row>
  )
}

export default MapRoom
