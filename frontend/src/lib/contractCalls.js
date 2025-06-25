// src/lib/contractCalls.js
import {
  callReadOnlyFunction,
  standardPrincipalCV,
  uintCV,
  stringUtf8CV,
  PostConditionMode,
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import { openContractCall } from '@stacks/connect';

const contractAddress = "ST396D69K21GVKQVKTGSVJ9J8GRF1A9N3NCFP69P7"; // kendi adresin
const contractName = "multi-sig-wallet";
const network = new StacksTestnet();

export const proposeTransaction = async (recipient, amount) => {
  const integerAmount = Number(amount);
  if (!Number.isInteger(integerAmount) || integerAmount <= 0) {
    throw new Error("Amount must be a positive integer");
  }
  
  const functionArgs = [
    standardPrincipalCV(recipient),
    uintCV(integerAmount)
  ];
  
  const options = {
    contractAddress,
    contractName,
    functionName: "propose-transaction",
    functionArgs,
    network,
    postConditionMode: PostConditionMode.Allow,
    onFinish: data => console.log('Transaction submitted:', data),
    onCancel: () => console.log('Transaction canceled')
  };
  
  await openContractCall(options);
};

export const confirmTransaction = async (proposalId) => {
  // Proposal ID validasyonu
  if (!proposalId) {
    throw new Error("Proposal ID is required");
  }
  
  const parsedId = parseInt(proposalId);
  if (isNaN(parsedId) || parsedId <= 0) {
    throw new Error("Invalid proposal ID. Must be a positive number.");
  }
  
  const functionArgs = [uintCV(parsedId)];
  
  const options = {
    contractAddress,
    contractName,
    functionName: "confirm-transaction",
    functionArgs,
    network,
    postConditionMode: PostConditionMode.Allow,
    onFinish: data => console.log('Transaction submitted:', data),
    onCancel: () => console.log('Transaction canceled')
  };
  
  await openContractCall(options);
};

// Contract'ınızın yapısına uygun olarak güncellenmiş getProposals fonksiyonu
export const getProposals = async (sender) => {
  try {
    // Önce toplam proposal sayısını al
    const countResult = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "get-proposal-count",
      functionArgs: [],
      network,
      senderAddress: sender,
    });
    
    const totalCount = parseInt(countResult.value.value);
    const proposals = [];
    
    // Her proposal'ı tek tek çek (1'den başlayarak çünkü ID'ler 1'den başlıyor)
    for (let i = 1; i <= totalCount; i++) {
      try {
        const proposalResult = await callReadOnlyFunction({
          contractAddress,
          contractName,
          functionName: "get-proposal",
          functionArgs: [uintCV(i)],
          network,
          senderAddress: sender,
        });
        
        // Proposal varsa listeye ekle
        if (proposalResult.value !== null && proposalResult.value.data) {
          const proposalData = proposalResult.value.data;
          proposals.push({
            id: i,
            recipient: proposalData.to.value,
            amount: parseInt(proposalData.amount.value) / 1_000_000, // microSTX → STX
            confirmationCount: parseInt(proposalData['confirmation-count'].value),
            executed: proposalData.executed.value,
            confirmations: proposalData.confirmations.value.map(p => p.value)
          });
        }
      } catch (error) {
        console.error(`Error fetching proposal ${i}:`, error);
        // Belirli bir proposal alınamıyorsa devam et
      }
    }
    
    return proposals;
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return [];
  }
};

// Tek bir proposal almak için yardımcı fonksiyon
export const getProposal = async (proposalId, sender) => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "get-proposal",
      functionArgs: [uintCV(parseInt(proposalId))],
      network,
      senderAddress: sender,
    });
    
    if (result.value && result.value.data) {
      const proposalData = result.value.data;
      return {
        id: parseInt(proposalId),
        recipient: proposalData.to.value,
        amount: parseInt(proposalData.amount.value) / 1_000_000,
        confirmationCount: parseInt(proposalData['confirmation-count'].value),
        executed: proposalData.executed.value,
        confirmations: proposalData.confirmations.value.map(p => p.value)
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return null;
  }
};

// Threshold'u almak için yardımcı fonksiyon
export const getThreshold = async (sender) => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "get-threshold",
      functionArgs: [],
      network,
      senderAddress: sender,
    });
    
    return parseInt(result.value.value);
  } catch (error) {
    console.error("Error fetching threshold:", error);
    return 0;
  }
};

// Contract'ı initialize etmek için
export const initializeContract = async (owner1, owner2, owner3, threshold) => {
  const functionArgs = [
    standardPrincipalCV(owner1),
    standardPrincipalCV(owner2),
    standardPrincipalCV(owner3),
    uintCV(threshold)
  ];
  
  const options = {
    contractAddress,
    contractName,
    functionName: "initialize",
    functionArgs,
    network,
    postConditionMode: PostConditionMode.Allow,
    onFinish: data => console.log('Initialize transaction submitted:', data),
    onCancel: () => console.log('Initialize transaction canceled')
  };
  
  await openContractCall(options);
};

export const isOwner = async (principalAddress, sender) => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "is-owner-check",
      functionArgs: [standardPrincipalCV(principalAddress)],
      network,
      senderAddress: sender,
    });

    return result?.value?.value === true;
  } catch (error) {
    console.error("Error checking owner status:", error);
    return false;
  }
};
