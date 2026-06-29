"use client";

import { useState } from "react";
import {
  Building2,
  Plus,
  TrendingUp,
  ArrowUpRight,
  Minus,
  ShieldCheck,
} from "lucide-react";
import { Screen } from "@/components/phone";
import { ScreenHeader } from "@/components/phone/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { WithdrawalDialogs } from "@/components/account/WithdrawalDialogs";
import { useWallet, useActions } from "@/lib/store";
import type { TransactionType } from "@/lib/types";

function TransactionIcon({ type }: { type: TransactionType }) {
  if (type === "earning") {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-soft">
        <TrendingUp className="h-4 w-4 text-success" />
      </div>
    );
  }
  if (type === "withdrawal") {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft">
        <ArrowUpRight className="h-4 w-4 text-accent-foreground" />
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
      <Minus className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

function amountClass(type: TransactionType): string {
  if (type === "earning" || type === "refund") return "text-success font-semibold";
  return "font-semibold text-foreground";
}

function formatAmount(amount: number): string {
  const sign = amount >= 0 ? "+" : "−";
  return `${sign}$${Math.abs(amount).toFixed(2)}`;
}

export default function WalletPage() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [addBankOpen, setAddBankOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [bankName, setBankName] = useState("");
  const [last4, setLast4] = useState("");

  const { available, pending, lifetime, transactions, banks } = useWallet();
  const actions = useActions();

  function handleAddBank() {
    if (!bankName.trim() || last4.length !== 4) return;
    actions.addBank({ bankName: bankName.trim(), last4 });
    setBankName("");
    setLast4("");
    setAddBankOpen(false);
  }

  function handleAddBankOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setBankName("");
      setLast4("");
    }
    setAddBankOpen(nextOpen);
  }

  return (
    <Screen
      header={<ScreenHeader title="Wallet" showBack={false} />}
      activeTab="wallet"
    >
      {/* ── Balance hero card ── */}
      <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 p-5 text-white shadow-md">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-blue-100">
          Available Balance
        </p>
        <p className="mb-4 text-4xl font-bold tracking-tight">
          ${available.toFixed(2)}
        </p>

        <div className="mb-4 flex gap-6">
          <div>
            <p className="text-[11px] text-blue-200">Pending</p>
            <p className="text-base font-semibold">
              ${pending.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-blue-200">Lifetime Earned</p>
            <p className="text-base font-semibold">
              ${lifetime.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/15 px-3 py-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-white">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Provider Status
          </span>
          <span className="rounded-full bg-success px-2 py-0.5 text-[10px] font-bold text-white">
            Active
          </span>
        </div>
      </div>

      {/* ── Bank Accounts ── */}
      <div className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Bank Accounts</h2>
          <button
            type="button"
            aria-label="Add new bank account"
            onClick={() => setAddBankOpen(true)}
            className="flex items-center gap-1 text-xs font-semibold text-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            Add New
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {banks.map((account, idx) => (
            <div
              key={account.id}
              className={`flex items-center gap-3 px-4 py-3 ${
                idx < banks.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {account.bankName}
                </p>
                <p className="text-xs text-muted-foreground">
                  ••••{account.last4}
                </p>
              </div>
              {account.primary && (
                <Badge variant="default" className="text-[10px]">
                  Primary
                </Badge>
              )}
            </div>
          ))}

          <button
            type="button"
            aria-label="Add bank account"
            onClick={() => setAddBankOpen(true)}
            className="flex w-full items-center gap-3 border-t border-border px-4 py-3 transition-colors hover:bg-muted"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-border">
              <Plus className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Add bank account
            </p>
          </button>
        </div>
      </div>

      {/* ── Request Withdrawal CTA ── */}
      <Button
        className="mb-6 h-12 w-full rounded-xl text-base font-semibold"
        onClick={() => setWithdrawOpen(true)}
      >
        <ArrowUpRight className="mr-1.5 h-5 w-5" />
        Request Withdrawal
      </Button>

      {/* ── Activity History ── */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Activity History</h2>
        {transactions.length > 4 && (
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="text-xs font-semibold text-primary"
          >
            {showAll ? "Show less" : "View All"}
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {transactions.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            No transactions yet.
          </p>
        )}
        {(showAll ? transactions : transactions.slice(0, 4)).map((tx, idx, list) => (
          <div
            key={tx.id}
            className={`flex items-center gap-3 px-4 py-3 ${
              idx < list.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <TransactionIcon type={tx.type} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {tx.title}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {tx.date} · {tx.subtitle}
              </p>
            </div>
            <span className={`shrink-0 text-sm ${amountClass(tx.type)}`}>
              {formatAmount(tx.amount)}
            </span>
          </div>
        ))}
      </div>

      {/* ── Escrow info banner ── */}
      <div className="mt-4 rounded-2xl bg-brand-soft p-4">
        <p className="mb-1 text-xs font-semibold text-accent-foreground">
          How Escrow Works
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Payment is held securely by ServiceConnect. Funds are released to you
          after session completion, unless a dispute is raised by either party.
        </p>
      </div>

      {/* ── Withdrawal dialogs ── */}
      <WithdrawalDialogs
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
      />

      {/* ── Add bank account dialog ── */}
      <Dialog open={addBankOpen} onOpenChange={handleAddBankOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Bank Account</DialogTitle>
            <DialogDescription>
              Enter your bank details to add a new withdrawal account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="add-bank-name">Bank Name</Label>
              <Input
                id="add-bank-name"
                type="text"
                placeholder="e.g. Chase, Bank of America"
                value={bankName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBankName(e.target.value)
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-bank-last4">Last 4 Digits</Label>
              <Input
                id="add-bank-last4"
                type="text"
                inputMode="numeric"
                placeholder="1234"
                maxLength={4}
                value={last4}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLast4(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              className="h-10 w-full rounded-xl font-semibold"
              disabled={!bankName.trim() || last4.length !== 4}
              onClick={handleAddBank}
            >
              Add Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Screen>
  );
}
