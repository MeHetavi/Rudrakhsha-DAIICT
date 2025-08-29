import { ethers } from "ethers";

// Replace with actual ABI JSON content. For now, import placeholder from local file.
import abi from "../HydrogenCreditCertificate.json";

export const CONTRACT_ADDRESS = "0x945399948e25415dB05a30D6e0b4134A1882b303";

export async function getSigner(): Promise<ethers.Signer> {
  const anyWindow = window as unknown as { ethereum?: unknown };
  if (!anyWindow.ethereum) {
    throw new Error("MetaMask not found. Please install it.");
  }
  const provider = new ethers.BrowserProvider(anyWindow.ethereum as any);
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

export async function getContractWithSigner(): Promise<ethers.Contract> {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, abi as any, signer);
}

export async function submitCertificationRequest(reportURI: string, amount: number): Promise<string> {
  try {
    console.log("Submitting request with reportURI:", reportURI, "amount:", amount);
    const contract = await getContractWithSigner();
    
    // First, let's check if the function exists
    if (!contract.submitCertificationRequest) {
      throw new Error("Contract function 'submitCertificationRequest' not found. Check your ABI.");
    }
    
    // Try to estimate gas first to catch errors early
    const gasEstimate = await contract.submitCertificationRequest.estimateGas(reportURI, amount);
    console.log("Gas estimate:", gasEstimate.toString());
    
    const tx = await contract.submitCertificationRequest(reportURI, amount, {
      gasLimit: Math.floor(Number(gasEstimate) * 1.2), // Add 20% buffer
    });
    
    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    return receipt?.hash as string;
  } catch (error: any) {
    console.error("Error in submitCertificationRequest:", error);
    
    // Provide more helpful error messages
    if (error.message?.includes("missing revert data")) {
      throw new Error("Contract call failed. This usually means:\n1. Wrong ABI/contract functions\n2. Missing permissions\n3. Contract is paused\n4. Invalid parameters");
    }
    
    if (error.message?.includes("execution reverted")) {
      throw new Error("Contract execution reverted. Check if you have permission to submit requests.");
    }
    
    throw new Error(`Failed to submit request: ${error.message || error.reason || "Unknown error"}`);
  }
}

export async function verifyRequest(requestId: bigint): Promise<string> {
  try {
    console.log("Verifying request for request ID:", requestId.toString());
    const contract = await getContractWithSigner();
    
    if (!contract.verifyRequest) {
      throw new Error("Contract function 'verifyRequest' not found. Check your ABI.");
    }
    
    const gasEstimate = await contract.verifyRequest.estimateGas(requestId);
    console.log("Gas estimate:", gasEstimate.toString());
    
    const tx = await contract.verifyRequest(requestId, {
      gasLimit: Math.floor(Number(gasEstimate) * 1.2),
    });
    
    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    return receipt?.hash as string;
  } catch (error: any) {
    console.error("Error in verifyRequest:", error);
    throw new Error(`Failed to verify request: ${error.message || error.reason || "Unknown error"}`);
  }
}

export async function approveAmount(requestId: bigint, approvedAmount: number, adminNotes: string): Promise<string> {
  try {
    console.log("Approving amount for request ID:", requestId.toString(), "amount:", approvedAmount);
    const contract = await getContractWithSigner();
    
    if (!contract.approveAmount) {
      throw new Error("Contract function 'approveAmount' not found. Check your ABI.");
    }
    
    const gasEstimate = await contract.approveAmount.estimateGas(requestId, approvedAmount, adminNotes);
    console.log("Gas estimate:", gasEstimate.toString());
    
    const tx = await contract.approveAmount(requestId, approvedAmount, adminNotes, {
      gasLimit: Math.floor(Number(gasEstimate) * 1.2),
    });
    
    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    return receipt?.hash as string;
  } catch (error: any) {
    console.error("Error in approveAmount:", error);
    throw new Error(`Failed to approve amount: ${error.message || error.reason || "Unknown error"}`);
  }
}

export async function mintTokens(requestId: bigint): Promise<string> {
  try {
    console.log("Minting tokens for request ID:", requestId.toString());
    const contract = await getContractWithSigner();
    
    if (!contract.mintTokens) {
      throw new Error("Contract function 'mintTokens' not found. Check your ABI.");
    }
    
    const gasEstimate = await contract.mintTokens.estimateGas(requestId);
    console.log("Gas estimate:", gasEstimate.toString());
    
    const tx = await contract.mintTokens(requestId, {
      gasLimit: Math.floor(Number(gasEstimate) * 1.2),
    });
    
    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    return receipt?.hash as string;
  } catch (error: any) {
    console.error("Error in mintTokens:", error);
    throw new Error(`Failed to mint tokens: ${error.message || error.reason || "Unknown error"}`);
  }
}

export async function getRequest(requestId: bigint): Promise<any> {
  try {
    console.log("Getting request details for ID:", requestId.toString());
    const contract = await getContractWithSigner();
    
    if (!contract.getRequest) {
      throw new Error("Contract function 'getRequest' not found. Check your ABI.");
    }
    
    const result = await contract.getRequest(requestId);
    console.log("Request details:", result);
    return result;
  } catch (error: any) {
    console.error("Error in getRequest:", error);
    throw new Error(`Failed to get request: ${error.message || error.reason || "Unknown error"}`);
  }
}

