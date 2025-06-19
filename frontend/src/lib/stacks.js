// src/lib/stacks.js
import {
  makeContractCall,
  broadcastTransaction,
  standardPrincipalCV,
  uintCV,
} from "@stacks/transactions";

import { StacksNetwork } from "@stacks/network";

const network = new StacksNetwork("https://stacks-testnet-api.mainnet-stacks.co");

export async function proposeTransaction(id, to, amount, senderKey) {
  // makeContractCall to propose
}

export async function confirmTransaction(id, senderKey) {
  // makeContractCall to confirm
}

