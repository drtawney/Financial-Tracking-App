import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { BudgetWheel } from "./components/BudgetWheel";
import { TransactionList, Transaction } from "./components/TransactionList";
import { AddTransaction } from "./components/AddTransaction";
import { BudgetManager } from "./components/BudgetManager";
import { InventoryManager, InventoryItem } from "./components/InventoryManager";
import { InventoryPreview } from "./components/InventoryPreview";
import { TabNavigation } from "./components/TabNavigation";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Edit, Check, X } from "lucide-react";

// Mock data for demonstration
const initialTransactions: Transaction[] = [
  {
    id: "1",
    description: "Client payment for website development",
    amount: 2500,
    type: "income",
    category: "Business Income",
    date: "2025-09-15"
  },
  {
    id: "2", 
    description: "Office rent for September",
    amount: 800,
    type: "expense",
    category: "Office Supplies",
    date: "2025-09-01"
  },
  {
    id: "3",
    description: "Marketing campaign - Google Ads",
    amount: 350,
    type: "expense", 
    category: "Marketing",
    date: "2025-09-10"
  },
  {
    id: "4",
    description: "Product sales revenue",
    amount: 1200,
    type: "income",
    category: "Business Income",
    date: "2025-09-12"
  },
  {
    id: "5",
    description: "Business insurance premium",
    amount: 150,
    type: "expense",
    category: "Professional Services", 
    date: "2025-09-05"
  }
];

interface BudgetCategory {
  id: string;
  name: string;
  budgetAmount: number;
  color: string;
  type?: 'income' | 'expense';
}

const initialBudgetCategories: BudgetCategory[] = [
  { id: '1', name: 'Equipment', budgetAmount: 2000, color: '#ff6b6b', type: 'expense' },
  { id: '2', name: 'Inventory Purchases', budgetAmount: 1500, color: '#4ecdc4', type: 'expense' },
  { id: '3', name: 'Office Supplies', budgetAmount: 500, color: '#45b7d1', type: 'expense' },
  { id: '4', name: 'Marketing', budgetAmount: 800, color: '#f9ca24', type: 'expense' },
  { id: '5', name: 'Professional Services', budgetAmount: 600, color: '#6c5ce7', type: 'expense' },
  { id: '6', name: 'Business Income', budgetAmount: 5000, color: '#10b981', type: 'income' }
];

const initialInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Business Laptop - MacBook Pro 16"',
    status: 'Not Listed',
    dateBought: '2025-08-15',
    mileage: 25,
    notes: 'Upgraded from previous model, excellent condition',
    locationBought: 'Apple Store Downtown',
    purchasePrice: 2499
  },
  {
    id: '2',
    name: 'Office Desk - Standing Convertible',
    status: 'On Market',
    dateBought: '2025-07-20',
    mileage: 15,
    notes: 'Height adjustable, barely used',
    locationBought: 'IKEA',
    purchasePrice: 399
  },
  {
    id: '3',
    name: 'Professional Camera - Canon EOS R5',
    status: 'Sold',
    dateBought: '2025-06-10',
    dateSold: '2025-09-01',
    mileage: 40,
    notes: 'Used for product photography, excellent condition',
    locationBought: 'B&H Photo',
    locationSold: 'eBay',
    purchasePrice: 3899,
    sellPrice: 3200
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [selectedMonth, setSelectedMonth] = useState('2025-10');
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(initialBudgetCategories);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [businessName, setBusinessName] = useState('Financial Tracker');
  const [isEditingBusinessName, setIsEditingBusinessName] = useState(false);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [transaction, ...prev]);
    setActiveTab('dashboard'); // Navigate back to dashboard after adding
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Calculate dashboard metrics (using all-time totals)
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budgetAmount, 0);
  const monthlyProfit = totalIncome - totalExpenses;
  const transactionCount = transactions.length;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="pb-20">
            <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white p-6 mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  {isEditingBusinessName ? (
                    <div className="flex items-center gap-2 flex-1">

                      <Input
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/70 flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setIsEditingBusinessName(false);
                          if (e.key === 'Escape') setIsEditingBusinessName(false);
                        }}
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditingBusinessName(false)}
                        className="text-white hover:bg-white/20"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold">{businessName}</h1>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditingBusinessName(true)}
                        className="text-white hover:bg-white/20"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-white/90 mt-2">Manage your business finances with style!</p>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/10 rounded-full"></div>
            </div>
            <BudgetWheel
              transactions={transactions}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              monthlyBudget={totalBudget}
            />
            <div className="mt-4">
              <InventoryPreview inventoryItems={inventoryItems} />
            </div>
            <div className="mt-4">
              <TransactionList transactions={transactions.slice(0, 5)} />
            </div>
          </div>
        );
      
      case 'add':
        return (
          <div className="pb-20 pt-6">
            <div className="text-center mb-6 px-6">
              <h2 className="text-xl font-bold text-white mb-2">Add New Transaction</h2>
              <p className="text-white/80">Keep track of every penny!</p>
            </div>
            <AddTransaction 
              onAddTransaction={handleAddTransaction}
              transactions={transactions}
              budgetCategories={budgetCategories}
              selectedMonth={selectedMonth}
            />
          </div>
        );
      
      case 'transactions':
        return (
          <div className="pb-20 pt-6">
            <div className="text-center mb-6 px-6">
              <h2 className="text-xl font-bold text-white mb-2">Transaction History</h2>
              <p className="text-white/80">All your financial records in one place</p>
            </div>
            <TransactionList 
              transactions={transactions} 
              title="All Transactions" 
              onDeleteTransaction={handleDeleteTransaction}
              showDeleteButton={true}
              showExportButton={true}
            />
          </div>
        );
      
      case 'budget':
        return (
          <div className="pb-20 pt-6">
            <div className="text-center mb-6 px-6">
              <h2 className="text-xl font-bold text-white mb-2">Budget Manager</h2>
              <p className="text-white/80">Track your spending against your budget</p>
            </div>
            <BudgetManager 
              transactions={transactions}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              budgetCategories={budgetCategories}
              onUpdateBudgetCategories={setBudgetCategories}
            />
          </div>
        );
      
      case 'inventory':
        return (
          <div className="pb-20 pt-6">
            <div className="text-center mb-6 px-6">
              <h2 className="text-xl font-bold text-white mb-2">Inventory Management</h2>
              <p className="text-white/80">Track your business inventory from purchase to sale</p>
            </div>
            <InventoryManager 
              inventoryItems={inventoryItems}
              onUpdateInventory={setInventoryItems}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderTabContent()}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}