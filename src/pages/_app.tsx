import 'modules/Common/styles/reset.css';
import '@gouvfr/all/dist/css/all.css';

import useSWR, { SWRConfig } from 'swr';

import dynamic from 'next/dynamic';

const fetcher = (arg0: any, ...args: any[]) => fetch(arg0, ...args).then((res) => res.json());

dynamic(() => import('@gouvfr/all/dist/js/all.js'), { ssr: false });

function MyApp({ Component, pageProps }: any) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
