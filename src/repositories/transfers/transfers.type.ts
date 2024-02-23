export enum TransferOrigin {
  primary = 'primary',
  reinvest = 'reinvest',
  swapcat = 'swapcat',
  yam = 'yam',
  rmm = 'rmm',
  levinSwap = 'levinSwap',
  levinSwapPool = 'levinSwapPool',
  levinSwapUnknown = 'levinSwapUnknown',
  other = 'other',
}

export enum UserTransferDirection {
  in = 'in',
  out = 'out',
  internal = 'internal',
}

export interface UserRealTokenTransfer {
  id: string
  chainId: number
  realtoken: string
  timestamp: number
  amount: number
  direction: UserTransferDirection
  origin: TransferOrigin
  price: number
  exchangedPrice?: number
  exchangedPoolShare?: number // For liquidity pools
  isPartial?: boolean // Error when fetching all data related to this tx
}

export interface RealTokenTransfer {
  id: string
  chainId: number
  realtoken: string
  from: string
  to: string
  timestamp: number
  amount: number
  origin: TransferOrigin
  exchangedPrice?: number // Real exchanged price on secondary markets
  exchangedPoolShare?: number // For liquidity pools
  isPartial?: boolean // Error when fetching all data related to this tx
}
