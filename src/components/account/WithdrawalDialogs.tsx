"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useWallet, useActions } from "@/lib/store";

interface WithdrawalDialogsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawalDialogs({ open, onOpenChange }: WithdrawalDialogsProps) {
  const { available, banks } = useWallet();
  const actions = useActions();

  const [amount, setAmount] = useState("");
  const [selectedBankId, setSelectedBankId] = useState("");
  const [confirmedOpen, setConfirmedOpen] = useState(false);

  const parsedAmount = parseFloat(amount);
  const isValid =
    amount.trim() !== "" &&
    !isNaN(parsedAmount) &&
    parsedAmount > 0 &&
    parsedAmount <= available &&
    selectedBankId !== "";

  function handleConfirm() {
    if (!isValid) return;
    actions.requestWithdrawal(parsedAmount, selectedBankId);
    onOpenChange(false);
    setAmount("");
    setSelectedBankId("");
    setConfirmedOpen(true);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setAmount("");
      setSelectedBankId("");
    }
    onOpenChange(nextOpen);
  }

  return (
    <>
      {/* ── Request Withdrawal dialog ── */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Withdrawal</DialogTitle>
            <DialogDescription>
              Transfer funds to your bank account. Processing takes 1–3
              business days.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            {/* Amount field */}
            <div className="space-y-1.5">
              <Label htmlFor="withdraw-amount">Amount (USD)</Label>
              <Input
                id="withdraw-amount"
                type="text"
                inputMode="decimal"
                placeholder={`Max $${available.toFixed(2)}`}
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAmount(e.target.value)
                }
              />
              {amount.trim() !== "" &&
                !isNaN(parsedAmount) &&
                parsedAmount > available && (
                  <p className="text-xs text-destructive">
                    Amount exceeds your available balance of $
                    {available.toFixed(2)}.
                  </p>
                )}
            </div>

            {/* Bank selector */}
            {banks.length > 0 && (
              <div className="space-y-1.5">
                <Label htmlFor="withdraw-bank">Bank Account</Label>
                <div className="flex flex-col gap-2" role="radiogroup" aria-label="Select bank account">
                  {banks.map((bank) => {
                    const active = selectedBankId === bank.id;
                    return (
                      <button
                        key={bank.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setSelectedBankId(bank.id)}
                        className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                          active
                            ? "border-primary bg-brand-soft"
                            : "border-border bg-card hover:border-primary/40"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                            active ? "bg-primary/10" : "bg-muted"
                          }`}
                        >
                          <Building2
                            className={`h-4 w-4 ${
                              active ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-medium ${
                              active ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {bank.bankName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ••••{bank.last4}
                            {bank.primary && " · Primary"}
                          </p>
                        </div>
                        <span
                          className={`h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
                            active
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              className="h-10 w-full rounded-xl font-semibold"
              disabled={!isValid}
              onClick={handleConfirm}
            >
              Confirm Withdrawal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Withdrawal confirmed dialog ── */}
      <Dialog open={confirmedOpen} onOpenChange={setConfirmedOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Withdrawal Requested</DialogTitle>
            <DialogDescription>
              Your withdrawal is being processed and will arrive in 1–3
              business days.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="h-10 w-full rounded-xl font-semibold"
              onClick={() => setConfirmedOpen(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
