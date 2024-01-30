import Head from "next/head"
import "../styles/fonts.css"
import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
import { ConnProvider } from "../context/connContext"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>FWD Campaign</title>
      </Head>
      <SessionProvider session={pageProps.session}>
        <ConnProvider>
          <Component {...pageProps} />
        </ConnProvider>
      </SessionProvider>
    </>
  )
}

export default MyApp
