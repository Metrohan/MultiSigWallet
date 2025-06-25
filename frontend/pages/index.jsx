// pages/index.jsx
import dynamic from 'next/dynamic';

const Wallet = dynamic(() => import('../src/components/MultiSigWallet'), { ssr: false });

export default function Home() {
  return (
    <div>
      <h1>Multi-Sig Wallet</h1>
      <Wallet />
    </div>
  );
}
