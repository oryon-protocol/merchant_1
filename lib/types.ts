// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
}

// Merchant Types
export interface Merchant {
  id: string;
  name: string;
  description: string;
  logo: string;
  heroImage: string;
  category: string;
  pointsMultiplier: number; // How many universal points per IDR spent
  featured?: boolean;
  slug: string;
}

// Product Types
export interface Product {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  sold?: number;
}

// Cart Item
export interface CartItem {
  product: Product;
  quantity: number;
  merchant: Merchant;
}

// Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  pointsEarned: number;
  timestamp: Date;
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
}

// Points Balance
export interface PointsBalance {
  totalPoints: number;
  availablePoints: number;
  redeemedPoints: number;
  transactions: Transaction[];
}
