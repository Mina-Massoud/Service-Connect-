import type { BankAccount, Transaction } from "@/lib/types";

export const walletBalance = {
  available: 432.5,
  pending: 1245.0,
  lifetimeEarnings: 8940.0,
};

export const bankAccounts: BankAccount[] = [
  { id: "ba-1", bankName: "Chase Personal Checking", last4: "4821", primary: true },
  { id: "ba-2", bankName: "Bank of America Savings", last4: "9037", primary: false },
];

export const transactions: Transaction[] = [
  {
    id: "tx-1",
    title: "Sushi Workshop — Session payout",
    subtitle: "Booking #bk-1026",
    amount: 187.0,
    date: "Jun 26, 2026",
    type: "earning",
  },
  {
    id: "tx-2",
    title: "Withdrawal to Chase ••4821",
    subtitle: "Bank transfer",
    amount: -300.0,
    date: "Jun 22, 2026",
    type: "withdrawal",
  },
  {
    id: "tx-3",
    title: "Portrait Photography — Session payout",
    subtitle: "Booking #bk-1027",
    amount: 135.0,
    date: "Jun 17, 2026",
    type: "earning",
  },
  {
    id: "tx-4",
    title: "Platform commission",
    subtitle: "15% service fee",
    amount: -20.25,
    date: "Jun 17, 2026",
    type: "fee",
  },
  {
    id: "tx-5",
    title: "Deep Cleaning — Session payout",
    subtitle: "Booking #bk-1019",
    amount: 68.0,
    date: "Jun 10, 2026",
    type: "earning",
  },
];
