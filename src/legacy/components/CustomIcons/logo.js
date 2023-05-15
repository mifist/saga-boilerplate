import React from 'react';

export const BeeMedLogo = props => {
  return (
    <svg
      width="30px"
      height="38px"
      viewBox="0 0 30 38"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>SL/icons/naked-icon</title>
      <defs>
        <filter
          x="-0.8%"
          y="-19.4%"
          width="101.7%"
          height="138.7%"
          filterUnits="objectBoundingBox"
          id="filter-1"
        >
          <feOffset
            dx="0"
            dy="2"
            in="SourceAlpha"
            result="shadowOffsetOuter1"
          />
          <feGaussianBlur
            stdDeviation="2"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          />
          <feColorMatrix
            values="0 0 0 0 0.520578578   0 0 0 0 0.520578578   0 0 0 0 0.520578578  0 0 0 0.5 0"
            type="matrix"
            in="shadowBlurOuter1"
            result="shadowMatrixOuter1"
          />
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="filter-2">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0.796078 0 0 0 0 0.639216 0 0 0 0 0.282353 0 0 0 1.000000 0"
          />
        </filter>
      </defs>
      <g
        id="Symbols"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="web/navbar/top/parent/schoolink-(colorized---test)"
          transform="translate(-20.000000, -12.000000)"
        >
          <g id="mobile/navbar/top/parent/schoolink" filter="url(#filter-1)">
            <rect id="Rectangle" x="0" y="0" width="1440" height="62" />
          </g>
          <g
            id="Logo-BeeMed"
            transform="translate(15.000000, 12.000000)"
            fill="#cba348"
          >
            <g
              transform="translate(5.066667, 0.000000)"
              id="layer102"
              fill="#cba348"
              fillRule="nonzero"
            >
              <path
                d="M0.070126827,37.9277503 C0.0300543544,37.8963445 0,29.3434955 0,18.927235 L0,0 L11.450709,0.0209372069 L22.8914,0.0523430173 L25.7665999,5.28664475 C27.3494625,8.1655107 28.7519991,10.7303185 28.8922527,10.9920336 L29.1326876,11.4631208 L26.5279768,16.0693063 C25.0953859,18.6027083 23.9032299,20.7278348 23.8831936,20.7801779 C23.8631574,20.8429895 24.0334654,20.9476755 24.2638821,21.0209557 C25.946926,21.5757917 27.4095712,22.9471788 28.2611113,24.7687158 C29.8239377,28.1396061 29.252905,32.2642359 26.8185023,35.0174786 C25.2556758,36.7971411 23.5225414,37.645098 20.947885,37.8963445 C19.7657471,38.0114991 0.180326127,38.042905 0.070126827,37.9277503 Z M21.198338,34.8081065 C23.1218167,34.4626426 24.6145163,33.3320334 25.4259838,31.5942452 C25.6463824,31.1126895 25.8767992,30.4741047 25.9369079,30.1705152 C26.0971978,29.3853699 26.0771615,27.8883596 25.8968354,27.1869632 C25.436002,25.344489 24.0334654,23.7741984 22.2502404,23.0937392 C21.7192801,22.8843672 21.4187366,22.8738986 15.8887354,22.8215555 L10.0782268,22.7692125 L8.63561784,20.1520617 C7.8441865,18.717863 6.43163185,16.1635237 5.50996498,14.4780786 L3.82692113,11.431715 L6.08099771,7.41177125 C7.32324436,5.21336452 8.37514677,3.3185473 8.42523736,3.22432986 C8.51540042,3.04636361 8.35511053,3.035895 5.71032734,3.035895 L2.90525426,3.035895 L2.90525426,19.0005153 L2.90525426,34.9651355 L11.6109989,34.9651355 C18.9041889,34.9651355 20.4569972,34.9441983 21.198338,34.8081065 Z M23.3422153,15.786654 C24.5744438,13.5777787 25.6263462,11.6934301 25.6864549,11.5992126 C25.7665999,11.4631208 25.3157845,10.5628209 23.4824689,7.23380499 L21.1883199,3.035895 L16.5298949,3.05683221 L11.8814881,3.08823802 L9.54726659,7.22333638 C8.26494747,9.49502333 7.2330813,11.4107778 7.24302708,11.4735894 C7.25311753,11.536401 8.27496558,13.4312182 9.50719412,15.681968 L11.7512526,19.7856605 L16.4196956,19.7856605 L21.0981568,19.7856605 L23.3422153,15.786654 Z"
                id="Shape"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
