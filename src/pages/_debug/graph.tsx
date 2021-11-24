import React from 'react';
import dynamic from 'next/dynamic';
const NetworkGraph = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph'), {
  ssr: false,
});
const NetworkGraph2D = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph2D'), {
  ssr: false,
});
const NetworkGraph3D = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph3D'), {
  ssr: false,
});
import { useToggle } from 'react-use';
import dayjs from 'dayjs';

const hashtag = 'ok';
const file = 'test2.json';

const path = String(process.env.NEXT_PUBLIC_BASE_PATH) + '/test.json';
const path2 = String(process.env.NEXT_PUBLIC_BASE_PATH) + `/${file}`;

import { nodes, edges } from '../../../public/test2.json';
console.log(''); //eslint-disable-line
console.log('╔════START══json══════════════════════════════════════════════════'); //eslint-disable-line
console.log(nodes); //eslint-disable-line
console.log('╚════END════json══════════════════════════════════════════════════'); //eslint-disable-line

const NetworkGraphDebugPage = () => {
  const startDate = nodes[0].metadata.date;

  const [tick, setTick] = React.useState<number>();
  const [active, toggleActive] = useToggle(false);

  React.useEffect(() => {
    let interval: NodeJS.Timer;

    if (active) {
      interval = setInterval(() => {
        setTick((currentTick) => {
          const newTick = currentTick !== undefined ? currentTick + 1 : 0;
          console.log(currentTick);
          console.log(newTick);

          if (newTick > nodes.length) {
            clearInterval(interval);
          }
          return newTick;
        });
        // setDate((currentDate) => {
        //   const newDate = dayjs(currentDate || startDate)
        //     .add(1, 'hour')
        //     .format();
        //   if (newDate > endDate) {
        //     clearInterval(interval);
        //   }
        //   return newDate;
        // });
      }, 200);

      // if (isActive) {
      //   interval = setInterval(() => {
      //     setSeconds((seconds) => seconds + 1);
      //   }, 1000);
      // } else if (!isActive && seconds !== 0) {
      //   clearInterval(interval);
      // }
    }
    return () => clearInterval(interval);
  }, [active, nodes.length]);

  const onClickNode = (event: any) => {
    console.log(''); //eslint-disable-line
    console.log('╔════START══event══════════════════════════════════════════════════'); //eslint-disable-line
    console.log(hashtag); //eslint-disable-line
    console.log(event); //eslint-disable-line
    console.log('╚════END════event══════════════════════════════════════════════════'); //eslint-disable-line
  };

  return (
    <>
      <h1>
        Testing {path2}
        <br />
        <small style={{ fontSize: '0.5em' }}>
          Fr ({dayjs(nodes[0].metadata.date[0]).format()})<br />
          To ({dayjs(nodes[tick || nodes.length - 1].metadata.date[0]).format()})
        </small>
      </h1>
      <button onClick={() => setTick((tick || 0) - 1)} disabled={active || (tick || 0) === 0}>
        Before
      </button>{' '}
      <button onClick={toggleActive}>{active ? 'Pause' : 'Play'}</button>{' '}
      <button
        onClick={() => setTick((tick || 0) + 1)}
        disabled={active || (tick || 0) === nodes.length}
      >
        After
      </button>
      {/* <div style={{ border: '1px solid red' }}>
        <NetworkGraph
          url={path}
          onClickNode={onClickNode}
          startDate={startDate}
          endDate={date || endDate}
        />
      </div> */}
      {/* <div style={{ border: '1px solid blue', height: '400px' }}>
        <NetworkGraph
          url={path2}
          onClickNode={onClickNode}
          startDate={startDate}
          endDate={nodes[tick || nodes.length - 1].metadata.date[0]}
        />
      </div>
       */}
      <NetworkGraph2D
        graph={{ nodes: nodes.map((node) => ({ ...node, color: '#678678' })), links: edges }}
      />
    </>
  );
};

export default NetworkGraphDebugPage;
