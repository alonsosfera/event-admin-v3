// Import Ant Design styles
import '../styles/antd-global.css';

// Import global styles
import '../styles/globals.css'
import '../styles/globals.scss'

// Import Ant Design components without CSS (handled by babel-plugin-import)
import { ConfigProvider } from 'antd'
import { antdConfig } from '../antd.config'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <Head>
        <title>Salón La Joya</title>
      </Head>
      <ConfigProvider {...antdConfig}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ConfigProvider>
    </>
  )
}
