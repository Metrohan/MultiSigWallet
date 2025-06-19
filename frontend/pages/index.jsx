import { useState, useEffect } from "react";
import { showConnect } from "@stacks/connect";

export default function HomePage() {
  const [address, setAddress] = useState(null);

  async function connectWallet(){
    showConnect({ 
      onFinish: (payload) => setAddress(payload.authResponse.decodedProfile.stxAddress)
    });
  }

  return (
    <div className="p-10">
      <h1>Multi-Signature Wallet</h1>
      {address ? (
        <p>Adresiniz: {address}</p>
      ) : (
        <button onClick={connectWallet}>
          Cüzdan Bağla
        </button>
      )}

      {/* İşlevleri burada daha fazla oluşturabilir. 
      Örn: propose, confirm, transfer, vb.*/}
    </div>
  )
}

