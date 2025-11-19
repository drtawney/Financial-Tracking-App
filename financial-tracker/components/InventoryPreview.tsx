/**
 * financial-tracker/components/InventoryPreview.tsx
 *
 * Small preview card that surfaces recent inventory activity and quick
 * stats such as total items, total value, and profit. Used on the
 * dashboard view for a concise snapshot.
 */
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Package, TrendingUp, TrendingDown } from "lucide-react";
import type { InventoryItem } from "./InventoryManager";

interface InventoryPreviewProps {
  inventoryItems: InventoryItem[];
}

/**
 * InventoryPreview
 *
 * Renders a compact preview of recent inventory items and summary
 * statistics. Does not mutate data; read-only display component.
 * @param inventoryItems - List of inventory items to preview
 */
export function InventoryPreview({ inventoryItems }: InventoryPreviewProps) {
  // Sort by most recent changes (bought or sold date)
  const recentItems = inventoryItems
    .sort((a, b) => {
      const aDate = a.dateSold || a.dateBought;
      const bDate = b.dateSold || b.dateBought;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    })
    .slice(0, 3);

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'Not Listed': return 'bg-gray-100 text-gray-800';
      case 'On Market': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Sold': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalValue = inventoryItems.reduce((sum, item) => sum + item.purchasePrice, 0);
  const soldItems = inventoryItems.filter(item => item.status === 'Sold');
  const totalProfit = soldItems.reduce((sum, item) => 
    sum + ((item.sellPrice || 0) - item.purchasePrice), 0
  );

  if (inventoryItems.length === 0) {
    return (
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            No inventory items yet. Start tracking your business inventory!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Inventory Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-lg font-semibold text-blue-600">{inventoryItems.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-lg font-semibold text-purple-600">${totalValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Profit</p>
            <p className={`text-lg font-semibold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${totalProfit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Recent Items */}
        <div>
          <h4 className="font-medium mb-2">Recent Activity</h4>
          <div className="space-y-2">
            {recentItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {item.dateSold ? 
                        `Sold: ${new Date(item.dateSold).toLocaleDateString()}` :
                        `Bought: ${new Date(item.dateBought).toLocaleDateString()}`
                      }
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">
                    ${item.sellPrice || item.purchasePrice}
                  </div>
                  {item.sellPrice && (
                    <div className={`text-xs flex items-center gap-1 ${
                      item.sellPrice > item.purchasePrice ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.sellPrice > item.purchasePrice ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {item.sellPrice > item.purchasePrice ? '+' : ''}${(item.sellPrice - item.purchasePrice).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}