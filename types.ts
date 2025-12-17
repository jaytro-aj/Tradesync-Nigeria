export enum TransactionStatus {
  PENDING = 'PENDING',
  LOCKED = 'LOCKED', // In Escrow
  RELEASED = 'RELEASED', // Paid to merchant
  CANCELLED = 'CANCELLED'
}

export interface Transaction {
  id: string;
  counterparty: string;
  amount: number;
  description: string;
  status: TransactionStatus;
  date: string;
  type: 'incoming' | 'outgoing';
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  lastSynced?: string;
}

export interface Rider {
  id: string;
  name: string;
  rating: number;
  vehicle: 'bike' | 'van' | 'truck';
  distance: string; // e.g., "1.2 km"
  verified: boolean;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ESCROW = 'ESCROW',
  LOGISTICS = 'LOGISTICS',
  INVENTORY = 'INVENTORY',
  AI_ADVISOR = 'AI_ADVISOR'
}

export interface ChartData {
  name: string;
  value: number;
}