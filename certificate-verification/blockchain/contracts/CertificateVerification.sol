// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title Certificate Verification dengan Dual Hash
/// @notice Sistem verifikasi ijazah menggunakan dua hash terpisah
contract CertificateVerification {

    struct Certificate {
        bytes32 fileHash;    // Hash 1 → file PDF
        bytes32 dataHash;    // Hash 2 → metadata/data mahasiswa
        address issuer;      // alamat wallet kampus
        uint256 timestamp;   // waktu penerbitan
        bool isValid;        // status sertifikat
    }

    // Mapping certId → Certificate
    mapping(string => Certificate) private certificates;

    address public owner;

    // Events
    event CertificateIssued(string certId, address issuer, uint256 timestamp);
    event CertificateRevoked(string certId, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Hanya institusi resmi yang dapat melakukan ini");
        _;
    }

    // ─────────────────────────────────────────────────
    // 1. TERBITKAN sertifikat baru
    // ─────────────────────────────────────────────────
    function issueCertificate(
        string memory certId,
        bytes32 fileHash,
        bytes32 dataHash
    ) public onlyOwner {
        require(
            certificates[certId].timestamp == 0,
            "Sertifikat dengan ID ini sudah terdaftar"
        );
        require(fileHash != bytes32(0), "File hash tidak boleh kosong"); // # img.pdf -> 
        require(dataHash != bytes32(0), "Data hash tidak boleh kosong");

        certificates[certId] = Certificate({
            fileHash: fileHash,
            dataHash: dataHash,
            issuer: msg.sender,
            timestamp: block.timestamp,
            isValid: true
        });

        emit CertificateIssued(certId, msg.sender, block.timestamp);
    }

    // ─────────────────────────────────────────────────
    // 2. VERIFIKASI sertifikat
    // ─────────────────────────────────────────────────
    function verifyCertificate(
        string memory certId,
        bytes32 newFileHash,
        bytes32 newDataHash
    ) public view returns (
        bool exists,
        bool isValid,
        bool fileMatch,
        bool dataMatch,
        uint256 timestamp
    ) {
        Certificate memory cert = certificates[certId];

        // Sertifikat tidak ditemukan
        if (cert.timestamp == 0) {
            return (false, false, false, false, 0);
        }

        // Bandingkan hash secara independen — BUKAN di-concat!
        return (
            true,
            cert.isValid,
            cert.fileHash == newFileHash, // bandingin hash file yang di input dengan hash file asli
            cert.dataHash == newDataHash, // bandingin hash data yang di input dengan hash data asli
            cert.timestamp
        );
    }

    // ─────────────────────────────────────────────────
    // 3. REVOKE sertifikat
    // ─────────────────────────────────────────────────
    function revokeCertificate(string memory certId) public onlyOwner {
        require(
            certificates[certId].timestamp != 0,
            "Sertifikat tidak ditemukan"
        );
        require(
            certificates[certId].isValid,
            "Sertifikat sudah direvoke sebelumnya"
        );

        certificates[certId].isValid = false;
        emit CertificateRevoked(certId, block.timestamp);
    }

    // ─────────────────────────────────────────────────
    // 4. GET INFO sertifikat
    // ─────────────────────────────────────────────────
    function getCertificateInfo(string memory certId)
        public view returns (
            address issuer,
            uint256 timestamp,
            bool isValid
        )
    {
        Certificate memory cert = certificates[certId];
        return (cert.issuer, cert.timestamp, cert.isValid);
    }
}
