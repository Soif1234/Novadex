export interface Position {
  id: string;
  market: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  markPrice: number;
  liqPrice: number;
  marginRatio: number;
  margin: number;
  pnl: number;
  pnlPercentage: number;
}

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

export type OrderSide = 'long' | 'short';
export type OrderType = 'market' | 'limit' | 'stop';
