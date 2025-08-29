# 🌱 Blockchain-Based Green Hydrogen Credit System

A decentralized application (dApp) for issuing, tracking, and certifying Green Hydrogen Credits (GHC) as ERC-20 tokens on the Ethereum blockchain.

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MetaMask** browser extension
- **Sepolia testnet ETH** for gas fees

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd rudrakhsha-daiict-web

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔐 Wallet Setup & Funding

### Step 1: Install MetaMask
1. Go to [metamask.io](https://metamask.io)
2. Click "Download" and install the browser extension
3. Create a new wallet or import existing one
4. **IMPORTANT**: Write down your 12-word seed phrase and store it safely!

### Step 2: Switch to Sepolia Testnet
1. Open MetaMask
2. Click the network dropdown (usually shows "Ethereum Mainnet")
3. Select "Sepolia Testnet"
4. If Sepolia isn't listed, click "Add Network" and enter:
   - **Network Name**: Sepolia Testnet
   - **RPC URL**: `https://sepolia.infura.io/v3/your-project-id`
   - **Chain ID**: `11155111`
   - **Currency Symbol**: `ETH`
   - **Block Explorer**: `https://sepolia.etherscan.io`

### Step 3: Get Sepolia Testnet ETH
1. **Option 1: Sepolia Faucet (Recommended)**
   - Go to [sepoliafaucet.com](https://sepoliafaucet.com)
   - Connect your MetaMask wallet
   - Request test ETH (usually 0.5-1 ETH)

2. **Option 2: Infura Sepolia Faucet**
   - Visit [infura.io/faucet/sepolia](https://infura.io/faucet/sepolia)
   - Connect wallet and request test ETH

3. **Option 3: Alchemy Sepolia Faucet**
   - Go to [sepoliafaucet.com](https://sepoliafaucet.com)
   - Connect wallet and request test ETH

**Note**: You need at least 0.1-0.2 ETH for gas fees to interact with the smart contract.

## 🏗️ Smart Contract Deployment

### Step 1: Deploy Contract
1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create new file: `HydrogenCredit.sol`
3. Paste the Solidity contract code
4. Compile the contract (Ctrl+S)
5. Deploy to Sepolia testnet
6. **Copy the deployed contract address**

### Step 2: Update Contract Address
1. Open `src/lib/contract.ts`
2. Update `CONTRACT_ADDRESS` with your deployed contract address
3. Save the file

## 🎯 Application Usage

### 1. Connect Wallet
- Click "Connect Wallet" button
- Approve MetaMask connection
- Your wallet address will appear

### 2. Submit Certification Request
1. **Report URI**: Enter IPFS hash or URL of your production report
   - Example: `ipfs://QmYourHash123`
   - Example: `https://your-domain.com/report.pdf`
2. **Amount**: Enter number of GHC tokens requested
   - Example: `100` for 100 GHC tokens
3. Click "Submit Request"
4. **Approve transaction in MetaMask**
5. Wait for confirmation

### 3. Verify Request (Certifier Role)
1. **Request ID**: Enter the ID from your submitted request
2. Click "Verify Request"
3. **Approve transaction in MetaMask**
4. Wait for confirmation

### 4. Mint Tokens (Government Role)
1. **Request ID**: Enter the verified request ID
2. Click "Mint Tokens"
3. **Approve transaction in MetaMask**
4. Wait for confirmation
5. GHC tokens will be minted to the startup's wallet

### 5. Admin Functions

#### Approve Amount
1. **Request ID**: Enter the request ID
2. **Approved Amount**: Set the amount admin wants to mint
3. **Admin Notes**: Add any notes or comments
4. Click "Approve Amount"

#### Add Roles
- **Add Self as Certifier**: Grant yourself certifier permissions
- **Add Self as Government**: Grant yourself government permissions

### 6. View All Requests
1. Click "Load All Requests"
2. View all certification requests in the system
3. See status, amounts, and admin notes

## 🔍 Debug & Troubleshooting

### Check Contract Functions
- Click "Inspect Contract Functions" to see available functions
- Verify contract is deployed correctly

### Check Your Roles
- Click "Check My Roles" to see your permissions
- Ensure you have the right roles for your actions

### Common Issues

#### "Failed to estimate gas"
- **Cause**: Insufficient Sepolia ETH
- **Solution**: Get more testnet ETH from faucets

#### "Missing revert data"
- **Cause**: Contract function mismatch or wrong parameters
- **Solution**: Check ABI matches deployed contract

#### "User rejected transaction"
- **Cause**: User cancelled MetaMask transaction
- **Solution**: Try again and approve the transaction

#### "Request not found"
- **Cause**: Wrong request ID
- **Solution**: Use correct request ID from submission

## 📊 Understanding the System

### Roles & Permissions
- **Startup**: Submit certification requests
- **Certifier**: Verify production claims
- **Government**: Mint GHC tokens
- **Admin**: Manage roles and approve amounts

### Token Flow
1. **Submit** → Startup requests certification
2. **Verify** → Certifier validates the claim
3. **Approve** → Admin sets minting amount
4. **Mint** → Government creates GHC tokens
5. **Trade** → Tokens can be transferred/sold

### Gas Fees
- **Sepolia testnet**: Very low fees (0.001-0.01 ETH)
- **Mainnet**: Real ETH fees apply
- **Estimation**: App shows estimated gas before transactions

## 🛠️ Development

### Project Structure
```
rudrakhsha-daiict-web/
├── src/
│   ├── lib/
│   │   └── contract.ts          # Blockchain interactions
│   ├── App.tsx                  # Main application
│   └── HydrogenCreditCertificate.json  # Contract ABI
├── package.json
└── README.md
```

### Key Technologies
- **Frontend**: React.js + TypeScript
- **Blockchain**: Ethereum Sepolia Testnet
- **Smart Contracts**: Solidity + OpenZeppelin
- **Wallet Integration**: MetaMask + Ethers.js

### Building for Production
```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🔗 Useful Links

- **MetaMask**: [metamask.io](https://metamask.io)
- **Sepolia Faucet**: [sepoliafaucet.com](https://sepoliafaucet.com)
- **Sepolia Etherscan**: [sepolia.etherscan.io](https://sepolia.etherscan.io)
- **Remix IDE**: [remix.ethereum.org](https://remix.ethereum.org)
- **OpenZeppelin**: [openzeppelin.com](https://openzeppelin.com)

## 📝 Contract Addresses

**Current Contract**: `0x945399948e25415dB05a30D6e0b4134A1882b303`

**Note**: Update this in `src/lib/contract.ts` if you deploy a new contract.

## 🎉 Success Checklist

- [ ] MetaMask installed and connected
- [ ] Switched to Sepolia testnet
- [ ] Have testnet ETH (0.1+ ETH)
- [ ] Contract deployed and address updated
- [ ] Wallet connected to dApp
- [ ] Submitted certification request
- [ ] Verified request (if certifier)
- [ ] Minted tokens (if government)
- [ ] Viewed all requests

## 🆘 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify you have sufficient Sepolia ETH
3. Ensure contract address is correct
4. Check that you have the required roles
5. Try refreshing the page and reconnecting wallet

---

**Happy Green Hydrogen Credit Trading! 🌱⚡**