export async function getAllRequests(): Promise<bigint[]> {
  try {
    console.log("Getting all request IDs");
    const contract = await getContractWithSigner();
    
    if (!contract.getAllRequests) {
      throw new Error("Contract function 'getAllRequests' not found. Check your ABI.");
    }
    
    const result = await contract.getAllRequests();
    console.log("All request IDs:", result);
    return result;
  } catch (error: any) {
    console.error("Error in getAllRequests:", error);
    throw new Error(`Failed to get all requests: ${error.message || error.reason || "Unknown error"}`);
  }
}

export async function getMultipleRequests(requestIds: bigint[]): Promise<any[]> {
  try {
    console.log("Getting multiple requests for IDs:", requestIds);
    const contract = await getContractWithSigner();
    
    if (!contract.getMultipleRequests) {
      throw new Error("Contract function 'getMultipleRequests' not found. Check your ABI.");
    }
    
    const result = await contract.getMultipleRequests(requestIds);
    console.log("Multiple requests result:", result);
    return result;
  } catch (error: any) {
    console.error("Error in getMultipleRequests:", error);
    throw new Error(`Failed to get multiple requests: ${error.message || error.reason || "Unknown error"}`);
  }
}

export async function getTotalRequests(): Promise<bigint> {
  try {
    console.log("Getting total request count");
    const contract = await getContractWithSigner();
    
    if (!contract.getTotalRequests) {
      throw new Error("Contract function 'getTotalRequests' not found. Check your ABI.");
    }
    
    const result = await contract.getTotalRequests();
    console.log("Total requests:", result);
    return result;
  } catch (error: any) {
    console.error("Error in getTotalRequests:", error);
    throw new Error(`Failed to get total requests: ${error.message || error.reason || "Unknown error"}`);
  }
}

export async function addCertifier(account: string): Promise<string> {
  try {
    console.log("Adding certifier:", account);
    const contract = await getContractWithSigner();
    
    if (!contract.addCertifier) {
      throw new Error("Contract function 'addCertifier' not found. Check your ABI.");
    }
    
    const gasEstimate = await contract.addCertifier.estimateGas(account);
    console.log("Gas estimate:", gasEstimate.toString());
    
    const tx = await contract.addCertifier(account, {
      gasLimit: Math.floor(Number(gasEstimate) * 1.2),
    });
    
    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    return receipt?.hash as string;
  } catch (error: any) {
    console.error("Error in addCertifier:", error);
    throw new Error(`Failed to add certifier: ${error.message || error.reason || "Unknown error"}`);
  }
}

export async function addGovernment(account: string): Promise<string> {
  try {
    console.log("Adding government:", account);
    const contract = await getContractWithSigner();
    
    if (!contract.addGovernment) {
      throw new Error("Contract function 'addGovernment' not found. Check your ABI.");
    }
    
    const gasEstimate = await contract.addGovernment.estimateGas(account);
    console.log("Gas estimate:", gasEstimate.toString());
    
    const tx = await contract.addGovernment(account, {
      gasLimit: Math.floor(Number(gasEstimate) * 1.2),
    });
    
    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    return receipt?.hash as string;
  } catch (error: any) {
    console.error("Error in addGovernment:", error);
    throw new Error(`Failed to add government: ${error.message || error.reason || "Unknown error"}`);
  }
}

export async function checkRoles(account: string): Promise<{ admin: boolean, certifier: boolean, government: boolean }> {
  try {
    console.log("Checking roles for account:", account);
    const contract = await getContractWithSigner();
    
    const adminRole = await contract.DEFAULT_ADMIN_ROLE();
    const certifierRole = await contract.CERTIFIER_ROLE();
    const governmentRole = await contract.GOVERNMENT_ROLE();
    
    const hasAdmin = await contract.hasRole(adminRole, account);
    const hasCertifier = await contract.hasRole(certifierRole, account);
    const hasGovernment = await contract.hasRole(governmentRole, account);
    
    console.log("Role check results:", { hasAdmin, hasCertifier, hasGovernment });
    
    return {
      admin: hasAdmin,
      certifier: hasCertifier,
      government: hasGovernment
    };
  } catch (error: any) {
    console.error("Error checking roles:", error);
    throw new Error(`Failed to check roles: ${error.message || "Unknown error"}`);
  }
}

export async function inspectContract(): Promise<{ functions: string[], address: string }> {
  try {
    const contract = await getContractWithSigner();
    const functions = Object.keys(contract.interface.fragments);
    
    console.log("Available contract functions:", functions);
    console.log("Contract address:", CONTRACT_ADDRESS);
    
    return {
      functions,
      address: CONTRACT_ADDRESS
    };
  } catch (error: any) {
    console.error("Error inspecting contract:", error);
    throw new Error(`Failed to inspect contract: ${error.message || "Unknown error"}`);
  }
}
