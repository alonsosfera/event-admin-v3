import { Layout as ALayout } from "antd"
import { Toolbar } from "./toolbar"

export const Layout = ({ children }) => {
  return (
    <div className="event layout full-height">
      <ALayout className="full-height">
        <Toolbar />
        <ALayout.Content>
          <div className="full-height">
            {children}
          </div>
        </ALayout.Content>
      </ALayout>
    </div>
  )
}
