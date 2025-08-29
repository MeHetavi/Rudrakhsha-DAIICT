import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { getSigner, submitCertificationRequest, verifyRequest, approveAmount, mintTokens, getRequest, getAllRequests, getMultipleRequests, getTotalRequests, addCertifier, addGovernment, checkRoles, inspectContract } from './lib/contract'

interface Request {
  id: string;
  startup: string;
  reportURI: string;
  requestedAmount: string;
  approvedAmount: string;
  verified: boolean;
  minted: boolean;
  timestamp: string;
  adminNotes: string;
}

function App() {
  const [account, setAccount] = useState<string | null>(null)
  const [network, setNetwork] = useState<string>("")
  const [reportURI, setReportURI] = useState<string>("")
  const [amount, setAmount] = useState<string>("1")
  const [requestId, setRequestId] = useState<string>("")
  const [approvedAmount, setApprovedAmount] = useState<string>("")
  const [adminNotes, setAdminNotes] = useState<string>("")
  const [txHash, setTxHash] = useState<string>("")
  const [busy, setBusy] = useState<boolean>(false)
  const [requests, setRequests] = useState<Request[]>([])
  const [contractInfo, setContractInfo] = useState<string>("")
  const [requestDetails, setRequestDetails] = useState<string>("")
  const [roleInfo, setRoleInfo] = useState<string>("")
  const [totalRequests, setTotalRequests] = useState<string>("0")
  const sepoliaChainId = useMemo(() => '0xaa36a7', []) // 11155111

  const connect = useCallback(async () => {
    try {
      setBusy(true)
      const signer = await getSigner()
      const addr = await signer.getAddress()
      setAccount(addr)
      // @ts-expect-error ethereum injected
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      setNetwork(chainId)
    } catch (e: any) {
      alert(e?.message ?? 'Failed to connect')
    } finally {
      setBusy(false)
    }
  }, [])

  const onInspectContract = useCallback(async () => {
    try {
      setBusy(true)
      const info = await inspectContract()
      setContractInfo(`Contract: ${info.address}\nFunctions: ${info.functions.join(', ')}`)
      console.log("Contract inspection result:", info)
    } catch (e: any) {
      alert(e?.message ?? 'Failed to inspect contract')
    } finally {
      setBusy(false)
    }
  }, [])

  const onCheckRoles = useCallback(async () => {
    if (!account) return
    try {
      setBusy(true)
      const roles = await checkRoles(account)
      setRoleInfo(`Your Roles:\nAdmin: ${roles.admin ? '✅' : '❌'}\nCertifier: ${roles.certifier ? '✅' : '❌'}\nGovernment: ${roles.government ? '✅' : '❌'}`)
      console.log("Role check result:", roles)
    } catch (e: any) {
      alert(e?.message ?? 'Failed to check roles')
    } finally {
      setBusy(false)
    }
  }, [account])

  const onLoadAllRequests = useCallback(async () => {
    try {
      setBusy(true)
      const total = await getTotalRequests()
      setTotalRequests(total.toString())
      
      if (total > 0) {
        const allIds = await getAllRequests()
        console.log("All request IDs:", allIds)
        
        // Instead of using getMultipleRequests, let's get each request individually
        // This avoids the array processing issues
        const formattedRequests: Request[] = []
        
        for (let i = 0; i < allIds.length; i++) {
          try {
            const requestData = await getRequest(allIds[i])
            console.log(`Request ${i} data:`, requestData)
            
            formattedRequests.push({
              id: allIds[i].toString(),
              startup: requestData[0],
              reportURI: requestData[1],
              requestedAmount: requestData[2].toString(),
              approvedAmount: requestData[3].toString(),
              verified: requestData[4],
              minted: requestData[5],
              timestamp: new Date(Number(requestData[6]) * 1000).toLocaleString(),
              adminNotes: requestData[7]
            })
          } catch (error) {
            console.error(`Failed to get request ${i}:`, error)
            // Add a placeholder for failed requests
            formattedRequests.push({
              id: allIds[i].toString(),
              startup: "Error loading",
              reportURI: "Error loading",
              requestedAmount: "0",
              approvedAmount: "0",
              verified: false,
              minted: false,
              timestamp: "Error loading",
              adminNotes: "Error loading"
            })
          }
        }
        
        setRequests(formattedRequests)
      }
    } catch (e: any) {
      console.error("Error in onLoadAllRequests:", e)
      alert(e?.message ?? 'Failed to load requests')
    } finally {
      setBusy(false)
    }
  }, [])

  const onAddCertifier = useCallback(async () => {
    if (!account) return
    try {
      setBusy(true)
      const hash = await addCertifier(account)
      setTxHash(hash)
      alert('✅ Added yourself as Certifier! Now you can verify requests.')
    } catch (e: any) {
      alert(e?.message ?? 'Failed to add certifier')
    } finally {
      setBusy(false)
    }
  }, [account])

  const onAddGovernment = useCallback(async () => {
    if (!account) return
    try {
      setBusy(true)
      const hash = await addGovernment(account)
      setTxHash(hash)
      alert('✅ Added yourself as Government! Now you can mint tokens.')
    } catch (e: any) {
      alert(e?.message ?? 'Failed to add government')
    } finally {
      setBusy(false)
    }
  }, [account])

  const onGetRequest = useCallback(async () => {
    if (!requestId) return
    try {
      setBusy(true)
      const details = await getRequest(BigInt(requestId))
      setRequestDetails(`Startup: ${details[0]}\nReport URI: ${details[1]}\nRequested Amount: ${details[2]}\nApproved Amount: ${details[3]}\nVerified: ${details[4]}\nMinted: ${details[5]}\nTimestamp: ${new Date(Number(details[6]) * 1000).toLocaleString()}\nAdmin Notes: ${details[7]}`)
    } catch (e: any) {
      alert(e?.message ?? 'Failed to get request details')
    } finally {
      setBusy(false)
    }
  }, [requestId])

  const onApproveAmount = useCallback(async () => {
    if (!requestId || !approvedAmount) return
    try {
      setBusy(true)
      const hash = await approveAmount(BigInt(requestId), parseInt(approvedAmount), adminNotes)
      setTxHash(hash)
      alert('✅ Amount approved! Now the request can be minted.')
      // Reload requests after approval
      setTimeout(() => onLoadAllRequests(), 2000)
    } catch (e: any) {
      alert(e?.message ?? 'Failed to approve amount')
    } finally {
      setBusy(false)
    }
  }, [requestId, approvedAmount, adminNotes, onLoadAllRequests])

  const loadMyRequests = useCallback(async () => {
    if (!account) return
    try {
      await onLoadAllRequests()
    } catch (e) {
      console.log("Could not load requests yet:", e)
    }
  }, [account, onLoadAllRequests])

  useEffect(() => {
    // @ts-expect-error ethereum injected
    if (window.ethereum) {
      // @ts-expect-error ethereum injected
      window.ethereum.on('accountsChanged', (accs: string[]) => setAccount(accs?.[0] ?? null))
      // @ts-expect-error ethereum injected
      window.ethereum.on('chainChanged', (cid: string) => setNetwork(cid))
    }
  }, [])

  useEffect(() => {
    if (account) {
      loadMyRequests()
    }
  }, [account, loadMyRequests])

  const onSubmit = useCallback(async () => {
    try {
      setBusy(true)
      const amountNum = parseInt(amount)
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error("Amount must be a positive number")
      }
      const hash = await submitCertificationRequest(reportURI, amountNum)
      setTxHash(hash)
      alert('✅ Certification request submitted! Check the transaction to find your Request ID.')
      // Reload requests after submission
      setTimeout(() => loadMyRequests(), 2000)
    } catch (e: any) {
      alert(e?.message ?? 'Transaction failed')
    } finally {
      setBusy(false)
    }
  }, [reportURI, amount, loadMyRequests])

  const onVerify = useCallback(async () => {
    try {
      setBusy(true)
      const hash = await verifyRequest(BigInt(requestId))
      setTxHash(hash)
      alert('✅ Request verified!')
      // Reload requests after verification
      setTimeout(() => loadMyRequests(), 2000)
    } catch (e: any) {
      alert(e?.message ?? 'Transaction failed')
    } finally {
      setBusy(false)
    }
  }, [requestId, loadMyRequests])

  const onMint = useCallback(async () => {
    try {
      setBusy(true)
      const hash = await mintTokens(BigInt(requestId))
      setTxHash(hash)
      alert('✅ Tokens minted!')
      // Reload requests after minting
      setTimeout(() => loadMyRequests(), 2000)
    } catch (e: any) {
      alert(e?.message ?? 'Transaction failed')
    } finally {
      setBusy(false)
    }
  }, [requestId, loadMyRequests])

  const wrongNetwork = network && network.toLowerCase() !== sepoliaChainId

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', padding: 16 }}>
      <h1>Green Hydrogen Credits (Sepolia)</h1>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick={connect} disabled={busy}>
          {account ? 'Connected' : 'Connect Wallet'}
        </button>
        <span>{account ? account : 'Not connected'}</span>
        {network && <span>Chain: {network}</span>}
        {wrongNetwork && <span style={{ color: 'orangered' }}>Switch to Sepolia</span>}
      </div>

      <hr style={{ margin: '24px 0' }} />

      {account && (
        <section style={{ display: 'grid', gap: 12 }}>
          <h2>Debug Contract</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onInspectContract} disabled={busy || wrongNetwork}>
              🔍 Inspect Contract Functions
            </button>
            <button onClick={onCheckRoles} disabled={busy || wrongNetwork}>
              👤 Check My Roles
            </button>
            <button onClick={onLoadAllRequests} disabled={busy || wrongNetwork}>
              📋 Load All Requests
            </button>
          </div>
          {contractInfo && (
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: 8, 
              padding: 16, 
              backgroundColor: '#f9f9f9',
              whiteSpace: 'pre-line',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              {contractInfo}
            </div>
          )}
          {roleInfo && (
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: 8, 
              padding: 16, 
              backgroundColor: '#f0f8ff',
              whiteSpace: 'pre-line',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              {roleInfo}
            </div>
          )}
        </section>
      )}

      <hr style={{ margin: '24px 0' }} />

      {account && (
        <section style={{ display: 'grid', gap: 12 }}>
          <h2>Role Management (Contract Deployer Only)</h2>
          <p style={{ fontSize: '14px', color: '#666' }}>
            💡 If you're the contract deployer, add yourself as certifier and government to verify/mint
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onAddCertifier} disabled={busy || wrongNetwork}>
              🔐 Add Self as Certifier
            </button>
            <button onClick={onAddGovernment} disabled={busy || wrongNetwork}>
              🏛️ Add Self as Government
            </button>
          </div>
        </section>
      )}

      <hr style={{ margin: '24px 0' }} />

      <section style={{ display: 'grid', gap: 12 }}>
        <h2>Submit Certification Request</h2>
        <input
          placeholder="Report URI (IPFS hash or URL)"
          value={reportURI}
          onChange={(e) => setReportURI(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount of tokens requested (e.g., 1)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
        />
        <button onClick={onSubmit} disabled={!reportURI || !amount || busy || wrongNetwork}>Submit</button>
        <p style={{ fontSize: '14px', color: '#666' }}>
          💡 After submitting, check the transaction to find your Request ID
        </p>
      </section>

      <hr style={{ margin: '24px 0' }} />

      {account && (
        <section style={{ display: 'grid', gap: 12 }}>
          <h2>All Requests ({totalRequests})</h2>
          {requests.length > 0 ? (
            <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, maxHeight: '400px', overflowY: 'auto' }}>
              {requests.map((req) => (
                <div key={req.id} style={{ 
                  padding: '16px', 
                  borderBottom: '1px solid #eee', 
                  backgroundColor: req.minted ? '#e8f5e8' : req.verified ? '#fff3cd' : '#f8f9fa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong>ID: {req.id}</strong>
                    <span style={{ 
                      color: req.minted ? 'green' : req.verified ? 'orange' : 'gray',
                      fontWeight: 'bold'
                    }}>
                      {req.minted ? '✅ Minted' : req.verified ? '🔍 Verified' : '📝 Pending'}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                    <div><strong>Startup:</strong> {req.startup}</div>
                    <div><strong>Report URI:</strong> {req.reportURI}</div>
                    <div><strong>Requested:</strong> {req.requestedAmount} GHC</div>
                    <div><strong>Approved:</strong> {req.approvedAmount === '0' ? 'Not approved' : `${req.approvedAmount} GHC`}</div>
                    <div><strong>Timestamp:</strong> {req.timestamp}</div>
                    {req.adminNotes && <div><strong>Admin Notes:</strong> {req.adminNotes}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No requests found. Submit one above or click "Load All Requests"!</p>
          )}
        </section>
      )}

      <hr style={{ margin: '24px 0' }} />

      <section style={{ display: 'grid', gap: 12 }}>
        <h2>Admin Amount Approval</h2>
        <input
          placeholder="Request ID"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Approved amount (can be different from requested)"
          value={approvedAmount}
          onChange={(e) => setApprovedAmount(e.target.value)}
          min="1"
        />
        <input
          placeholder="Admin notes (optional)"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
        />
        <button onClick={onApproveAmount} disabled={!requestId || !approvedAmount || busy || wrongNetwork}>
          ✅ Approve Amount
        </button>
        <p style={{ fontSize: '14px', color: '#666' }}>
          💡 Admin can approve a different amount than what was requested
        </p>
      </section>

      <hr style={{ margin: '24px 0' }} />

      <section style={{ display: 'grid', gap: 12 }}>
        <h2>Verify & Mint</h2>
        <input
          placeholder="Request ID (from your submitted transaction)"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onVerify} disabled={!requestId || busy || wrongNetwork}>Verify</button>
          <button onClick={onMint} disabled={!requestId || busy || wrongNetwork}>Mint Tokens</button>
          <button onClick={onGetRequest} disabled={!requestId || busy || wrongNetwork}>Get Details</button>
        </div>
        {requestDetails && (
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: 8, 
            padding: 16, 
            backgroundColor: '#f9f9f9',
            whiteSpace: 'pre-line',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>
            {requestDetails}
          </div>
        )}
        <p style={{ fontSize: '14px', color: '#666' }}>
          💡 Use the Request ID from your submitted transaction
        </p>
      </section>

      {txHash && (
        <p>
          Last tx: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">{txHash}</a>
        </p>
      )}

      <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        <h3>Enhanced Workflow:</h3>
        <ol style={{ textAlign: 'left' }}>
          <li><strong>Startup submits request</strong> with desired amount</li>
          <li><strong>Admin approves amount</strong> (can be different from requested)</li>
          <li><strong>Certifier verifies</strong> the request</li>
          <li><strong>Government mints</strong> the approved amount</li>
          <li><strong>Admin can view all requests</strong> and manage the process</li>
        </ol>
      </div>
    </div>
  )
}

export default App
