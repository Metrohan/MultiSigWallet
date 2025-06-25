import { connectWallet, userSession } from '../utils/walletConnect';

const ConnectWalletButton = () => {
  const isSignedIn = userSession.isUserSignedIn();
  const userData = isSignedIn ? userSession.loadUserData() : null;

  return (
    <div className="flex justify-end items-center p-4">
      {isSignedIn ? (
        <div className="text-sm text-green-600 font-medium">
          Connected: {userData?.profile?.stxAddress?.testnet}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWalletButton;
