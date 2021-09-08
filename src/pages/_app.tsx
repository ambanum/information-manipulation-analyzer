import 'modules/Wdyr';
// FIXME All global css must be loaded from _app
// This means that all scss files using animations must be loaded here
// This is bad as it breaks the modularity of components
// Go Fix it
import 'modules/Embassy/styles/embassy.scss';
import '@gouvfr/dsfr/dist/css/dsfr.css';
import 'components/Loading/Loading.scss';
// NProgress
import 'nprogress/nprogress.css'; //styles of nprogress//Binding events.
import 'modules/NProgress/nprogress.theme.scss';
import 'modules/NProgress'; //nprogress module

import { Analytics } from 'modules/Analytics';
import { AppProps } from 'next/app';
import { AuthProvider } from 'modules/Auth';
import { NotifierContainer } from 'hooks/useNotifier';
import { SWRConfig } from 'swr';
import Script from 'next/script';
import { fetcher } from 'utils/api';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider pageProps={pageProps}>
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        {/* See https://github.com/GouvernementFR/dsfr/issues/39 */}
        <Script
          type="module"
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/@gouvfr/dsfr/dist/js/dsfr.module.js`}
        />
        <Script
          type="text/javascript"
          noModule={true}
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/@gouvfr/dsfr/dist/js/dsfr.nomodule.js`}
        />
        <NotifierContainer />
        <Analytics />
        <Component {...pageProps} />
      </SWRConfig>
    </AuthProvider>
  );
}

export default MyApp;
