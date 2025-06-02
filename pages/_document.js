import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="preload"
          href="/fonts/TheSans-Plain.ttf"
          as="font"
          type="font/ttf"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/TheSans-Bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin=""
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                let fonts = document.createElement('style');
                fonts.textContent = "@font-face { font-family: 'TheSans'; src: url('/fonts/TheSans-Plain.ttf') format('truetype'); font-display: block; } @font-face { font-family: 'TheSansBold'; src: url('/fonts/TheSans-Bold.ttf') format('truetype'); font-display: block; }";
                document.head.appendChild(fonts);
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}