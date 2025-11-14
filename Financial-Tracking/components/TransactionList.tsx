import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { ArrowUpCircle, ArrowDownCircle, Trash2, Mail } from "lucide-react";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
  onDeleteTransaction?: (id: string) => void;
  showDeleteButton?: boolean;
  showExportButton?: boolean;
}

export function TransactionList({ 
  transactions, 
  title = "Recent Transactions", 
  onDeleteTransaction, 
  showDeleteButton = false,
  showExportButton = false
}: TransactionListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

  const handleExportTransactions = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<transactions_export>
  <exported_at>${new Date().toISOString()}</exported_at>
  <transactions>
${transactions.map(transaction => `    <transaction>
      <id>${transaction.id}</id>
      <description>${transaction.description}</description>
      <amount>${transaction.amount}</amount>
      <type>${transaction.type}</type>
      <category>${transaction.category}</category>
      <date>${transaction.date}</date>
    </transaction>`).join('\n')}
  </transactions>
</transactions_export>`;

    const subject = encodeURIComponent('Transaction History Export - ' + new Date().toLocaleDateString());
    const body = encodeURIComponent('Please find attached transaction history export in XML format:\n\n' + xml);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoLink;
  };

  return (
    <div className="space-y-4">
      <Card className="mx-4">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No transactions yet
            </p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3 flex-1">
                  {transaction.type === 'income' ? (
                    <ArrowUpCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {transaction.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </div>
                  {showDeleteButton && onDeleteTransaction && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteDialogOpen(transaction.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog open={deleteDialogOpen === transaction.id} onOpenChange={(open: boolean) => !open && setDeleteDialogOpen(null)}>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-gray-900">Delete Transaction</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600">
                              Are you sure you want to delete this transaction "{transaction.description}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel 
                              onClick={() => setDeleteDialogOpen(null)}
                              className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                onDeleteTransaction(transaction.id);
                                setDeleteDialogOpen(null);
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      
      {showExportButton && (
        <Card className="mx-4">
          <CardContent className="pt-4">
            <div className="text-center">
              <Button 
                onClick={handleExportTransactions}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                Export Transactions to Email (XML)
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Export all transaction data in XML format via email
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}