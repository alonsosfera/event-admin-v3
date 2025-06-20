import axios from "axios"
import dynamic from "next/dynamic"
import React, { useState } from "react"
import { Col, message, Modal, Row, Button } from "antd"

import { EditableModalTitle } from "../../shared"
import { InvitationConfigItem } from "./invitation-config-item"
const InvitationConfigMap = dynamic(() => import("./invitation-config-map"), {
  ssr: false
})

const buttonDesign = {
  fontSize: 50,
  fontColor: "#ffffff",
  fontFamily: "Merienda, cursive",
  isButton: true,
  buttonStyle: {
    backgroundColor: "#88C9DB",
    padding: "5px 10px",
    borderRadius: "4px",
  }
};

const ensureConfirmButton = (coords) => {
  const hasConfirmButton = coords.some(c => c.key === "confirmButton");
  if (!hasConfirmButton) {
    const confirmButton = {
      key: "confirmButton",
      label: "Confirmar Asistencia",
      coordinateX: 600,
      coordinateY: 800,
      customConfig: buttonDesign
    };
    coords.push(confirmButton);
  }
  return coords;
};

const getDefaultItems = canvaMap => {
  let coords = canvaMap?.coordinates?.map(coordinate => ({
    ...coordinate,
    customConfig: typeof coordinate.customConfig === 'string' ? JSON.parse(coordinate.customConfig) : coordinate.customConfig
  })) || [];
  coords = ensureConfirmButton(coords);
  return coords;
  
}

export const InvitationConfigModal = ({ onClose, onSuccess, selectedFile }) => {
  const [items, setItems] = useState(getDefaultItems(selectedFile.canvaMap))
  const [scaleFactor, setScaleFactor] = useState(null)
  const [fileName, setFileName] = useState(selectedFile.fileName)
  const [loading, setLoading] = useState(false)
  const confirmButton = items.find(i => i.key === "confirmButton");
  const confirmButtonConfig = confirmButton ? confirmButton.customConfig : buttonDesign;

  const onSave = async () => {
    setLoading(true)
    try {
      await axios.put("/api/design/invitations", {
        ...selectedFile,
        fileName,
        canvaMap: {
          ...selectedFile.canvaMap,
          coordinates: items.map(item => ({ ...item, customConfig: JSON.stringify(item.customConfig) }))
        }
      })
      onSuccess()
      message.success("Diseño guardado correctamente")
      onClose()
    } catch (error) {
      message.error("Error al guardar")
      console.error("Error saving design:", error)
    } finally {
      setLoading(false)
    }
  }

  const onDeleteDesign = async () => {
    setLoading(true)
    try {
      await axios.delete("/api/design/invitations", {
        params: { id: selectedFile.id }
      })
      onSuccess()
      message.success("Diseño eliminado correctamente")
      onClose()
    } catch (error) {
      message.error("Error al eliminar")
      console.error("Error deleting design:", error)
    } finally {
      setLoading(false)
    }
  }


  const onAddItem = item => {
    if (items.find(i => i.key === item.key)) {
      message.error("Ya existe un campo con ese nombre")
      return
    }
    setItems(prevState => [...prevState, { coordinateX: 15, coordinateY: 15, ...item }])
  }

  const onDeleteItem = item => {
    setItems(prevState => prevState.filter(i => i.key !== item.key))
  }

  const onUpdateItemPosition = (item, coordinates) => {
    setItems(prevState => prevState.map(i => i.key === item.key ? { ...i, ...coordinates } : i))
  }

  const onUpdateItemLink = (item, link) => {
    setItems(prevState => prevState.map(i => i.key === item.key ? { ...i, customConfig: { ...i.customConfig, link } } : i))
  }

  const onCustomConfigChange = (newConfig) => {
  setItems(prev =>
    prev.map(item =>
      item.key === "confirmButton"
        ? { ...item, customConfig: { ...item.customConfig, ...newConfig } }
        : item
    )
  );
};


  return (
    <Modal
      width={800}
      onOk={onSave}
      okText="Guardar"
      onCancel={onClose}
      open={!!selectedFile}
      confirmLoading={loading}
      title={<EditableModalTitle title={fileName} onChange={setFileName} />}
      footer={[
        <Button
          key="delete" type="primary"
          danger onClick={onDeleteDesign}>
          Eliminar
        </Button>,
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button
          key="save" type="primary"
          loading={loading} onClick={onSave}>
          Guardar
        </Button>
      ]}>
      <Row gutter={12}>
        <Col span={12}>
          <InvitationConfigMap
            items={items}
            scaleFactor={scaleFactor}
            selectedFile={selectedFile}
            onDeleteItem={onDeleteItem}
            setScaleFactor={setScaleFactor}
            onUpdateItemPosition={onUpdateItemPosition}
            onUpdateItemLink={onUpdateItemLink} />
        </Col>
        <Col span={12}>
          <InvitationConfigItem
            onSubmit={onAddItem}
            scaleFactor={scaleFactor}
            selectedFile={selectedFile} 
            customConfig={confirmButtonConfig}
            onCustomConfigChange={onCustomConfigChange}
           />
        </Col>
      </Row>
    </Modal>
  )
}
