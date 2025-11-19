/**
 * components/BudgetManager.tsx
 *
 * Budget manager view for listing, editing and creating budget categories.
 * Shows monthly totals, progress bars per category and provides controls to
 * add, edit, and delete categories. Uses `transactions` and `selectedMonth`
 * to compute month-specific metrics.
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Edit, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Transaction } from "./TransactionList";

interface BudgetCategory {
  id: string;
  name: string;
  budgetAmount: number;
  color: string;
  type?: 'income' | 'expense';
}

interface BudgetManagerProps {
  transactions: Transaction[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  budgetCategories: BudgetCategory[];
  onUpdateBudgetCategories: (categories: BudgetCategory[]) => void;
}

const months = [
  "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
  "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12",
  "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
  "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12",
  "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06",
  "2026-07", "2026-08", "2026-09", "2026-10", "2026-11", "2026-12"
];

/**
 * BudgetManager
 *
 * Main component for budget management. Displays income targets and
 * expense budgets for the selected month and allows CRUD operations on
 * budget categories.
 */
export function BudgetManager({ 
  transactions, 
  selectedMonth, 
  onMonthChange, 
  budgetCategories, 
  onUpdateBudgetCategories 
}: BudgetManagerProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryBudget, setNewCategoryBudget] = useState("");
  const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense'>('expense');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

  // Filter transactions by selected month
  const monthlyTransactions = transactions.filter(t => {
    const transactionMonth = t.date.substring(0, 7);
    return transactionMonth === selectedMonth;
  });

  // Calculate all-time totals to match dashboard
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budgetAmount, 0);

  // Split budget categories by type
  const expenseBudgetCategories = budgetCategories.filter(cat => cat.type !== 'income');
  const incomeBudgetCategories = budgetCategories.filter(cat => cat.type === 'income');

  // Filter expense transactions for category calculations
  const monthlyExpenseTransactions = monthlyTransactions.filter(t => t.type === 'expense');
  const monthlyIncomeTransactions = monthlyTransactions.filter(t => t.type === 'income');

  // Calculate spending by expense category for the selected month
  const expenseCategorySpending = expenseBudgetCategories.map(category => {
    const spent = monthlyExpenseTransactions
      .filter(t => t.category === category.name)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const percentage = category.budgetAmount > 0 ? (spent / category.budgetAmount) * 100 : 0;
    
    return {
      ...category,
      spent,
      percentage: Math.min(percentage, 100),
      isOverBudget: spent > category.budgetAmount
    };
  });

  // Calculate income by category for the selected month
  const incomeCategoryActual = incomeBudgetCategories.map(category => {
    const earned = monthlyIncomeTransactions
      .filter(t => t.category === category.name)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const percentage = category.budgetAmount > 0 ? (earned / category.budgetAmount) * 100 : 0;
    
    return {
      ...category,
      spent: earned, // Using 'spent' field for consistency but it represents earned income
      percentage: Math.min(percentage, 100),
      isOverBudget: earned < category.budgetAmount // For income, "over budget" means under target
    };
  });

  const handleSaveCategory = () => {
    if (!newCategoryName || !newCategoryBudget) return;

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8', '#00b894', '#e17055'];
    
    if (editingCategory) {
      // Update existing category
      const updatedCategories = budgetCategories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: newCategoryName, budgetAmount: parseFloat(newCategoryBudget), type: newCategoryType }
          : cat
      );
      onUpdateBudgetCategories(updatedCategories);
    } else {
      // Add new category
      const newCategory: BudgetCategory = {
        id: Date.now().toString(),
        name: newCategoryName,
        budgetAmount: parseFloat(newCategoryBudget),
        color: colors[budgetCategories.length % colors.length],
        type: newCategoryType
      };
      onUpdateBudgetCategories([...budgetCategories, newCategory]);
    }

    setNewCategoryName("");
    setNewCategoryBudget("");
    setNewCategoryType('expense');
    setEditingCategory(null);
    setIsEditDialogOpen(false);
  };

  const handleEditCategory = (category: BudgetCategory) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryBudget(category.budgetAmount.toString());
    setNewCategoryType(category.type || 'expense');
    setIsEditDialogOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    onUpdateBudgetCategories(budgetCategories.filter(cat => cat.id !== categoryId));
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    setNewCategoryBudget("");
    setNewCategoryType('expense');
    setIsEditDialogOpen(true);
  };

  const currentMonthIndex = months.indexOf(selectedMonth);
  const canGoPrevious = currentMonthIndex > 0;
  const canGoNext = currentMonthIndex < months.length - 1;

  const getMonthName = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="space-y-4 p-4">
      {/* Total Summary */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-lg font-semibold text-green-600">${totalIncome.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-lg font-semibold text-blue-600">${totalBudget.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-lg font-semibold text-red-600">${totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Month Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Budget Overview</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => canGoPrevious && onMonthChange(months[currentMonthIndex - 1])}
                disabled={!canGoPrevious}
                className="border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Select value={selectedMonth} onValueChange={onMonthChange}>
                <SelectTrigger className="min-w-[140px] border-gray-400 text-gray-700">
                  <SelectValue>{getMonthName(selectedMonth)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {getMonthName(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => canGoNext && onMonthChange(months[currentMonthIndex + 1])}
                disabled={!canGoNext}
                className="border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Track your spending against budget categories
            </p>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  onClick={handleAddNew}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Budget
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">
                    {editingCategory ? 'Edit Budget Category' : 'Add Budget Category'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    {editingCategory 
                      ? 'Update the details for this budget category.' 
                      : 'Create a new budget category to track your expenses.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700">Category Type</Label>
                    <Select value={newCategoryType} onValueChange={(value: 'income' | 'expense') => setNewCategoryType(value)}>
                      <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense">Expense Budget</SelectItem>
                        <SelectItem value="income">Income Target</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-700">Category Name</Label>
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder={newCategoryType === 'expense' ? "e.g., Equipment, Inventory, Office Supplies" : "e.g., Service Income, Product Sales"}
                      className="bg-white text-gray-900 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">
                      {newCategoryType === 'expense' ? 'Monthly Budget Amount' : 'Monthly Income Target'}
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newCategoryBudget}
                      onChange={(e) => setNewCategoryBudget(e.target.value)}
                      placeholder="0.00"
                      className="bg-white text-gray-900 border-gray-300 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ MozAppearance: 'textfield' }}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditDialogOpen(false)}
                      className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveCategory}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {editingCategory ? 'Update' : 'Add'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Income Budget Categories */}
      {incomeBudgetCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Income Targets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incomeCategoryActual.map((category) => (
                <Card key={`income-${category.id}-${selectedMonth}-${category.spent}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{category.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          category.isOverBudget ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          ${category.spent.toLocaleString()} / ${category.budgetAmount.toLocaleString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteDialogOpen(category.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Progress 
                        value={category.percentage} 
                        className="h-3"
                      />
                      <div 
                        className="absolute inset-0 h-3 rounded-full opacity-20"
                        style={{ backgroundColor: category.color }}
                      />
                      <div 
                        className="absolute inset-y-0 left-0 h-3 rounded-full transition-all"
                        style={{ 
                          backgroundColor: category.isOverBudget ? '#f59e0b' : category.color,
                          width: `${Math.min(category.percentage, 100)}%`
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">
                        {category.percentage.toFixed(1)}% of target
                      </span>
                      {category.isOverBudget && (
                        <span className="text-xs text-orange-600 font-medium">
                          ${(category.budgetAmount - category.spent).toLocaleString()} below target
                        </span>
                      )}
                      {!category.isOverBudget && (
                        <span className="text-xs text-green-600 font-medium">
                          Target achieved! +${(category.spent - category.budgetAmount).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expense Budget Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expense Budgets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenseCategorySpending.map((category) => (
              <Card key={`expense-${category.id}-${selectedMonth}-${category.spent}`}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{category.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        category.isOverBudget ? 'text-red-600' : 'text-gray-700'
                      }`}>
                        ${category.spent.toLocaleString()} / ${category.budgetAmount.toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteDialogOpen(category.id)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Progress 
                      value={category.percentage} 
                      className="h-3"
                    />
                    <div 
                      className="absolute inset-0 h-3 rounded-full opacity-20"
                      style={{ backgroundColor: category.color }}
                    />
                    <div 
                      className="absolute inset-y-0 left-0 h-3 rounded-full transition-all"
                      style={{ 
                        backgroundColor: category.isOverBudget ? '#ef4444' : category.color,
                        width: `${Math.min(category.percentage, 100)}%`
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      {category.percentage.toFixed(1)}% used
                    </span>
                    {category.isOverBudget && (
                      <span className="text-xs text-red-600 font-medium">
                        ${(category.spent - category.budgetAmount).toLocaleString()} over budget!
                      </span>
                    )}
                    {!category.isOverBudget && (
                      <span className="text-xs text-gray-500">
                        ${(category.budgetAmount - category.spent).toLocaleString()} remaining
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {expenseBudgetCategories.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500 mb-4">No budget categories yet</p>
                  <Button onClick={handleAddNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Budget Category
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controlled Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen !== null} onOpenChange={(open: boolean) => !open && setDeleteDialogOpen(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Budget Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this budget category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteDialogOpen) {
                  handleDeleteCategory(deleteDialogOpen);
                  setDeleteDialogOpen(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}