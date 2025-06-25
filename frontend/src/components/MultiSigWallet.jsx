// src/components/MultiSigWallet.jsx
import { useEffect, useState } from 'react';
import { showConnect } from '@stacks/connect';
import { userSession } from '../auth/userSession';
import {
  proposeTransaction,
  getProposals,
  confirmTransaction,
  initializeContract,
  isOwner
} from '../lib/contractCalls';

export default function MultiSigWallet() {
  const [walletAddress, setWalletAddress] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [proposals, setProposals] = useState([]);
  const [proposalIdToConfirm, setProposalIdToConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOwnerStatus, setIsOwnerStatus] = useState(false);
  const [threshold, setThreshold] = useState(2);
  const [owner1, setOwner1] = useState('');
  const [owner2, setOwner2] = useState('');
  const [owner3, setOwner3] = useState('');

  // Wallet bağlantısı kontrolü
  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const address = userSession.loadUserData().profile.stxAddress.testnet;
      setWalletAddress(address);
      checkOwnerStatus(address);
    }
  }, []);

  const checkOwnerStatus = async (address) => {
    try {
      const ownerStatus = await isOwner(address, address);
      setIsOwnerStatus(ownerStatus);
      console.log('Owner status for', address, ':', ownerStatus);
    } catch (error) {
      console.error('Error checking owner status:', error);
    }
  };

  const handleConnectWallet = () => {
    showConnect({
      appDetails: {
        name: 'MultiSig Wallet',
        icon: window.location.origin + '/wallet.png',
      },
      userSession,
      onFinish: () => {
        const address = userSession.loadUserData().profile.stxAddress.testnet;
        setWalletAddress(address);
        checkOwnerStatus(address);
      },
    });
  };

  const handleInitializeContract = async () => {
    if (!owner1 || !owner2 || !owner3) {
      alert('Lütfen 3 owner adresi girin.');
      return;
    }

    if (threshold < 1 || threshold > 3) {
      alert('Threshold 1-3 arasında olmalıdır.');
      return;
    }

    try {
      setLoading(true);
      await initializeContract(owner1, owner2, owner3, threshold);
      alert('Contract initialize edildi! İşlem tamamlandıktan sonra owner durumunuzu kontrol edin.');
    } catch (error) {
      console.error('Initialize error:', error);
      alert('Hata: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProposeTransaction = async () => {
    if (!recipient || !amount) {
      alert('Lütfen alıcı adresi ve miktarı girin.');
      return;
    }

    const microStxAmount = Math.floor(Number(amount) * 1_000_000);
    if (!Number.isInteger(microStxAmount) || microStxAmount <= 0) {
      alert('Lütfen pozitif bir STX miktarı girin.');
      return;
    }

    try {
      setLoading(true);
      console.log('Input amount:', amount, 'Number(amount):', Number(amount), 'STX Amount:', microStxAmount);
      await proposeTransaction(recipient, microStxAmount);
      
      // Başarılı olursa formu temizle
      setRecipient('');
      setAmount('');
      setDescription('');
      
      alert('İşlem önerisi başarıyla gönderildi!');
    } catch (error) {
      console.error('Propose transaction error:', error);
      alert('Hata: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetProposals = async () => {
    try {
      setLoading(true);
      const result = await getProposals(walletAddress);
      setProposals(result);
      console.log('Fetched proposals:', result);
    } catch (error) {
      console.error('Get proposals error:', error);
      alert('Önerileri getirirken hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmTransaction = async () => {
    if (!proposalIdToConfirm) {
      alert('Lütfen onaylamak istediğiniz proposal ID\'sini girin.');
      return;
    }

    try {
      setLoading(true);
      console.log('Confirming proposal ID:', proposalIdToConfirm);
      // Düzeltme: Sadece proposalId gönder, walletAddress değil
      await confirmTransaction(proposalIdToConfirm);
      
      // Başarılı olursa formu temizle
      setProposalIdToConfirm('');
      
      alert('İşlem onayı başarıyla gönderildi!');
      
      // Proposal listesini güncelle
      await handleGetProposals();
    } catch (error) {
      console.error('Confirm transaction error:', error);
      alert('Hata: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      {!walletAddress ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">MultiSig Wallet</h2>
          <button 
            onClick={handleConnectWallet}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Cüzdan Bağla
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-gray-100 p-3 rounded mb-4">
            <p><strong>Bağlı Cüzdan:</strong> {walletAddress}</p>
            <p><strong>Owner Status:</strong> {isOwnerStatus ? '✅ Owner' : '❌ Owner Değil'}</p>
            <button 
              onClick={() => checkOwnerStatus(walletAddress)}
              className="mt-2 bg-gray-500 text-white px-2 py-1 rounded text-sm"
            >
              Owner Durumunu Kontrol Et
            </button>
          </div>

          {!isOwnerStatus && (
            <div className="border border-yellow-400 bg-yellow-50 p-4 rounded mb-4">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ Contract Initialize</h3>
              <p className="text-yellow-700 mb-3">Contract henüz initialize edilmemiş veya siz owner değilsiniz.</p>
              
              <div className="space-y-2">
                <input
                  placeholder="Owner 1 Address"
                  value={owner1}
                  onChange={(e) => setOwner1(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  placeholder="Owner 2 Address"
                  value={owner2}
                  onChange={(e) => setOwner2(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  placeholder="Owner 3 Address"
                  value={owner3}
                  onChange={(e) => setOwner3(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  placeholder="Threshold (1-3)"
                  type="number"
                  min="1"
                  max="3"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full border p-2 rounded"
                />
                <button 
                  onClick={handleInitializeContract}
                  disabled={loading}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:bg-gray-400"
                >
                  {loading ? 'Initialize Ediliyor...' : 'Contract\'ı Initialize Et'}
                </button>
              </div>
            </div>
          )}

          {/* İşlem Önerme Bölümü - Sadece owner'lar için */}
          {isOwnerStatus && (
            <div className="space-y-2 mb-4">
              <h3 className="text-lg font-semibold">📝 İşlem Öner</h3>
              <input
                placeholder="Alıcı adresi (örn: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                placeholder="Miktar (STX)"
                type="number"
                step="0.000001"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                placeholder="Açıklama (opsiyonel)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <button 
                onClick={handleProposeTransaction}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                {loading ? 'Gönderiliyor...' : 'Öneriyi Gönder'}
              </button>
            </div>
          )}

          {/* İşlem Listesi Bölümü */}
          <div className="border p-4 rounded space-y-3">
            <h3 className="text-lg font-semibold">📃 İşlem Listesi</h3>
            <button 
              onClick={handleGetProposals}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Getiriliyor...' : 'İşlemleri Getir'}
            </button>
            
            {proposals.length > 0 ? (
              <div className="space-y-2">
                {proposals.map((p) => (
                  <div key={p.id} className="bg-gray-50 p-3 rounded border">
                    <div><strong>ID:</strong> {p.id}</div>
                    <div><strong>Alıcı:</strong> {p.recipient}</div>
                    <div><strong>Miktar:</strong> {p.amount} STX</div>
                    <div><strong>Onay Sayısı:</strong> {p.confirmationCount}</div>
                    <div><strong>Durum:</strong> {p.executed ? '✅ Gerçekleştirildi' : '⏳ Bekliyor'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Henüz işlem önerisi yok.</p>
            )}
          </div>

          {/* Onaylama Bölümü - Sadece owner'lar için */}
          {isOwnerStatus && (
          <div className="border p-4 rounded space-y-3">
            <h3 className="text-lg font-semibold">✅ İşlem Onayla</h3>
            <input
              placeholder="Proposal ID (örn: 1)"
              type="number"
              min="1"
              value={proposalIdToConfirm}
              onChange={(e) => setProposalIdToConfirm(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <button 
              onClick={handleConfirmTransaction}
              disabled={loading}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:bg-gray-400"
            >
              {loading ? 'Onaylanıyor...' : 'Onayla'}
            </button>
          </div>
          )}
        </div>
      )}
    </div>
  );
}