import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang='en'>
            <Head>
               
            </Head>
            <body>
                <Main />
                <NextScript />
                {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.6/lottie.min.js"></script> */}
                {/* <script>
                    const animation = lottie.loadAnimation({
                        container: document.getElementById('bg-wrapper'),
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        path: '/js/bg-gradient.json',
                    });
                </script> */}
            </body>
        </Html>
    )
}