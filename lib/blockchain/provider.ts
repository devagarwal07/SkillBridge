import { ethers } from "ethers";

// Provider types
export type ProviderType = "metamask" | "infura" | "alchemy";

/**
 * Gets an Ethereum provider based on the specified type
 */
export const getProvider = (
  type: ProviderType = "infura",
  network: string = "sepolia"
): ethers.providers.Provider => {
  switch (type) {
    case "metamask":
      // Browser provider (MetaMask)
      if (typeof window !== "undefined" && window.ethereum) {
        return new ethers.providers.Web3Provider(window.ethereum);
      }
      throw new Error("MetaMask is not installed or not accessible");

    case "infura":
      // Infura provider
      const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY;
      if (!infuraApiKey) {
        throw new Error(
          "INFURA_API_KEY is not defined in environment variables"
        );
      }
      return new ethers.providers.InfuraProvider(network, infuraApiKey);

    case "alchemy":
      // Alchemy provider
      const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
      if (!alchemyApiKey) {
        throw new Error(
          "ALCHEMY_API_KEY is not defined in environment variables"
        );
      }
      return new ethers.providers.AlchemyProvider(network, alchemyApiKey);

    default:
      throw new Error(`Unsupported provider type: ${type}`);
  }
};

/**
 * Gets contract interfaces for the ZKP and Proposal contracts
 */
export const getContractInterfaces = () => {
  // These ABIs should come from your compiled contracts
  const zkpContractAbi = [
    // Add your ZKP contract ABI here
    "function submitProof(bytes32 _proofHash)",
    "function isVerified(address _user) view returns (bool)",
    "function getProofHash(address _user) view returns (bytes32)",
  ];

  const proposalContractAbi = [
    // Add your Proposal contract ABI here
    "function vote(uint256 _proposalId, bool _support)",
    "function executeProposal(uint256 _proposalId)",
    "function createProposal(string _title, string _description, uint256 _amount, address _recipient, uint256 _deadline)",
    "function getProposal(uint256 _proposalId) view returns (string, string, uint256, uint256, uint256, uint256, bool, bool)",
  ];

  return {
    zkpContractAbi,
    proposalContractAbi,
  };
};

/**
 * Gets contract instances
 */
export const getContracts = (provider: ethers.providers.Provider) => {
  const { zkpContractAbi, proposalContractAbi } = getContractInterfaces();

  const zkpContractAddress = process.env.NEXT_PUBLIC_ZKP_CONTRACT_ADDRESS;
  const proposalContractAddress =
    process.env.NEXT_PUBLIC_PROPOSAL_CONTRACT_ADDRESS;

  if (!zkpContractAddress || !proposalContractAddress) {
    throw new Error(
      "Contract addresses are not defined in environment variables"
    );
  }

  const zkpContract = new ethers.Contract(
    zkpContractAddress,
    zkpContractAbi,
    provider
  );
  const proposalContract = new ethers.Contract(
    proposalContractAddress,
    proposalContractAbi,
    provider
  );

  return {
    zkpContract,
    proposalContract,
  };
};
