import 'dotenv/config'
import { parseEther } from 'viem'
import { verifyPayment, PaymentError } from './lib/verifyPayment'

const realHash = process.argv[2]
const amountEth = process.argv[3] ?? '0.001'

async function run(label: string, hash: string, eth: string) {
  try {
    const from = await verifyPayment(hash, parseEther(eth))
    console.log(`OK        | ${label}: paid by ${from}`)
  } catch (error) {
    if (error instanceof PaymentError) {
      console.log(`REJECTED  | ${label}: ${error.message}`)
    } else {
      console.log(`ERROR     | ${label}: unexpected failure`, error)
    }
  }
}

async function main() {
  if (!realHash) {
    console.log('Usage: npx tsx src/test-payment.ts <txHash> [amountInEth]')
    return
  }

  await run('real payment', realHash, amountEth)
  await run('amount too high', realHash, '1000')
  await run('random hash', '0x' + '1'.repeat(64), amountEth)
  await run('not a hash', 'abc', amountEth)
}

main()