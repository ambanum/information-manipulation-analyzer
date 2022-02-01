import 'modules/Wdyr';
import 'modules/Embassy/styles/dsfr_old_vars.css';
import 'modules/Embassy/styles/embassy.scss';
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
import { fetcher } from 'utils/api';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider pageProps={pageProps}>
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        <NotifierContainer />
        <Analytics />
        <Component {...pageProps} />
      </SWRConfig>
    </AuthProvider>
  );
}

export default MyApp;
