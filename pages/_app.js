import '../styles/globals.scss'

// Import Ant Design components
import { ConfigProvider } from 'antd'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <Head>
        <title>Salón La Joya</title>
      </Head>
      <ConfigProvider>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ConfigProvider>
    </>
  )
}
