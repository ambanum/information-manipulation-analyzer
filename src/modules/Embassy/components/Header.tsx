import {
  Header as DSFRHeader,
  HeaderBody,
  HeaderNav,
  HeaderOperator,
  Logo,
  NavItem,
  NavSubItem,
  Service,
} from '@dataesr/react-dsfr';

import React from 'react';

const Header = () => (
  <DSFRHeader closeButtonLabel="Close">
    <HeaderBody>
      <Logo>République Française</Logo>
      <HeaderOperator>
        <svg
          className="logo_drawings--header"
          fill="none"
          viewBox="0 0 57 97"
          preserveAspectRatio="xMinYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M56.4869 72.7038L42.4578 80.7872L14.4459 64.6205V32.3796L42.4578 16.2129L56.4869 24.2962V8.17574L42.4578 0.0924072L0.416748 24.2962V72.7038L42.4578 96.9076L56.4869 88.8243V72.7038Z"
            fill="#E1000F"
          ></path>
          <path
            d="M56.4869 56.5833V40.4167L42.4578 32.3795L28.475 40.4167V56.5833L42.4578 64.6205L56.4869 56.5833Z"
            fill="#000091"
          ></path>
        </svg>
        <svg
          className="logo_txt--header"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 124 64"
          preserveAspectRatio="xMinYMid meet"
        >
          <path
            d="M0.562256 9.23379C0.562256 8.17141 1.39567 7.43236 2.87729 7.15522L5.14603 6.78569V6.41617C5.14603 5.53855 4.49782 5.03045 3.61811 5.03045C2.83099 5.03045 2.22908 5.39998 1.85868 5.95426L0.79376 5.12284C1.44197 4.29141 2.41429 3.73712 3.66441 3.73712C5.56274 3.73712 6.62766 4.84569 6.62766 6.41617V11.0352H5.19233V10.25C4.68302 10.8966 3.80331 11.2662 2.9699 11.2662C1.53458 11.2662 0.562256 10.4347 0.562256 9.23379ZM3.2014 10.0652C4.08112 10.0652 4.77562 9.6495 5.19233 9.00284V7.80188L3.294 8.12522C2.41429 8.26379 2.04389 8.63331 2.04389 9.1876C2.04389 9.69569 2.46059 10.0652 3.2014 10.0652Z"
            fill="#000091"
          ></path>
          <path
            d="M8.8501 4.01426H10.2854V4.66093C10.7947 4.10665 11.4429 3.73712 12.3689 3.73712C13.3413 3.73712 14.1284 4.15283 14.5914 4.98426C15.147 4.29141 15.8415 3.73712 17.0453 3.73712C18.5269 3.73712 19.6382 4.75331 19.6382 6.69331V11.0352H18.2028V6.7395C18.2028 5.72331 17.6472 5.07664 16.7212 5.07664C15.8878 5.07664 15.3322 5.58474 14.9618 6.2776C14.9618 6.41617 14.9618 6.50855 14.9618 6.64712V10.989H13.5265V6.69331C13.5265 5.67712 12.9709 5.03045 12.0448 5.03045C11.1651 5.03045 10.6095 5.63093 10.2854 6.23141V10.9428H8.8501V4.01426Z"
            fill="#000091"
          ></path>
          <path
            d="M25.6573 11.3124C24.6386 11.3124 23.8978 10.9429 23.2959 10.2962V11.0352H21.8606V0.596191H23.2959V4.75333C23.8978 4.10667 24.6386 3.73714 25.6573 3.73714C27.8797 3.73714 29.2224 5.49238 29.2224 7.52476C29.2687 9.55714 27.8797 11.3124 25.6573 11.3124ZM23.2959 6.27762V8.77191C23.8052 9.55714 24.5923 9.97286 25.4721 9.97286C26.8148 9.97286 27.7408 8.91048 27.7408 7.52476C27.7408 6.13905 26.8148 5.07667 25.4721 5.07667C24.546 5.07667 23.8052 5.53857 23.2959 6.27762Z"
            fill="#000091"
          ></path>
          <path
            d="M30.4725 9.23379C30.4725 8.17141 31.3059 7.43236 32.7876 7.15522L35.0563 6.78569V6.41617C35.0563 5.53855 34.4081 5.03045 33.5284 5.03045C32.7413 5.03045 32.1394 5.39998 31.769 5.95426L30.704 5.12284C31.3522 4.29141 32.3246 3.73712 33.5747 3.73712C35.473 3.73712 36.5379 4.84569 36.5379 6.41617V11.0352H35.1026V10.25C34.5933 10.8966 33.7136 11.2662 32.8802 11.2662C31.4448 11.2662 30.4725 10.4347 30.4725 9.23379ZM33.1117 10.0652C33.9914 10.0652 34.6859 9.6495 35.1026 9.00284V7.80188L33.2043 8.12522C32.3246 8.26379 31.9542 8.63331 31.9542 9.1876C31.9542 9.69569 32.3709 10.0652 33.1117 10.0652Z"
            fill="#000091"
          ></path>
          <path
            d="M39.0381 9.18761C39.5012 9.78809 40.0568 10.1576 40.7513 10.1576C41.4458 10.1576 41.8162 9.7419 41.8162 9.2338C41.8162 7.8019 38.3899 8.30999 38.3899 5.8619C38.3899 4.70714 39.3623 3.78333 40.7513 3.78333C41.7699 3.78333 42.6959 4.29142 43.2052 4.93809L42.2329 5.76952C41.8625 5.26142 41.3532 4.93809 40.7976 4.93809C40.1494 4.93809 39.779 5.30761 39.779 5.81571C39.779 7.20142 43.2052 6.73952 43.2052 9.14142C43.2052 10.5271 42.094 11.3586 40.7513 11.3586C39.5475 11.3586 38.6677 10.8967 38.0195 10.1114L39.0381 9.18761Z"
            fill="#000091"
          ></path>
          <path
            d="M45.2425 9.18761C45.7055 9.78809 46.2611 10.1576 46.9556 10.1576C47.6501 10.1576 48.0205 9.7419 48.0205 9.2338C48.0205 7.8019 44.5943 8.30999 44.5943 5.8619C44.5943 4.70714 45.5666 3.78333 46.9556 3.78333C47.9742 3.78333 48.9003 4.29142 49.4096 4.93809L48.4372 5.76952C48.0668 5.26142 47.5575 4.93809 47.0019 4.93809C46.3537 4.93809 45.9833 5.30761 45.9833 5.81571C45.9833 7.20142 49.4096 6.73952 49.4096 9.14142C49.4096 10.5271 48.2983 11.3586 46.9556 11.3586C45.7518 11.3586 44.8721 10.8967 44.2239 10.1114L45.2425 9.18761Z"
            fill="#000091"
          ></path>
          <path
            d="M50.7522 9.23379C50.7522 8.17141 51.5856 7.43236 53.0672 7.15522L55.336 6.78569V6.41617C55.336 5.53855 54.6878 5.03045 53.808 5.03045C53.0209 5.03045 52.419 5.39998 52.0486 5.95426L50.9837 5.12284C51.6319 4.29141 52.6042 3.73712 53.8543 3.73712C55.7527 3.73712 56.8176 4.84569 56.8176 6.41617V11.0352H55.3823V10.25C54.873 10.8966 53.9933 11.2662 53.1598 11.2662C51.6782 11.2662 50.7522 10.4347 50.7522 9.23379ZM53.345 10.0652C54.2248 10.0652 54.9193 9.6495 55.336 9.00284V7.80188L53.4376 8.12522C52.5579 8.26379 52.1875 8.63331 52.1875 9.1876C52.1875 9.69569 52.6505 10.0652 53.345 10.0652Z"
            fill="#000091"
          ></path>
          <path
            d="M62.0496 3.73714C63.0683 3.73714 63.8091 4.10667 64.411 4.70714V0.596191H65.8926V11.0352H64.411V10.3424C63.8091 10.989 63.0683 11.3124 62.0496 11.3124C59.8272 11.3124 58.4382 9.55714 58.4382 7.52476C58.4382 5.49238 59.8272 3.73714 62.0496 3.73714ZM62.2348 9.97286C63.1609 9.97286 63.9017 9.55714 64.411 8.8181V6.27762C63.9017 5.49238 63.1146 5.12286 62.2348 5.12286C60.8921 5.12286 59.9661 6.18524 59.9661 7.57095C59.9661 8.95667 60.8921 9.97286 62.2348 9.97286Z"
            fill="#000091"
          ></path>
          <path
            d="M71.4949 11.3124C69.0873 11.3124 67.652 9.55712 67.652 7.52474C67.652 5.44617 68.9947 3.73712 71.2171 3.73712C73.1618 3.73712 74.4119 5.03045 74.4119 6.83188C74.4119 7.15522 74.3656 7.47855 74.3193 7.7095H69.1336C69.2262 9.23379 70.1522 10.019 71.4949 10.019C72.3284 10.019 73.0692 9.6495 73.4859 9.04903L74.5508 9.88045C73.8563 10.7581 72.7914 11.3124 71.4949 11.3124ZM69.1799 6.64712H72.9766C72.9303 5.7695 72.2821 4.98426 71.2171 4.98426C70.1059 4.93807 69.3651 5.53855 69.1799 6.64712Z"
            fill="#000091"
          ></path>
          <path
            d="M80.9403 4.01428H82.3756V7.94047C82.3756 10.019 81.1718 11.3124 79.1808 11.3124C77.1899 11.3124 75.9861 10.0652 75.9861 7.94047V4.01428H77.4214V8.03286C77.4214 9.23381 78.0696 9.97286 79.1808 9.97286C80.2458 9.97286 80.894 9.23381 80.894 8.03286V4.01428H80.9403Z"
            fill="#000091"
          ></path>
          <path
            d="M84.5518 4.0143H85.9871V4.79954C86.4964 4.24526 87.0983 3.87573 87.9317 3.87573C88.1632 3.87573 88.3484 3.92192 88.5336 3.96811V5.35383C88.3021 5.30764 88.0706 5.26145 87.7928 5.26145C86.9131 5.26145 86.3112 5.72335 85.9408 6.32383V10.9891H84.5055V4.0143H84.5518Z"
            fill="#000091"
          ></path>
          <path
            d="M0.979004 19.719H2.41432V20.4581C3.01623 19.8114 3.75705 19.4419 4.77566 19.4419C6.9981 19.4419 8.34082 21.1971 8.34082 23.2295C8.34082 25.2619 6.9518 27.0171 4.77566 27.0171C3.75705 27.0171 3.01623 26.6476 2.41432 26.0009V30.1581H0.979004V19.719ZM2.41432 21.9824V24.4767C2.92363 25.2619 3.71075 25.6776 4.59046 25.6776C5.93319 25.6776 6.8592 24.6152 6.8592 23.2295C6.8592 21.8438 5.93319 20.7814 4.59046 20.7814C3.66445 20.7814 2.92363 21.2433 2.41432 21.9824Z"
            fill="#000091"
          ></path>
          <path
            d="M17.3232 23.2295C17.3232 25.3081 15.7952 27.0171 13.5265 27.0171C11.2578 27.0171 9.72986 25.3081 9.72986 23.2295C9.72986 21.1509 11.2578 19.4419 13.5265 19.4419C15.7489 19.4419 17.3232 21.1509 17.3232 23.2295ZM15.7952 23.2295C15.7952 21.8438 14.8229 20.7814 13.4802 20.7814C12.1375 20.7814 11.1652 21.8438 11.1652 23.2295C11.1652 24.569 12.1375 25.6776 13.4802 25.6776C14.8229 25.6776 15.7952 24.569 15.7952 23.2295Z"
            fill="#000091"
          ></path>
          <path
            d="M23.8516 19.7191H25.2869V23.6452C25.2869 25.7238 24.0831 27.0172 22.0921 27.0172C20.1012 27.0172 18.8974 25.77 18.8974 23.6452V19.7191H20.3327V23.7376C20.3327 24.9386 20.9809 25.6776 22.0921 25.6776C23.1571 25.6776 23.8053 24.9386 23.8053 23.7376V19.7191H23.8516Z"
            fill="#000091"
          ></path>
          <path
            d="M27.5093 19.7191H28.9446V20.5043C29.4539 19.95 30.0559 19.5805 30.8893 19.5805C31.1208 19.5805 31.306 19.6267 31.4912 19.6729V21.0586C31.2597 21.0124 31.0282 20.9662 30.7504 20.9662C29.8707 20.9662 29.2687 21.4281 28.8983 22.0286V26.6938H27.463V19.7191H27.5093Z"
            fill="#000091"
          ></path>
          <path d="M36.8621 16.301H38.2974V26.74H36.8621V16.301Z" fill="#000091"></path>
          <path
            d="M43.9461 27.0171C41.5384 27.0171 40.1031 25.2619 40.1031 23.2295C40.1031 21.1509 41.4458 19.4419 43.6682 19.4419C45.6129 19.4419 46.863 20.7352 46.863 22.5367C46.863 22.86 46.8167 23.1833 46.7704 23.4143H41.5847C41.6773 24.9386 42.6033 25.7238 43.9461 25.7238C44.7795 25.7238 45.5203 25.3543 45.937 24.7538L47.0019 25.5852C46.3074 26.4628 45.2425 27.0171 43.9461 27.0171ZM41.631 22.3519H45.4277C45.3814 21.4743 44.7332 20.689 43.6682 20.689C42.557 20.6428 41.8625 21.2433 41.631 22.3519Z"
            fill="#000091"
          ></path>
          <path
            d="M52.4654 19.719H53.9007V20.4119C54.41 19.8576 55.1045 19.4419 56.1231 19.4419C57.6511 19.4419 58.8549 20.5043 58.8549 22.5367V26.74H57.4196V22.5828C57.4196 21.4743 56.8177 20.7814 55.7991 20.7814C54.8267 20.7814 54.2711 21.3819 53.9007 21.9824V26.6938H52.4654V19.719Z"
            fill="#000091"
          ></path>
          <path
            d="M65.8925 19.7191H67.3279V23.6452C67.3279 25.7238 66.124 27.0172 64.1331 27.0172C62.1422 27.0172 60.9384 25.77 60.9384 23.6452V19.7191H62.3737V23.7376C62.3737 24.9386 63.0219 25.6776 64.1331 25.6776C65.198 25.6776 65.8462 24.9386 65.8462 23.7376V19.7191H65.8925Z"
            fill="#000091"
          ></path>
          <path
            d="M69.504 19.719H70.9394V20.3657C71.4487 19.8114 72.0969 19.4419 73.0229 19.4419C73.9952 19.4419 74.7823 19.8576 75.2453 20.689C75.8009 19.9962 76.4954 19.4419 77.6993 19.4419C79.1809 19.4419 80.2921 20.4581 80.2921 22.3981V26.74H78.8568V22.4443C78.8568 21.4281 78.3012 20.7814 77.3752 20.7814C76.5417 20.7814 75.9861 21.2895 75.6157 21.9824C75.6157 22.1209 75.6157 22.2133 75.6157 22.3519V26.6938H74.1804V22.3981C74.1804 21.3819 73.6248 20.7352 72.6988 20.7352C71.8191 20.7352 71.2635 21.3357 70.9394 21.9362V26.6476H69.504V19.719Z"
            fill="#000091"
          ></path>
          <path
            d="M85.8482 27.0172C83.4405 27.0172 82.0052 25.2619 82.0052 23.2295C82.0052 21.151 83.3479 19.4419 85.5703 19.4419C87.515 19.4419 88.7651 20.7352 88.7651 22.5367C88.7651 22.86 88.7188 23.1833 88.6725 23.4143H83.4868C83.5794 24.9386 84.5054 25.7238 85.8482 25.7238C86.6816 25.7238 87.4224 25.3543 87.8391 24.7538L88.904 25.5852C88.2095 26.4629 87.1446 27.0172 85.8482 27.0172ZM83.5331 22.3519H87.3298C87.2835 21.4743 86.6353 20.6891 85.5703 20.6891C84.5054 20.6429 83.7646 21.2433 83.5331 22.3519ZM84.9221 18.6105L86.3575 16.301H87.9317L86.2649 18.6105H84.9221Z"
            fill="#000091"
          ></path>
          <path
            d="M90.6172 19.7191H92.0525V20.5043C92.5618 19.95 93.1637 19.5805 93.9971 19.5805C94.2286 19.5805 94.4138 19.6267 94.599 19.6729V21.0586C94.3675 21.0124 94.136 20.9662 93.8582 20.9662C92.9785 20.9662 92.3766 21.4281 92.0062 22.0286V26.6938H90.5709V19.7191H90.6172Z"
            fill="#000091"
          ></path>
          <path
            d="M95.988 17.1786C95.988 16.6705 96.451 16.2086 96.9604 16.2086C97.4697 16.2086 97.9327 16.6705 97.9327 17.1786C97.9327 17.6867 97.4697 18.1486 96.9604 18.1486C96.4047 18.1947 95.988 17.7328 95.988 17.1786ZM96.2195 19.719H97.6549V26.74H96.2195V19.719Z"
            fill="#000091"
          ></path>
          <path
            d="M103.026 19.4419C104.044 19.4419 104.785 19.8114 105.387 20.4581V19.719H106.869V30.1581H105.387V26.0009C104.785 26.6476 104.044 27.0171 103.026 27.0171C100.803 27.0171 99.4606 25.2619 99.4606 23.2295C99.4606 21.1971 100.803 19.4419 103.026 19.4419ZM103.211 25.6776C104.137 25.6776 104.924 25.2619 105.387 24.5228V21.9824C104.878 21.1971 104.091 20.8276 103.211 20.8276C101.868 20.8276 100.942 21.89 100.942 23.2757C100.942 24.6614 101.868 25.6776 103.211 25.6776Z"
            fill="#000091"
          ></path>
          <path
            d="M113.953 19.7191H115.388V23.6452C115.388 25.7238 114.184 27.0172 112.193 27.0172C110.202 27.0172 108.999 25.77 108.999 23.6452V19.7191H110.434V23.7376C110.434 24.9386 111.082 25.6776 112.193 25.6776C113.258 25.6776 113.906 24.9386 113.906 23.7376V19.7191H113.953Z"
            fill="#000091"
          ></path>
          <path
            d="M120.898 27.0171C118.49 27.0171 117.055 25.2619 117.055 23.2295C117.055 21.1509 118.398 19.4419 120.62 19.4419C122.565 19.4419 123.815 20.7352 123.815 22.5367C123.815 22.86 123.769 23.1833 123.722 23.4143H118.537C118.629 24.9386 119.555 25.7238 120.898 25.7238C121.731 25.7238 122.472 25.3543 122.889 24.7538L123.954 25.5852C123.259 26.4628 122.194 27.0171 120.898 27.0171ZM118.583 22.3519H122.38C122.333 21.4743 121.685 20.689 120.62 20.689C119.509 20.6428 118.814 21.2433 118.583 22.3519Z"
            fill="#000091"
          ></path>
          <path
            d="M0.377075 42.5833C0.377075 41.4286 1.25679 40.6895 2.87731 40.4124L5.51646 39.9505L5.60906 39.3962C5.84057 38.1952 5.19236 37.5947 4.08114 37.5947C3.24772 37.5947 2.46061 38.0105 1.8587 38.6571L1.25679 38.149C1.9513 37.3638 2.92362 36.8095 4.12744 36.8095C5.84057 36.8095 6.76658 37.8719 6.44248 39.4886L5.60906 44.1076H4.82195L5.00715 43.1838C4.35894 43.9228 3.57183 44.2924 2.55321 44.2924C1.21049 44.2924 0.377075 43.6457 0.377075 42.5833ZM2.59951 43.5995C3.66443 43.5995 4.45154 43.0914 5.09975 42.26L5.37756 40.5971L3.01622 41.0128C1.8124 41.1976 1.21049 41.7057 1.21049 42.4909C1.21049 43.1376 1.7198 43.5995 2.59951 43.5995Z"
            fill="#000091"
          ></path>
          <path
            d="M9.31311 37.0867H10.1465L10.0076 37.9643C10.7021 37.2252 11.4429 36.8095 12.369 36.8095C13.4339 36.8095 14.2673 37.3176 14.4988 38.3338C15.2859 37.3638 16.1656 36.8095 17.1842 36.8095C18.7122 36.8095 19.6845 37.8719 19.3141 39.7657L18.5269 44.1076H17.7398L18.4807 39.8119C18.7585 38.38 18.1102 37.5947 16.999 37.5947C16.073 37.5947 15.2396 38.149 14.5451 39.1652C14.5451 39.35 14.4988 39.5809 14.4525 39.7657L13.6654 44.1076H12.832L13.6191 39.8119C13.8506 38.38 13.2024 37.5947 12.0912 37.5947C11.1651 37.5947 10.378 38.1028 9.72981 39.0267L8.8501 44.1076H8.06299L9.31311 37.0867Z"
            fill="#000091"
          ></path>
          <path
            d="M24.7313 44.3848C23.5738 44.3848 22.6478 43.8767 22.0922 43.0452L21.907 44.1076H21.0735L22.9256 33.6686H23.7127L22.9719 37.8257C23.6664 37.1329 24.5461 36.8095 25.4258 36.8095C27.4631 36.8095 28.6669 38.1952 28.6669 40.0891C28.7132 42.4448 27.0926 44.3848 24.7313 44.3848ZM22.7867 38.9343L22.2311 42.0291C22.6941 42.9991 23.5275 43.5995 24.685 43.5995C26.4907 43.5995 27.7872 42.0752 27.7872 40.0891C27.7872 38.6572 26.8611 37.5948 25.2869 37.5948C24.3609 37.5948 23.4349 38.0105 22.7867 38.9343Z"
            fill="#000091"
          ></path>
          <path
            d="M29.778 42.5833C29.778 41.4286 30.6577 40.6895 32.2783 40.4124L34.9174 39.9505L35.01 39.3962C35.2415 38.1952 34.5933 37.5947 33.4821 37.5947C32.6487 37.5947 31.8615 38.0105 31.2596 38.6571L30.6577 38.149C31.3522 37.3638 32.3246 36.8095 33.5284 36.8095C35.2415 36.8095 36.1675 37.8719 35.8434 39.4886L35.01 44.1076H34.1766L34.3618 43.1838C33.7136 43.9228 32.9265 44.2924 31.9079 44.2924C30.6577 44.2924 29.778 43.6457 29.778 42.5833ZM32.0468 43.5995C33.1117 43.5995 33.8988 43.0914 34.547 42.26L34.8248 40.5971L32.4635 41.0128C31.2596 41.1976 30.6577 41.7057 30.6577 42.4909C30.6577 43.1376 31.167 43.5995 32.0468 43.5995Z"
            fill="#000091"
          ></path>
          <path
            d="M41.6773 42.26C41.6773 43.3686 40.7513 44.3848 39.3623 44.3848C38.3437 44.3848 37.4176 43.9228 36.9083 43.0452L37.5565 42.5833C38.0195 43.3224 38.6678 43.6457 39.4086 43.6457C40.2883 43.6457 40.8902 43.0452 40.8902 42.26C40.8902 40.6895 38.0658 40.8743 38.0658 38.7957C38.0658 37.6871 39.0382 36.8095 40.3346 36.8095C41.3069 36.8095 42.094 37.3638 42.4644 38.0567L41.8162 38.4724C41.5384 37.8719 41.0291 37.5024 40.3346 37.5024C39.5012 37.5024 38.8993 38.1028 38.8993 38.7495C38.853 40.3662 41.6773 40.1814 41.6773 42.26Z"
            fill="#000091"
          ></path>
          <path
            d="M47.5112 42.26C47.5112 43.3686 46.5852 44.3848 45.1962 44.3848C44.1776 44.3848 43.2516 43.9228 42.7422 43.0452L43.3905 42.5833C43.8535 43.3224 44.5017 43.6457 45.2425 43.6457C46.1222 43.6457 46.7241 43.0452 46.7241 42.26C46.7241 40.6895 43.8998 40.8743 43.8998 38.7957C43.8998 37.6871 44.8721 36.8095 46.1685 36.8095C47.1408 36.8095 47.9279 37.3638 48.2983 38.0567L47.6501 38.4724C47.3723 37.8719 46.863 37.5024 46.1685 37.5024C45.3351 37.5024 44.7332 38.1028 44.7332 38.7495C44.6869 40.3662 47.5112 40.1814 47.5112 42.26Z"
            fill="#000091"
          ></path>
          <path
            d="M49.0392 42.5833C49.0392 41.4286 49.9189 40.6895 51.5394 40.4124L54.1786 39.9505L54.2712 39.3962C54.5027 38.1952 53.8545 37.5947 52.7432 37.5947C51.9098 37.5947 51.1227 38.0105 50.5208 38.6571L49.9189 38.149C50.6134 37.3638 51.5857 36.8095 52.7895 36.8095C54.5027 36.8095 55.4287 37.8719 55.1046 39.4886L54.2712 44.1076H53.4841L53.6693 43.1838C53.0211 43.9228 52.2339 44.2924 51.2153 44.2924C49.9189 44.2924 49.0392 43.6457 49.0392 42.5833ZM51.2616 43.5995C52.3265 43.5995 53.1136 43.0914 53.7619 42.26L54.0397 40.5971L51.6783 41.0128C50.4745 41.1976 49.8726 41.7057 49.8726 42.4909C49.9189 43.1376 50.4282 43.5995 51.2616 43.5995Z"
            fill="#000091"
          ></path>
          <path
            d="M60.6606 36.8095C61.8182 36.8095 62.7905 37.3176 63.3461 38.1952L64.1332 33.6686H64.9203L63.0683 44.1076H62.2349L62.3738 43.3224C61.6792 44.0153 60.7995 44.3848 59.8735 44.3848C57.8363 44.3848 56.6788 42.9991 56.6788 41.1052C56.6788 38.7495 58.3456 36.8095 60.6606 36.8095ZM60.0587 43.5995C60.9847 43.5995 61.9107 43.1838 62.559 42.3062L63.1146 39.2114C62.6979 38.2414 61.8182 37.5948 60.6606 37.5948C58.8549 37.5948 57.5122 39.1191 57.5122 41.1052C57.5585 42.5372 58.5308 43.5995 60.0587 43.5995Z"
            fill="#000091"
          ></path>
          <path
            d="M73.0692 40.1814C73.0692 42.3986 71.356 44.431 68.9484 44.431C66.8649 44.431 65.6147 42.9529 65.6147 41.1053C65.6147 38.8881 67.3279 36.8557 69.7818 36.8557C71.8653 36.8095 73.0692 38.2876 73.0692 40.1814ZM72.2358 40.1353C72.2358 38.7495 71.3097 37.5948 69.7818 37.5948C67.8835 37.5948 66.5408 39.2114 66.5408 41.0591C66.5408 42.4448 67.4668 43.5995 68.9947 43.5995C70.8467 43.5995 72.2358 41.9829 72.2358 40.1353Z"
            fill="#000091"
          ></path>
          <path
            d="M75.6621 37.0866H76.4955L76.3103 38.149C76.9585 37.41 77.6067 36.9481 78.5327 36.9481C78.7642 36.9481 78.9957 36.9481 79.1809 37.0404L79.042 37.8257C78.8568 37.7795 78.6716 37.7333 78.4401 37.7333C77.5141 37.7333 76.8196 38.2414 76.1714 39.1652L75.2917 44.1076H74.4583L75.6621 37.0866Z"
            fill="#000091"
          ></path>
          <path
            d="M2.1365 52.7915L2.3217 51.7753C2.5995 50.1124 3.61812 49.3734 4.82194 49.3734C5.51645 49.3734 6.02576 49.6043 6.34986 49.8353L5.88685 50.4819C5.60905 50.251 5.23865 50.1124 4.82194 50.1124C4.03483 50.1124 3.34032 50.6205 3.15511 51.7753L2.96991 52.7915H5.51645L5.37755 53.5305H2.83101L1.71979 59.8124H0.886379L1.99759 53.5305H0.701172L0.840076 52.7915H2.1365Z"
            fill="#000091"
          ></path>
          <path
            d="M12.6004 55.8862C12.6004 58.1033 10.8873 60.1357 8.47965 60.1357C6.39611 60.1357 5.146 58.6576 5.146 56.81C5.146 54.5928 6.85912 52.5604 9.31306 52.5604C11.3966 52.5143 12.6004 53.9923 12.6004 55.8862ZM11.767 55.84C11.767 54.4542 10.841 53.2995 9.31306 53.2995C7.41473 53.2995 6.07201 54.9162 6.07201 56.7638C6.07201 58.1495 6.99803 59.3042 8.52595 59.3042C10.378 59.3042 11.767 57.6876 11.767 55.84Z"
            fill="#000091"
          ></path>
          <path
            d="M15.1933 52.7914H16.0267L15.8415 53.8538C16.4897 53.1147 17.138 52.6528 18.064 52.6528C18.2955 52.6528 18.527 52.6528 18.7122 52.7452L18.5733 53.5304C18.3881 53.4843 18.2029 53.4381 17.9714 53.4381C17.0454 53.4381 16.3508 53.9462 15.7026 54.87L14.8229 59.8124H13.9895L15.1933 52.7914Z"
            fill="#000091"
          ></path>
          <path
            d="M26.8611 52.5143C28.0186 52.5143 28.991 53.0224 29.5466 53.9L30.3337 49.3734H31.1208L29.2688 59.8124H28.4354L28.5743 59.0272C27.8797 59.72 27 60.0895 26.074 60.0895C24.0368 60.0895 22.8793 58.7038 22.8793 56.81C22.9256 54.4543 24.5461 52.5143 26.8611 52.5143ZM26.3055 59.3043C27.2315 59.3043 28.1575 58.8886 28.8058 58.011L29.3614 54.9162C28.9447 53.9462 28.0649 53.2995 26.9074 53.2995C25.1017 53.2995 23.759 54.8238 23.759 56.81C23.8053 58.2419 24.7313 59.3043 26.3055 59.3043Z"
            fill="#000091"
          ></path>
          <path
            d="M33.158 52.7915H33.9914L32.7413 59.8124H31.9542L33.158 52.7915ZM33.4821 49.9738C33.4821 49.6505 33.7599 49.3734 34.1303 49.3734C34.5007 49.3734 34.7785 49.6505 34.7785 49.9738C34.7785 50.3434 34.5007 50.6205 34.1303 50.6205C33.7599 50.5743 33.4821 50.3434 33.4821 49.9738Z"
            fill="#000091"
          ></path>
          <path
            d="M35.7971 59.2581C35.5193 59.0733 35.3804 58.75 35.3804 58.4267C35.3804 57.78 35.8897 57.2719 36.5842 56.9486C36.1212 56.5329 35.8434 55.9324 35.8434 55.2857C35.8434 53.9 36.862 52.5605 38.7604 52.5605C39.2234 52.5605 39.6401 52.6529 40.0105 52.8376H42.6959L42.557 53.5767H40.7513C40.9828 53.9462 41.1217 54.3619 41.1217 54.7776C41.1217 56.1633 40.0568 57.5491 38.2511 57.5491C37.8343 57.5491 37.4176 57.4567 37.0935 57.3181C36.4916 57.5952 36.1675 57.9648 36.1675 58.3343C36.1675 58.6114 36.3064 58.7962 36.7231 58.7962H38.6678C40.3809 58.7962 41.1217 59.6276 41.1217 60.7362C41.1217 62.1681 39.779 63.3691 37.4176 63.3691C35.2878 63.3691 34.3155 62.5838 34.3155 61.4291C34.3155 60.5052 34.8711 59.7662 35.7971 59.2581ZM37.4176 62.5838C39.316 62.5838 40.242 61.7986 40.242 60.7362C40.242 60.0895 39.8716 59.5352 38.6215 59.5352H36.5379C35.6119 59.951 35.1489 60.69 35.1489 61.2443C35.1952 62.0295 35.8434 62.5838 37.4176 62.5838ZM38.7141 53.2071C37.325 53.2071 36.6305 54.2233 36.6305 55.2395C36.6305 56.071 37.1861 56.81 38.2048 56.81C39.5475 56.81 40.2883 55.7938 40.2883 54.7776C40.2883 53.9 39.7327 53.2071 38.7141 53.2071Z"
            fill="#000091"
          ></path>
          <path
            d="M44.0387 52.7915H44.8721L43.622 59.8124H42.8349L44.0387 52.7915ZM44.3165 49.9738C44.3165 49.6505 44.5943 49.3734 44.9647 49.3734C45.3351 49.3734 45.613 49.6505 45.613 49.9738C45.613 50.3434 45.3351 50.6205 44.9647 50.6205C44.5943 50.5743 44.3165 50.3434 44.3165 49.9738Z"
            fill="#000091"
          ></path>
          <path
            d="M47.789 53.5305H46.4926L46.6315 52.7914H47.9279L48.252 51.0362H49.0855L48.7613 52.7914H51.3079L51.169 53.5305H48.6224L47.9279 57.5029C47.6964 58.8886 48.252 59.1657 49.1317 59.1657C49.5485 59.1657 49.8726 59.0733 50.1967 58.9809L50.0578 59.72C49.7337 59.8586 49.4096 59.9048 48.9928 59.9048C47.6038 59.9048 46.7704 59.2581 47.0945 57.4105L47.789 53.5305Z"
            fill="#000091"
          ></path>
          <path
            d="M51.7709 58.2881C51.7709 57.1333 52.6506 56.3943 54.2711 56.1171L56.9103 55.6552L57.0029 55.1009C57.2344 53.9 56.5862 53.2995 55.4749 53.2995C54.6415 53.2995 53.8544 53.7152 53.2525 54.3619L52.6506 53.8538C53.3451 53.0686 54.3174 52.5143 55.5212 52.5143C57.2344 52.5143 58.1604 53.5767 57.8363 55.1933L57.0029 59.8124H56.2158L56.401 58.8886C55.7527 59.6276 54.9656 59.9971 53.947 59.9971C52.6043 59.9971 51.7709 59.3505 51.7709 58.2881ZM53.9933 59.3043C55.0582 59.3043 55.8453 58.7962 56.4936 57.9648L56.7714 56.3019L54.41 56.7176C53.2062 56.9024 52.6043 57.4105 52.6043 58.1957C52.6043 58.8424 53.1136 59.3043 53.9933 59.3043Z"
            fill="#000091"
          ></path>
          <path
            d="M61.3088 49.3734H62.0959L60.2439 59.8124H59.4568L61.3088 49.3734Z"
            fill="#000091"
          ></path>
          <path
            d="M66.5871 58.2881C66.5871 57.1333 67.4668 56.3943 69.0873 56.1171L71.7265 55.6552L71.8191 55.1009C72.0506 53.9 71.4024 53.2995 70.2911 53.2995C69.4577 53.2995 68.6706 53.7152 68.0687 54.3619L67.4668 53.8538C68.1613 53.0686 69.1336 52.5143 70.3375 52.5143C72.0506 52.5143 72.9766 53.5767 72.6525 55.1933L71.8191 59.8124H71.032L71.2172 58.8886C70.569 59.6276 69.7818 59.9971 68.7632 59.9971C67.4205 59.9971 66.5871 59.3505 66.5871 58.2881ZM68.8095 59.3043C69.8744 59.3043 70.6616 58.7962 71.3098 57.9648L71.5876 56.3019L69.2262 56.7176C68.0224 56.9024 67.4205 57.4105 67.4205 58.1957C67.4205 58.8424 67.9298 59.3043 68.8095 59.3043Z"
            fill="#000091"
          ></path>
          <path
            d="M75.8936 52.7915L76.0788 51.7753C76.3566 50.1124 77.3752 49.3734 78.579 49.3734C79.2735 49.3734 79.7828 49.6043 80.1069 49.8353L79.6439 50.4819C79.3661 50.251 78.9957 50.1124 78.579 50.1124C77.7919 50.1124 77.0974 50.6205 76.9122 51.7753L76.727 52.7915H79.2735L79.1346 53.5305H76.5881L75.4769 59.8124H74.6435L75.7547 53.5305H74.4583L74.5971 52.7915H75.8936Z"
            fill="#000091"
          ></path>
          <path
            d="M81.2644 52.7915L81.4496 51.7753C81.7274 50.1124 82.746 49.3734 83.9499 49.3734C84.6444 49.3734 85.1537 49.6043 85.4778 49.8353L85.0148 50.4819C84.737 50.251 84.3666 50.1124 83.9499 50.1124C83.1628 50.1124 82.4682 50.6205 82.283 51.7753L82.0978 52.7915H84.6444L84.5055 53.5305H81.9589L80.8477 59.8124H80.0143L81.1255 53.5305H79.8291L79.968 52.7915H81.2644Z"
            fill="#000091"
          ></path>
          <path
            d="M84.274 58.2881C84.274 57.1333 85.1538 56.3943 86.7743 56.1171L89.4134 55.6552L89.506 55.1009C89.7375 53.9 89.0893 53.2995 87.9781 53.2995C87.1447 53.2995 86.3576 53.7152 85.7557 54.3619L85.1538 53.8538C85.8483 53.0686 86.8206 52.5143 88.0244 52.5143C89.7375 52.5143 90.6635 53.5767 90.3394 55.1933L89.506 59.8124H88.7189L88.9041 58.8886C88.2559 59.6276 87.4688 59.9971 86.4502 59.9971C85.1075 59.9971 84.274 59.3505 84.274 58.2881ZM86.4965 59.3043C87.5614 59.3043 88.3485 58.7962 88.9967 57.9648L89.2745 56.3019L86.9132 56.7176C85.7094 56.9024 85.1075 57.4105 85.1075 58.1957C85.1075 58.8424 85.6168 59.3043 86.4965 59.3043Z"
            fill="#000091"
          ></path>
          <path
            d="M93.21 52.7915H94.0434L92.7933 59.8124H92.0062L93.21 52.7915ZM93.4878 49.9738C93.4878 49.6505 93.7656 49.3734 94.1361 49.3734C94.5065 49.3734 94.7843 49.6505 94.7843 49.9738C94.7843 50.3434 94.5065 50.6205 94.1361 50.6205C93.7656 50.5743 93.4878 50.3434 93.4878 49.9738Z"
            fill="#000091"
          ></path>
          <path
            d="M96.7288 52.7914H97.5623L97.3771 53.8538C98.0253 53.1147 98.6735 52.6528 99.5995 52.6528C99.831 52.6528 100.063 52.6528 100.248 52.7452L100.109 53.5304C99.9236 53.4843 99.7384 53.4381 99.5069 53.4381C98.5809 53.4381 97.8864 53.9462 97.2382 54.87L96.3584 59.8124H95.525L96.7288 52.7914Z"
            fill="#000091"
          ></path>
          <path
            d="M104.97 57.9648C104.97 59.0733 104.044 60.0895 102.655 60.0895C101.637 60.0895 100.711 59.6276 100.201 58.75L100.85 58.2881C101.313 59.0271 101.961 59.3505 102.702 59.3505C103.581 59.3505 104.183 58.75 104.183 57.9648C104.183 56.3943 101.359 56.579 101.359 54.5005C101.359 53.3919 102.331 52.5143 103.628 52.5143C104.6 52.5143 105.387 53.0686 105.758 53.7614L105.109 54.1771C104.831 53.5767 104.322 53.2071 103.628 53.2071C102.794 53.2071 102.192 53.8076 102.192 54.4543C102.1 56.0709 104.97 55.8862 104.97 57.9648Z"
            fill="#000091"
          ></path>
        </svg>
      </HeaderOperator>
      <Service
        title="Information Manipulation Analyzer"
        description="Volumetry. Artificial boost probability. Most active users. Related hashtags."
      />
    </HeaderBody>
    <HeaderNav>
      <NavItem title="Twitter" current>
        <NavSubItem
          title="Explore narratives"
          link={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/`}
        />
        <NavSubItem
          title="Create a network of interactions graph"
          link={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/network-of-interactions-graph`}
        />
        <NavSubItem
          title="What is a bot?"
          link={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/bot-probability`}
        />
        <NavSubItem
          title="How do we generate an interaction graph?"
          link={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/graph-methodology`}
        />
      </NavItem>
    </HeaderNav>
  </DSFRHeader>
);

export default Header;
