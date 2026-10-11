import { createPublicClient, http, isAddressEqual, isHash } from 'viem'
import type { Address } from 'viem'
import { sepolia } from 'viem/chains'

const rpcUrl = process.env.SEPOLIA_RPC_URL
const treasury = process.env.TREASURY_ADDRESS as Address | undefined

if (!rpcUrl) throw new Error('SEPOLIA_RPC_URL is missing')
if (!treasury) throw new Error('TREASURY_ADDRESS is missing')

const treasuryAddress: Address = treasury

const client = createPublicClient({
  chain: sepolia,
  transport: http(rpcUrl),
})

export class PaymentError extends Error {}

export async function verifyPayment(
  txHash: string,
  expectedWei: bigint
): Promise<Address> {
  if (!isHash(txHash)) {
    throw new PaymentError('Invalid transaction hash')
  }

  const [tx, receipt] = await Promise.all([
    client.getTransaction({ hash: txHash }),
    client.getTransactionReceipt({ hash: txHash }),
  ]).catch(() => {
    throw new PaymentError('Payment not found or not confirmed yet')
  })

  if (receipt.status !== 'success') {
    throw new PaymentError('Transaction failed')
  }
  if (!tx.to || !isAddressEqual(tx.to, treasuryAddress)) {
    throw new PaymentError('Payment was sent to the wrong address')
  }
  if (tx.value < expectedWei) {
    throw new PaymentError('Payment amount is too small')
  }

  return tx.from
}