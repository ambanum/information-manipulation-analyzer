import React from 'react';
import queryString from 'query-string';
import { useRouter } from 'next/router';

interface IParams {
  url?: string;
  param: string;
  value: string | string[] | number | null;
}

interface IParamsObject {
  [key: string]: string | string[] | undefined;
}

const useUrl = () => {
  const router = useRouter();
  // Here we do not use next router because on first request, queryParams will be empty
  // https://github.com/vercel/next.js/issues/10521
  const queryParams: any =
    typeof window !== 'undefined'
      ? queryString.parse(window.location.search, { arrayFormat: 'bracket' })
      : router.query;

  let pathname = router.asPath.split('?')[0];

  const setQueryParameter = React.useCallback(
    ({ url, param, value }: IParams) => {
      const parsed = queryString.parse(window.location.search, { arrayFormat: 'bracket' });

      if (value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
        delete parsed[param];
      } else {
        // @ts-ignore
        parsed[param] = value;
      }

      const stringified = queryString.stringify(parsed, { arrayFormat: 'bracket' });
      return `${url || pathname}?${stringified}`;
    },
    [pathname, queryParams]
  );

  const pushParam = React.useCallback(
    (
      params: IParams,
      asUrl?: Parameters<typeof router.push>[1],
      options?: Parameters<typeof router.push>[2]
    ) => {
      const newUrl = setQueryParameter(params);
      return router.push(newUrl, asUrl, options);
    },
    [router, setQueryParameter]
  );

  const pushQueryParams = React.useCallback(
    (
      newUrlParams: IParamsObject,
      asUrl?: Parameters<typeof router.push>[1],
      options?: Parameters<typeof router.push>[2]
    ) => {
      const parsed = queryString.parse(window.location.search, { arrayFormat: 'bracket' });

      for (const newUrlParam in newUrlParams) {
        const value: any = newUrlParams[newUrlParam];
        if (!!value) {
          parsed[newUrlParam] = value;
        } else {
          // we remove the param if it is empty
          delete parsed[newUrlParam];
        }
      }
      const qs = queryString.stringify(parsed);

      const newUrl = `${pathname}${qs ? `?${qs}` : ''}`;
      router.push(
        pathname,
        {
          // @ts-ignore
          pathname: asUrl || router.asPath.split('?')[0],
          query: parsed,
        },
        options
      );
      return newUrl;
    },
    [router, pathname, queryParams]
  );

  const replaceQueryParams = (newUrlParams: IParamsObject) => {
    return router.push(`${pathname}?${queryString.stringify(newUrlParams)}`);
  };

  const pushQueryParam = React.useCallback(
    (
        paramName: string,
        asUrl?: Parameters<typeof router.push>[1],
        options?: Parameters<typeof router.push>[2]
      ) =>
      (value: string | number | string[]) =>
        pushParam({ param: paramName, value }, asUrl, options),
    [pushParam]
  );

  const removeQueryParams = React.useCallback(
    (
      paramNames: string[],
      asUrl?: Parameters<typeof router.push>[1],
      options?: Parameters<typeof router.push>[2]
    ) => {
      const newParams = { ...queryParams };
      paramNames.forEach((paramName) => {
        newParams[paramName] = undefined;
      });

      pushQueryParams(newParams, asUrl, options);
      return true;
    },
    [pushQueryParams, queryParams]
  );

  const removeQueryParam = React.useCallback(
    (
      paramName: string,
      asUrl?: Parameters<typeof router.push>[1],
      options?: Parameters<typeof router.push>[2]
    ) => removeQueryParams([paramName], asUrl, options),
    [removeQueryParams]
  );

  const stringifyParams = React.useCallback((params: object) => {
    const queryParamsNotMinAndMaxStringified = queryString.stringify(params);
    return queryParamsNotMinAndMaxStringified ? `?${queryParamsNotMinAndMaxStringified}` : '';
  }, []);

  return {
    queryParams,
    queryParamsStringified: `?${queryString.stringify(queryParams)}`,
    stringifyParams,
    replaceQueryParams,
    pushQueryParams,
    pushQueryParam,
    removeQueryParam,
    removeQueryParams,
  };
};

export default useUrl;
