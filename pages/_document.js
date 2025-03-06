import Document, { Html, Head, Main, NextScript } from "next/document"

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="es">
        <Head>
          <meta charSet="UTF-8" />
          <meta name="description" content="Adminitrador de eventos" />
          <link rel="icon" href="/assets/LogoLaJoya.ico" />
          <link href="https://fonts.googleapis.com/css2?family=Dosis:wght@500;600&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
