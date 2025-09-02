import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface TransactionInputProps {
  onClose: () => void;
  onTransactionSaved: () => void; // ✅ new prop
}

export const TransactionInput = ({
  onClose,
  onTransactionSaved,
}: TransactionInputProps) => {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedTransaction, setParsedTransaction] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // today's local date as YYYY-MM-DD
  const todayYMD = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const normalizeDate = (dateStr?: string) => {
    if (!dateStr) return "";
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [dd, mm, yyyy] = dateStr.split("-").map(Number);
      const d = new Date(yyyy, mm - 1, dd);
      if (isNaN(d.getTime())) return "";
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const sanitizeOrToday = (ymd: string) => {
    const m = ymd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return todayYMD();
    const year = Number(m[1]);
    const currentYear = new Date().getFullYear();
    if (year < currentYear - 2 || year > currentYear + 2) return todayYMD();
    return ymd;
  };

  const handleParseTransaction = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();
      const safeDate = sanitizeOrToday(normalizeDate(data?.date) || "");

      setParsedTransaction({
        ...data,
        date: safeDate || todayYMD(),
      });
    } catch (err) {
      console.error("Error parsing transaction:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!parsedTransaction || isSaving) return;
    setIsSaving(true);

    try {
      const safeDate =
        sanitizeOrToday(normalizeDate(parsedTransaction.date) || "") ||
        todayYMD();

      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          ...parsedTransaction,
          date: safeDate,
        }),
      });

      const data = await res.json();
      console.log("Transaction saved:", data);

      // ✅ update dashboard immediately
      onTransactionSaved();
      onClose();
    } catch (err) {
      console.error("Error saving transaction:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="financial-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">AI Transaction Parser</h2>
                <p className="text-sm text-muted-foreground">
                  Describe your transaction in natural language
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          {/* Input */}
          <div className="space-y-4">
            <label className="text-sm font-medium">What did you spend money on?</label>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., 'Bought coffee at Starbucks for ₹499'"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleParseTransaction();
                  }
                }}
              />
              <Button
                type="button"
                variant="financial"
                onClick={handleParseTransaction}
                disabled={!input.trim() || isProcessing}
              >
                {isProcessing ? "Processing..." : "Parse"}
              </Button>
            </div>
          </div>

          {/* Parsed Result */}
          {parsedTransaction && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <h3 className="font-semibold">AI Analysis Complete</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {Math.round((parsedTransaction.confidence ?? 0) * 100)}% confident
                  </Badge>
                </div>

                {/* Editable fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <Input
                      value={parsedTransaction.description}
                      onChange={(e) =>
                        setParsedTransaction({ ...parsedTransaction, description: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Amount</label>
                    <Input
                      type="number"
                      value={parsedTransaction.amount}
                      onChange={(e) =>
                        setParsedTransaction({ ...parsedTransaction, amount: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <Input
                      value={parsedTransaction.category}
                      onChange={(e) =>
                        setParsedTransaction({ ...parsedTransaction, category: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <Input
                      type="date"
                      value={parsedTransaction.date || todayYMD()}
                      onChange={(e) =>
                        setParsedTransaction({
                          ...parsedTransaction,
                          date: sanitizeOrToday(normalizeDate(e.target.value) || "") || todayYMD(),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="financial"
                    onClick={handleConfirm}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? "Saving..." : "Confirm & Save Transaction"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setParsedTransaction(null)}>
                    Edit Input
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
