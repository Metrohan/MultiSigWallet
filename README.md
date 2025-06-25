# 🔐 Multi-Signature Wallet

![output](https://github.com/user-attachments/assets/76d125b0-4030-4f65-8d75-3cdb50be8209)


[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Stacks](https://img.shields.io/badge/powered%20by-Stacks-5546FF)](https://www.stacks.co)

---
## CHECK NOTES!


A secure, decentralized **Multi-Signature Wallet** built on the Stacks blockchain using Clarity smart contracts and a Next.js frontend. This wallet requires multiple predefined signers to approve transactions before they are executed, ensuring greater security and trust for collaborative fund management.

---

## 📝 Project Description

This project implements a fully functional multi-signature wallet dApp, allowing multiple parties to propose, confirm, and execute transactions only when a minimum threshold of confirmations is reached. It is useful for DAOs, joint treasury management, and any shared fund system requiring trust minimization.

---

## 🔧 Technologies Used

- 🌐 **Stacks Blockchain**
- 📜 **Clarity Smart Contracts**
- ⚛️ **Next.js / React**
- 🎨 **Tailwind CSS**
- 🔗 **Hiro Wallet integration**
- 🧪 **Clarinet for contract testing**
- ⛓️ **Stacks.js**

---

## ✨ Key Features

- 🔐 **Multi-sig Authorization** – Transactions require approval from multiple owners.
- 🧍 **Fixed Owner Set Initialization** – A single-use `initialize` function defines all owners. *(Critical!)*
- 📤 **Proposal Submission** – Owners can propose transactions with recipient and amount.
- ✅ **Confirmations** – Each owner can confirm the proposal.
- 🚀 **Execute Transaction** – Transactions execute after enough confirmations.
- ⏳ **Proposal Expiry** – Each proposal includes an expiration block height.
- 📜 **On-chain Records** – All proposals, confirmations, and executions are stored on-chain.

---

## 📦 Repository

[🔗 GitHub Repository](https://github.com/Metrohan/MultiSigWallet)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js `>= 18`
- Clarinet (`npm install -g @hirosystems/clarinet`)
- Hiro Wallet (browser extension)

### Installation

```bash
git clone https://github.com/Metrohan/MultiSigWallet.git
cd MultiSigWallet
npm install
```

Start frontend:
```bash
npm run dev
```

Start smart contract dev env:
```bash
clarinet console
```

---

## ⚙️ Usage

### Proposing a Transaction
1. Connect your wallet.
2. Enter recipient and amount.
3. Submit the proposal.
4. Other owners can confirm via the UI.
5. Once threshold is met, the proposal becomes executable.

---

## 📄 Smart Contract Documentation

### `multi-sig-wallet.clar`

| Function | Description |
|----------|-------------|
| `propose-transaction` | Creates a new transaction proposal. |
| `confirm-transaction` | Allows a wallet owner to confirm an existing proposal. |
| `execute-transaction` | Executes the transaction if confirmation threshold is met. |
| `add-owner` | (Optional) Add a new wallet owner (if allowed). |
| `remove-owner` | (Optional) Remove an owner (if allowed). |

### Proposal Data Structure:
```clarity
{
  to: principal,
  amount: uint,
  confirmations: (list 10 principal),
  confirmation-count: uint,
  executed: bool,
  expires-at: uint
}
```

---

## 📦 Deployment

### Testnet Deployment

```bash
clarinet check
clarinet deployment apply --testnet
```

Follow instructions to broadcast via [Hiro Testnet Explorer](https://explorer.hiro.so).

### Mainnet Deployment

Replace `.toml` config with mainnet keys and run:

```bash
clarinet deploy mainnet
```

---

## 🧪 Testing

```bash
clarinet deployment apply --testnet
```

- Write tests in `tests/` directory using Clarinet’s test suite.

---

## ⚠️ Known Issues

  - initialize can only be called once. If your address is not one of the initial owners, you will not be able to interact with the wallet.
  - There is no current add-owner or remove-owner functionality in this implementation.
    
---

## ✅ ToDo

- Implement optional add-owner / remove-owner logic (post-initialization governance).
- Show real-time proposal list via stacks.js on frontend.
- Add filtering (pending / executed / expired).
- Improve error handling in frontend UI.
- Add email/notification integration for confirmations.
- Finalize README with complete deployment instructions.
  
---

## 🤝 Contributing

We welcome contributions!

1. Fork the repo
2. Create a branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push and create a PR

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact / Support

For questions, open an issue or contact the maintainer at:  
📧 **metehangnn@outlook.com**  
🐦 [@metehangnn](https://x.com/metehangnn)

---

## 🙌 Acknowledgments

- [Stacks Foundation](https://stacks.org)
- [Hiro Systems](https://www.hiro.so/)
- [Clarity Lang](https://docs.stacks.co/docs/clarity-lang)
- [Clarinet](https://github.com/hirosystems/clarinet)

---

## Notes

I was unable to complete my project due to limited internet access. I will add a ToDo list to the README to better explain my purpose.

---

> 🛠️ Built with ❤️ on Stacks by [Metehan Günen]
