import type { BankAccount, Transaction } from "@/lib/types";

export const walletBalance = {
  available: 0,
  pending: 0,
  lifetimeEarnings: 0,
};

export const bankAccounts: BankAccount[] = [
  { id: "ba-1", bankName: "Chase Personal Checking", last4: "4821", primary: true },
  { id: "ba-2", bankName: "Bank of America Savings", last4: "9037", primary: false },
];

// Fresh account — no earnings yet. Payouts appear here as sessions complete.
export const transactions: Transaction[] = [];
