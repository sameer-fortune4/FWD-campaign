import Head from "next/head"
import "../styles/fonts.css"
import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>FWD Campaign</title>
      </Head>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}

export default MyApp
