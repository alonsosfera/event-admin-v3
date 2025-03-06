import React, { useEffect, useState } from "react"
import { Card, Col, Row, Spin, Tabs } from "antd"

import { Heading } from "../shared"
import { axios } from "../../helpers"
import { UploadImage } from "./upload-image"
import { InvitationsList } from "./invitations/invitations-list"

import { PassesList } from "./passes/passes-list"

export const Designs = () => {
  const { TabPane } = Tabs
  const [list, setList] = useState({
    invitations: [],
    passes: []
  })
  const [editingFile, setEditingFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState("invitations")

  const fetchData = () => {
    setLoading(true)
    axios.get(`/api/design/${selectedTab}`)
      .then(({ data }) => setList({ ...list, [selectedTab]: data[selectedTab] }))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [selectedTab])

  const onSaveNewFile = file => {
    setEditingFile(file)
    setList({ ...list, [selectedTab]: [file, ...list[selectedTab]] })
  }

  const sharedProps = {
    fetchData,
    editingFile,
    setEditingFile
  }
  const spin = <Spin
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }} />
  return (
    <Row className="designs" gutter={[10, 8]}>
      <Heading
        title="Diseños"
        customActions={[
          <UploadImage
            key="upload"
            folder={selectedTab}
            onSubmit={onSaveNewFile} />
        ]} />
      <Col span={24}>
        <Card className="designs-card">
          <Tabs
            onChange={setSelectedTab}
            defaultActiveKey="invitation"
            tabBarStyle={{ padding: "0 20px" }}>
            <TabPane
              tab="Invitaciones"
              key="invitations"
              style={{ padding: "20px" }}>
              {loading || selectedTab !== "invitations" ? spin : <InvitationsList list={list.invitations} {...sharedProps} />}
            </TabPane>
            <TabPane
              tab="Boletos"
              key="passes"
              style={{ padding: "20px" }}>
              {loading || selectedTab !== "passes" ? spin : <PassesList list={list.passes} {...sharedProps} /> }
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
  )
}
