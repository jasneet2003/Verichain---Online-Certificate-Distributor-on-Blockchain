const { ethers } = require('ethers');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        const { eventId, recipientName, recipientAddress } = req.body;
        if (!eventId || !recipientName || !recipientAddress) {
            return res.status(400).json({ success: false, message: 'Missing required fields.' });
        }

        // 1. Get secrets from Environment Variables
        const distributorPrivateKey = process.env.DISTRIBUTOR_PRIVATE_KEY;
        const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL; // Using the new variable

        if (!distributorPrivateKey || !sepoliaRpcUrl) {
            throw new Error("Server configuration error: Required environment variables are not set.");
        }
        
        // 2. Connect to the Blockchain using the secure RPC URL
        const provider = new ethers.providers.JsonRpcProvider(sepoliaRpcUrl);
        const distributorWallet = new ethers.Wallet(distributorPrivateKey, provider);

        // 3. Interact with your Smart Contract
        const contractAddress = "0xCd3F074104d3e9b09d04833F2Fb92ac92d8A1931";
        // IMPORTANT: Make sure you paste your FULL, unabbreviated ABI here.
        const contractABI = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "certificateId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "recipientName", "type": "string" }, { "indexed": true, "internalType": "address", "name": "recipientAddress", "type": "address" } ], "name": "CertificateIssued", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "_eventId", "type": "uint256" }, { "internalType": "string", "name": "_recipientName", "type": "string" }, { "internalType": "address", "name": "_recipientAddress", "type": "address" } ], "name": "claimCertificate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "_name", "type": "string" }, { "internalType": "uint256", "name": "_date", "type": "uint256" }, { "internalType": "string", "name": "_location", "type": "string" } ], "name": "createEvent", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "newDistributor", "type": "address" } ], "name": "DistributorChanged", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "name", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "date", "type": "uint256" } ], "name": "EventCreated", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "_eventId", "type": "uint256" }, { "internalType": "string[]", "name": "_recipientNames", "type": "string[]" }, { "internalType": "address[]", "name": "_recipientAddresses", "type": "address[]" } ], "name": "issueBatchCertificates", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_eventId", "type": "uint256" }, { "internalType": "string", "name": "_recipientName", "type": "string" }, { "internalType": "address", "name": "_recipientAddress", "type": "address" } ], "name": "issueSingleCertificate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_newDistributor", "type": "address" } ], "name": "setDistributor", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "certificateCounter", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "certificates", "outputs": [ { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "eventId", "type": "uint256" }, { "internalType": "string", "name": "recipientName", "type": "string" }, { "internalType": "address", "name": "recipientAddress", "type": "address" }, { "internalType": "uint256", "name": "issueDate", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "distributor", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "eventCounter", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "events", "outputs": [ { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "uint256", "name": "date", "type": "uint256" }, { "internalType": "string", "name": "location", "type": "string" }, { "internalType": "uint256", "name": "certificatesIssued", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_certificateId", "type": "uint256" } ], "name": "getCertificateDetails", "outputs": [ { "components": [ { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "eventId", "type": "uint256" }, { "internalType": "string", "name": "recipientName", "type": "string" }, { "internalType": "address", "name": "recipientAddress", "type": "address" }, { "internalType": "uint256", "name": "issueDate", "type": "uint256" } ], "internalType": "struct VeriChain.Certificate", "name": "", "type": "tuple" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_eventId", "type": "uint256" } ], "name": "getEventDetails", "outputs": [ { "components": [ { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "uint256", "name": "date", "type": "uint256" }, { "internalType": "string", "name": "location", "type": "string" }, { "internalType": "uint256", "name": "certificatesIssued", "type": "uint256" }, { "internalType": "uint256[]", "name": "certificateIds", "type": "uint256[]" } ], "internalType": "struct VeriChain.Event", "name": "", "type": "tuple" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" } ];
        const contract = new ethers.Contract(contractAddress, contractABI, distributorWallet);
        
        // 4. Call the function and send the transaction
        const tx = await contract.claimCertificate(eventId, recipientName, recipientAddress);
        await tx.wait();

        res.status(200).json({ success: true, transactionHash: tx.hash });

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ success: false, message: error.message || 'An internal server error occurred.' });
    }
}