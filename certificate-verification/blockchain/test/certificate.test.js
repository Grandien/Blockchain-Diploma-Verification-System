import { expect } from "chai";
import hre from "hardhat";

describe("CertificateVerification", function () {
  let contract;
  let owner;

  beforeEach(async function () {
    [owner] = await hre.ethers.getSigners();
    const Contract = await hre.ethers.getContractFactory("CertificateVerification");
    contract = await Contract.deploy();
  });

  it("Harus bisa terbitkan sertifikat baru", async function () {
    const certId = "CERT-2024-001";
    const fileHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("file_pdf"));
    const dataHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("data_mhs"));

    await contract.issueCertificate(certId, fileHash, dataHash);
    const info = await contract.getCertificateInfo(certId);
    expect(info.isValid).to.equal(true);
  });

  it("Harus deteksi file PDF dimanipulasi", async function () {
    const certId = "CERT-2024-002";
    const fileHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("file_asli"));
    const dataHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("data_asli"));
    const fakeFileHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("file_palsu"));

    await contract.issueCertificate(certId, fileHash, dataHash);
    const result = await contract.verifyCertificate(certId, fakeFileHash, dataHash);

    expect(result.fileMatch).to.equal(false);
    expect(result.dataMatch).to.equal(true);
  });

  it("Harus deteksi data dimanipulasi", async function () {
    const certId = "CERT-2024-003";
    const fileHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("file_asli"));
    const dataHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("data_asli"));
    const fakeDataHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("data_palsu"));

    await contract.issueCertificate(certId, fileHash, dataHash);
    const result = await contract.verifyCertificate(certId, fileHash, fakeDataHash);

    expect(result.fileMatch).to.equal(true);
    expect(result.dataMatch).to.equal(false);
  });
});