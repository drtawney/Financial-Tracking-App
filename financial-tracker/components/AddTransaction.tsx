/**
 * financial-tracker/components/AddTransaction.tsx
 *
 * A form component used to create and submit new transactions. Supports
 * income and expense types and warns when an expense will exceed the
 * configured budget for a selected category.
 */
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import type { Transaction } from "./TransactionList";

interface BudgetCategory {
  id: string;
  name: string;
  budgetAmount: number;
  color: string;
  type?: 'income' | 'expense';
}

interface AddTransactionProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  transactions: Transaction[];
  budgetCategories: BudgetCategory[];
}

// Single income category - no selection needed
const DEFAULT_INCOME_CATEGORY = "Business Income";

// Removed defaultExpenseCategories - only using budget categories for expenses

/**
 * AddTransaction
 *
 * Renders the transaction entry form and handles validation, budget checks,
 * and submission.
 * @param onAddTransaction - Callback to add a transaction to parent state
 * @param transactions - List of existing transactions used for budget checks
 * @param budgetCategories - List of budget categories for selection and limits
 */
export function AddTransaction({ onAddTransaction, transactions, budgetCategories }: AddTransactionProps) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "" as "income" | "expense" | "",
    category: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [showBudgetWarning, setShowBudgetWarning] = useState(false);
  const [budgetWarningInfo, setBudgetWarningInfo] = useState<{
    overBudgetBy: number;
    categoryName: string;
    newTotal: number;
    budgetAmount: number;
  } | null>(null);

  /**
   * checkBudgetLimit
   *
   * Determine whether adding `amount` to the `category` for the given
   * `transactionDate` month will exceed the configured budget for that category.
   * Returns `true` if it would exceed the budget and sets state for the
   * budget warning display.
   */
  const checkBudgetLimit = (amount: number, category: string, transactionDate: string) => {
    if (!category || amount <= 0) return false;

    const transactionMonth = transactionDate.substring(0, 7);
    const budgetCategory = budgetCategories.find(cat => cat.name === category);
    
    if (!budgetCategory) return false;

    // Calculate current spending for this category in the month
    const currentSpending = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === category && 
        t.date.substring(0, 7) === transactionMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const newTotal = currentSpending + amount;
    
    if (newTotal > budgetCategory.budgetAmount) {
      setBudgetWarningInfo({
        overBudgetBy: newTotal - budgetCategory.budgetAmount,
        categoryName: category,
        newTotal,
        budgetAmount: budgetCategory.budgetAmount
      });
      return true;
    }
    
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For income, category is not required (set automatically)
    if (!formData.description || !formData.amount || !formData.type || 
        (formData.type === 'expense' && !formData.category)) {
      return;
    }

    const amount = parseFloat(formData.amount);

    // Check budget limit for expenses
    if (formData.type === 'expense' && checkBudgetLimit(amount, formData.category, formData.date)) {
      setShowBudgetWarning(true);
      return;
    }

    submitTransaction();
  };

  const submitTransaction = () => {
    const transaction: Omit<Transaction, 'id'> = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type as 'income' | 'expense',
      category: formData.type === 'income' ? DEFAULT_INCOME_CATEGORY : formData.category,
      date: formData.date
    };

    onAddTransaction(transaction);
    
    // Reset form
    setFormData({
      description: "",
      amount: "",
      type: "",
      category: "",
      date: new Date().toISOString().split('T')[0]
    });
    
    setShowBudgetWarning(false);
    setBudgetWarningInfo(null);
  };

  return (
    <Card className="mx-4">

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter transaction description..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({...prev, amount: e.target.value}))}
                className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{ MozAppearance: 'textfield' }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={formData.type} onValueChange={(value: "income" | "expense") => {
              setFormData(prev => ({...prev, type: value, category: ""}));
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === 'expense' && (
            <div className="space-y-2">
              <Label>Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => {
                  setFormData(prev => ({...prev, category: value}));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select expense category" />
                </SelectTrigger>
                <SelectContent>
                  {budgetCategories
                    .filter(cat => cat.type !== 'income')
                    .map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.type === 'income' && (
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <span className="text-gray-700">{DEFAULT_INCOME_CATEGORY}</span>
                <p className="text-xs text-gray-500 mt-1">All income is categorized under business income</p>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium">
            Add Transaction
          </Button>
        </form>

        {/* Budget Warning Dialog */}
        <AlertDialog open={showBudgetWarning} onOpenChange={setShowBudgetWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Budget Limit Warning
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  This expense will put you over budget for <strong>{budgetWarningInfo?.categoryName}</strong>:
                </p>
                <div className="bg-amber-50 p-3 rounded-lg space-y-1">
                  <p>• Budget: ${budgetWarningInfo?.budgetAmount.toLocaleString()}</p>
                  <p>• New Total: ${budgetWarningInfo?.newTotal.toLocaleString()}</p>
                  <p className="font-medium text-amber-700">
                    • Over by: ${budgetWarningInfo?.overBudgetBy.toLocaleString()}
                  </p>
                </div>
                <p>Do you want to add this transaction anyway?</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={submitTransaction} className="bg-amber-600 hover:bg-amber-700">
                Add Anyway
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}