const { ethers } = require("ethers");
require("dotenv").config();

// ABI smart contract — salin dari hasil compile Hardhat
// blockchain/artifacts/contracts/CertificateVerification.sol/CertificateVerification.json
const ABI = [
  "function issueCertificate(string certId, bytes32 fileHash, bytes32 dataHash)",
  "function verifyCertificate(string certId, bytes32 newFileHash, bytes32 newDataHash) view returns (bool exists, bool isValid, bool fileMatch, bool dataMatch, uint256 timestamp)",
  "function revokeCertificate(string certId)",
  "function getCertificateInfo(string certId) view returns (address issuer, uint256 timestamp, bool isValid)",
];

let provider;
let signer;
let contract;

const connectBlockchain = () => {
  try {
    provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC);
    signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      ABI,
      signer
    );
    console.log("✅ Blockchain terhubung");
    return contract;
  } catch (error) {
    console.error("❌ Blockchain gagal terhubung:", error.message);
    throw error;
  }
};

const getContract = () => {
  if (!contract) connectBlockchain();
  return contract;
};

module.exports = { connectBlockchain, getContract };
