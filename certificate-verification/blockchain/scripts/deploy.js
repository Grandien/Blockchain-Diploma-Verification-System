import hre from "hardhat";

async function main() {
  console.log("Mendeploy CertificateVerification...");

  const Certificate = await hre.ethers.getContractFactory(
    "CertificateVerification"
  );
  const certificate = await Certificate.deploy();
  await certificate.waitForDeployment();

  const address = await certificate.getAddress();
  console.log(`✅ Contract berhasil di-deploy ke: ${address}`);
  console.log(`Salin address ini ke file .env sebagai CONTRACT_ADDRESS`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});