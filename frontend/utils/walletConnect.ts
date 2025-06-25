import {
  showConnect,
  UserSession,
  AppConfig,
} from '@stacks/connect';


const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const connectWallet = () => {
    if (!window.StacksProvider) {
        alert("Freighter cüzdan yüklü değil. Lütfen kurun.");
        return;
    }
  showConnect({
    appDetails: {
      name: 'Multi-Sig Wallet',
      icon: window.location.origin + '/logo.png', // Logon varsa ekle
    },
    userSession,
    onFinish: () => {
      window.location.reload();
    },
  });
};
