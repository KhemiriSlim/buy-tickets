import { createPublicClient, createWalletClient, custom, parseEther } from 'viem'
import { sepolia } from 'viem/chains'

const TREASURY = import.meta.env.VITE_TREASURY_ADDRESS as `0x${string}` | undefined

export async function payForTickets(
  priceEth: string,
  quantity: number
): Promise<`0x${string}`> {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask to pay')
  }
  if (!TREASURY) {
    throw new Error('Treasury address is not configured')
  }

  const transport = custom(window.ethereum)
  const walletClient = createWalletClient({ chain: sepolia, transport })
  const publicClient = createPublicClient({ chain: sepolia, transport })

  try {
    const [account] = await walletClient.requestAddresses()
    await walletClient.switchChain({ id: sepolia.id })

    const hash = await walletClient.sendTransaction({
      account,
      to: TREASURY,
      value: parseEther(priceEth) * BigInt(quantity),
      gas: 250_000n,
    })

    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    if (receipt.status !== 'success') {
      throw new Error(`Payment failed (status: ${receipt.status}, hash: ${hash})`)
    }
    
    return hash
  } catch (error) {
    if (error instanceof Error && /rejected|denied/i.test(error.message)) {
      throw new Error('You cancelled the payment in MetaMask')
    }
    throw error
  }
}