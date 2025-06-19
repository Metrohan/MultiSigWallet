# 🔐 Multi-Signature Wallet
![Multi-Sig Banner](https://via.placeholder.com/1000x250.png?text=Multi-Signature+Wallet+on+Stacks)

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Stacks](https://img.shields.io/badge/powered%20by-Stacks-5546FF)](https://www.stacks.co)

A secure, decentralized **Multi-Signature Wallet** built on the Stacks blockchain using Clarity smart contracts and a Next.js frontend. This wallet requires multiple predefined signers to approve transactions before they are executed, ensuring greater security and trust for collaborative fund management.

---

## 📝 Project Description

This project implements a fully functional multi-signature wallet dApp, allowing multiple parties to propose, confirm, and execute transactions only when a minimum threshold of confirmations is reached. It is useful for DAOs, joint treasury management, and any shared fund system requiring trust minimization.

---

## 🚀 Live Demo

> [Demo App Link – IF_DEPLOYED](https://your-live-demo-url.com)  
> _You can remove this section if not deployed yet._

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
- 📤 **Proposal Submission** – Create a transaction proposal with recipient and amount.
- ✅ **Confirmations** – Each owner can confirm the proposal.
- 🚀 **Execute Transaction** – Only executes if enough confirmations are collected.
- 🕒 **Expiry Time** – Proposals can expire after a set block height.
- 🧾 **Activity Log** – Track proposals and confirmations on-chain.

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

> 🛠️ Built with ❤️ on Stacks by [Metehaan Günen]