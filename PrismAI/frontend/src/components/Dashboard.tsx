// src/components/Dashboard.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  CreditCard,
  Wallet,
  Plus,
  Filter,
  Search,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SpendingChart } from "./SpendingChart";
import { DailySpendingChart } from "./DailySpendingChart";
import { TransactionList } from "./TransactionList";
import { TransactionInput } from "./TransactionInput";
import { api } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "next-themes";

export const Dashboard = () => {
  const [showTransactionInput, setShowTransactionInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const [stats, setStats] = useState({
    totals: { balance: 0 },
    monthly: { income: 0, expenses: 0, savings: 0 },
    breakdown: {} as Record<string, number>,
  });

  const [transactions, setTransactions] = useState<any[]>([]);
  const [dailySpending, setDailySpending] = useState<
    { date: string; amount: number }[]
  >([]);

  const fetchStats = async () => {
    try {
      const data = await api("/transactions/stats");
      setStats(data);
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await api("/transactions");
      setTransactions(data);

      const spendingMap: Record<string, number> = {};

      data.forEach((tx: any) => {
        if (tx.type === "expense") {
          const date = new Date(tx.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          });
          spendingMap[date] = (spendingMap[date] || 0) + tx.amount;
        }
      });

      const dailyData = Object.entries(spendingMap)
        .map(([date, amount]) => ({ date, amount }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      setDailySpending(dailyData);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchTransactions();
  }, []);

  const handleTransactionSaved = async () => {
    await fetchStats();
    await fetchTransactions();
  };

  const safeNumber = (n: number | undefined) =>
    typeof n === "number" ? n.toLocaleString() : "0";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-background"
      }`}
    >
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-text">PrismAI</span>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="financial"
                onClick={() => setShowTransactionInput(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Transaction
              </Button>
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="text-sm font-medium">
                  {user?.name || "User"}
                </span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-background border-t border-border/50 p-4 space-y-3">
            <Button
              variant="financial"
              onClick={() => {
                setShowTransactionInput(true);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Transaction
            </Button>
            <ThemeToggle />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="text-sm font-medium">
                  {user?.name || "User"}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Balance */}
          <Card className="financial-card group">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-3xl font-bold text-secondary">
                  ₹{safeNumber(stats.totals.balance)}
                </p>
              </div>
              <div className="p-3 bg-gradient-success rounded-lg">
                <Wallet className="h-6 w-6 text-secondary-foreground" />
              </div>
            </div>
          </Card>
          <Card className="financial-card group">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                <p className="text-3xl font-bold text-destructive">
                  ₹{safeNumber(stats.monthly.expenses)}
                </p>
              </div>
              <div className="p-3 bg-destructive/20 rounded-lg">
                <CreditCard className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </Card>
          <Card className="financial-card group">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Monthly Savings</p>
                <p className="text-3xl font-bold text-primary">
                  ₹{safeNumber(stats.monthly.savings)}
                </p>
              </div>
              <div className="p-3 bg-gradient-primary rounded-lg">
                <DollarSign className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 shadow-md rounded-2xl">
            <h3 className="text-xl font-semibold mb-4">Spending Breakdown</h3>
            <SpendingChart breakdown={stats.breakdown} theme={theme} />
          </Card>

          <Card className="p-6 shadow-md rounded-2xl">
            <h3 className="text-xl font-semibold mb-4">Daily Spending</h3>
            <DailySpendingChart data={dailySpending} theme={theme} />
          </Card>
        </div>

        <Card className="financial-card">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-xl font-semibold">Recent Transactions</h3>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-1" /> Filter
                </Button>
              </div>
            </div>
            <TransactionList
              transactions={transactions}
              searchTerm={searchTerm}
              onChange={handleTransactionSaved}
            />
          </div>
        </Card>
      </div>

      {showTransactionInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="p-6 w-full max-w-lg bg-card shadow-lg rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add Transaction</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTransactionInput(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <TransactionInput
              onClose={() => setShowTransactionInput(false)}
              onTransactionSaved={handleTransactionSaved}
            />
          </Card>
        </div>
      )}
    </div>
  );
};
