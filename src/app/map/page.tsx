import dynamic from 'next/dynamic';

const DMVS = dynamic(() => import('./DMVSopt'), {
  ssr: false,
});

export default function Page() {
  return <DMVS />;
}
