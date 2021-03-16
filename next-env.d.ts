/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '@gouvfr/all/dist/js/all.js';

type WithChildren<T = {}> = T & { children?: React.ReactNode };

type WithClassname<T = {}> = T & { className?: string };
