import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
    return (
        <Html>
            <Head />
            <body>
            <Main />
            <NextScript />
            <Script
                id="google-adsense"
                async
                crossOrigin="anonymous"
                data-cookiecategory="targeting"
                strategy="beforeInteractive"
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3288402026194745"/>
            </body>
        </Html>
    )
}