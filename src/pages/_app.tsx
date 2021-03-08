import 'modules/Common/styles/reset.css';
import '@gouvfr/all/dist/css/all.css';

import dynamic from 'next/dynamic';

dynamic(() => import('@gouvfr/all/dist/js/all.js'), { ssr: false });

function MyApp({ Component, pageProps }: any) {
  return <Component {...pageProps} />;
}

export default MyApp;
