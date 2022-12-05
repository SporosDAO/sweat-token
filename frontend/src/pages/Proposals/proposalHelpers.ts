import { addresses } from '../../constants/addresses'

// PM_CONTRACT has the same deterministic CREATE2 address on all EVMs
const PM_CONTRACT = addresses[5]['extensions']['projectmanagement']

export function knownProposalType({ proposalType, accounts }: { proposalType: string; accounts: any[] }): {
  isKnown: boolean
  label: string
} {
  let isKnown = false
  let label = proposalType
  if (proposalType === 'EXTENSION') {
    if (accounts?.length && accounts[0] === PM_CONTRACT) {
      label = 'NEW PROJECT'
      isKnown = true
    } else {
      label = 'UNKNOWN EXTENSION'
    }
  }
  return { isKnown, label }
}
