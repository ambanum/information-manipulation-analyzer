import dynamic from 'next/dynamic';
const NetworkGraph = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph'), {
  ssr: false,
});

const hashtag = 'ok';
const url = 'https://raw.githubusercontent.com/dunnock/react-sigma/master/public/upwork.json';
const path = String(process.env.NEXT_PUBLIC_BASE_PATH) + '/EcritureInclusiveFinal.json';

const NetworkGraphDebugPage = () => {
  const onClickNode = (event) => {
    console.log(''); //eslint-disable-line
    console.log('╔════START══event══════════════════════════════════════════════════'); //eslint-disable-line
    console.log(hashtag); //eslint-disable-line
    console.log(event); //eslint-disable-line
    console.log('╚════END════event══════════════════════════════════════════════════'); //eslint-disable-line
  };

  return (
    <>
      <h1>From Path {path}</h1>
      <NetworkGraph path={path} onClickNode={onClickNode} />
      <h1>From url {url}</h1>
      <NetworkGraph url={url} onClickNode={onClickNode} />
    </>
  );
};

export default NetworkGraphDebugPage;
