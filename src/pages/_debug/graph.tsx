import React from 'react';
import dynamic from 'next/dynamic';
const NetworkGraph = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph'), {
  ssr: false,
});
import { useToggle } from 'react-use';
import dayjs from 'dayjs';

const hashtag = 'ok';
const path = String(process.env.NEXT_PUBLIC_BASE_PATH) + '/test.json';
const path2 = String(process.env.NEXT_PUBLIC_BASE_PATH) + '/test2.json';

const NetworkGraphDebugPage = () => {
  const startDate = '2021-11-21T07:13:46+00:00';
  const endDate = '2021-11-21T23:46:24+00:00';

  const [date, setDate] = React.useState<string>();
  const [active, toggleActive] = useToggle(false);

  React.useEffect(() => {
    let interval: NodeJS.Timer;

    if (active) {
      interval = setInterval(() => {
        setDate((currentDate) => {
          const newDate = dayjs(currentDate || startDate)
            .add(1, 'hour')
            .format();
          if (newDate > endDate) {
            clearInterval(interval);
          }
          return newDate;
        });
      }, 1000);

      // if (isActive) {
      //   interval = setInterval(() => {
      //     setSeconds((seconds) => seconds + 1);
      //   }, 1000);
      // } else if (!isActive && seconds !== 0) {
      //   clearInterval(interval);
      // }
    }
    return () => clearInterval(interval);
  }, [active]);

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
        <small>({dayjs(date).format()})</small>
      </h1>
      <button onClick={toggleActive}>{active ? 'Pause' : 'Play'}</button>
      {/* <div style={{ border: '1px solid red' }}>
        <NetworkGraph
          url={path}
          onClickNode={onClickNode}
          startDate={startDate}
          endDate={date || endDate}
        />
      </div> */}
      <div style={{ border: '1px solid red' }}>
        <NetworkGraph
          url={path2}
          onClickNode={onClickNode}
          startDate={startDate}
          endDate={date || endDate}
        />
      </div>
    </>
  );
};

export default NetworkGraphDebugPage;
