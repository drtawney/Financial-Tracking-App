import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Plus, Trash2, Edit, Calendar, MapPin, Truck, Mail } from "lucide-react";

export interface InventoryItem {
  id: string;
  name: string;
  status: 'Not Listed' | 'On Market' | 'Pending' | 'Sold';
  dateBought: string;
  dateSold?: string;
  mileage: number;
  notes: string;
  locationBought: string;
  locationSold?: string;
  purchasePrice: number;
  sellPrice?: number;
}

interface InventoryManagerProps {
  inventoryItems: InventoryItem[];
  onUpdateInventory: (items: InventoryItem[]) => void;
}

export function InventoryManager({ inventoryItems, onUpdateInventory }: InventoryManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "Not Listed" as InventoryItem['status'],
    dateBought: new Date().toISOString().split('T')[0],
    dateSold: "",
    mileage: "",
    notes: "",
    locationBought: "",
    locationSold: "",
    purchasePrice: "",
    sellPrice: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      status: "Not Listed",
      dateBought: new Date().toISOString().split('T')[0],
      dateSold: "",
      mileage: "",
      notes: "",
      locationBought: "",
      locationSold: "",
      purchasePrice: "",
      sellPrice: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.purchasePrice) {
      return;
    }

    // Auto-set sold date to today if status is "Sold" and no date provided
    const soldDate = formData.status === 'Sold' && !formData.dateSold 
      ? new Date().toISOString().split('T')[0] 
      : formData.dateSold || undefined;

    const itemData: InventoryItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name,
      status: formData.status,
      dateBought: formData.dateBought,
      dateSold: soldDate,
      mileage: parseFloat(formData.mileage) || 0,
      notes: formData.notes,
      locationBought: formData.locationBought,
      locationSold: formData.locationSold || undefined,
      purchasePrice: parseFloat(formData.purchasePrice),
      sellPrice: formData.sellPrice ? parseFloat(formData.sellPrice) : undefined
    };

    if (editingItem) {
      onUpdateInventory(inventoryItems.map(item => 
        item.id === editingItem.id ? itemData : item
      ));
    } else {
      onUpdateInventory([...inventoryItems, itemData]);
    }

    resetForm();
    setEditingItem(null);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      status: item.status,
      dateBought: item.dateBought,
      dateSold: item.dateSold || "",
      mileage: item.mileage.toString(),
      notes: item.notes,
      locationBought: item.locationBought,
      locationSold: item.locationSold || "",
      purchasePrice: item.purchasePrice.toString(),
      sellPrice: item.sellPrice?.toString() || ""
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (item: InventoryItem) => {
    onUpdateInventory(inventoryItems.filter(i => i.id !== item.id));
    setDeleteDialogOpen(null);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    resetForm();
    setIsAddDialogOpen(true);
  };

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'Not Listed': return 'bg-gray-100 text-gray-800';
      case 'On Market': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Sold': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportInventory = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<inventory_export>
  <exported_at>${new Date().toISOString()}</exported_at>
  <items>
${inventoryItems.map(item => `    <item>
      <id>${item.id}</id>
      <name>${item.name}</name>
      <status>${item.status}</status>
      <date_bought>${item.dateBought}</date_bought>
      ${item.dateSold ? `<date_sold>${item.dateSold}</date_sold>` : ''}
      <mileage>${item.mileage}</mileage>
      <notes>${item.notes}</notes>
      <location_bought>${item.locationBought}</location_bought>
      ${item.locationSold ? `<location_sold>${item.locationSold}</location_sold>` : ''}
      <purchase_price>${item.purchasePrice}</purchase_price>
      ${item.sellPrice ? `<sell_price>${item.sellPrice}</sell_price>` : ''}
    </item>`).join('\n')}
  </items>
</inventory_export>`;

    const subject = encodeURIComponent('Inventory Export - ' + new Date().toLocaleDateString());
    const body = encodeURIComponent('Please find attached inventory export in XML format:\n\n' + xml);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoLink;
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Inventory Management</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Track your business inventory from purchase to sale
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">
                    {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    {editingItem 
                      ? 'Update the details for this inventory item.' 
                      : 'Add a new item to your inventory tracking system.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label className="text-gray-700">Item Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                        placeholder="Enter item name"
                        className="bg-white text-gray-900 border-gray-300"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label className="text-gray-700">Status</Label>
                      <Select value={formData.status} onValueChange={(value: InventoryItem['status']) => 
                        setFormData(prev => ({...prev, status: value}))
                      }>
                        <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not Listed">Not Listed</SelectItem>
                          <SelectItem value="On Market">On Market</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Sold">Sold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-gray-700">Purchase Price *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.purchasePrice}
                        onChange={(e) => setFormData(prev => ({...prev, purchasePrice: e.target.value}))}
                        placeholder="0.00"
                        className="bg-white text-gray-900 border-gray-300"
                        style={{ 
                          MozAppearance: 'textfield',
                          WebkitAppearance: 'none',
                          appearance: 'none'
                        } as React.CSSProperties}
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-gray-700">Date Bought</Label>
                      <Input
                        type="date"
                        value={formData.dateBought}
                        onChange={(e) => setFormData(prev => ({...prev, dateBought: e.target.value}))}
                        className="bg-white text-gray-900 border-gray-300"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-700">Date Sold</Label>
                      <Input
                        type="date"
                        value={formData.dateSold}
                        onChange={(e) => setFormData(prev => ({...prev, dateSold: e.target.value}))}
                        className="bg-white text-gray-900 border-gray-300"
                        disabled={formData.status !== 'Sold'}
                      />
                    </div>

                    <div>
                      <Label className="text-gray-700">Sell Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.sellPrice}
                        onChange={(e) => setFormData(prev => ({...prev, sellPrice: e.target.value}))}
                        placeholder="0.00"
                        className="bg-white text-gray-900 border-gray-300"
                        style={{ 
                          MozAppearance: 'textfield',
                          WebkitAppearance: 'none',
                          appearance: 'none'
                        } as React.CSSProperties}
                        disabled={formData.status !== 'Sold'}
                      />
                    </div>

                    <div>
                      <Label className="text-gray-700">Mileage</Label>
                      <Input
                        type="number"
                        value={formData.mileage}
                        onChange={(e) => setFormData(prev => ({...prev, mileage: e.target.value}))}
                        placeholder="0"
                        className="bg-white text-gray-900 border-gray-300"
                        style={{ 
                          MozAppearance: 'textfield',
                          WebkitAppearance: 'none',
                          appearance: 'none'
                        } as React.CSSProperties}
                      />
                    </div>

                    <div>
                      <Label className="text-gray-700">Location Bought</Label>
                      <Input
                        value={formData.locationBought}
                        onChange={(e) => setFormData(prev => ({...prev, locationBought: e.target.value}))}
                        placeholder="Enter purchase location"
                        className="bg-white text-gray-900 border-gray-300"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-700">Location Sold</Label>
                      <Input
                        value={formData.locationSold}
                        onChange={(e) => setFormData(prev => ({...prev, locationSold: e.target.value}))}
                        placeholder="Enter sale location"
                        className="bg-white text-gray-900 border-gray-300"
                        disabled={formData.status !== 'Sold'}
                      />
                    </div>

                    <div className="col-span-2">
                      <Label className="text-gray-700">Notes</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                        placeholder="Additional notes about this item..."
                        className="bg-white text-gray-900 border-gray-300"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                      className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {editingItem ? 'Update' : 'Add'} Item
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Inventory Summary */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-lg font-semibold text-blue-600">{inventoryItems.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">On Market</p>
              <p className="text-lg font-semibold text-orange-600">
                {inventoryItems.filter(item => item.status === 'On Market').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sold</p>
              <p className="text-lg font-semibold text-green-600">
                {inventoryItems.filter(item => item.status === 'Sold').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-lg font-semibold text-purple-600">
                ${inventoryItems.reduce((sum, item) => sum + item.purchasePrice, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {inventoryItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No inventory items yet</p>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Item
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="space-y-2 p-4">
                {inventoryItems.map((item) => (
                  <Card key={item.id} className="border-l-4" style={{ borderLeftColor: 
                    item.status === 'Sold' ? '#10b981' : 
                    item.status === 'On Market' ? '#f59e0b' : 
                    item.status === 'Pending' ? '#eab308' : '#6b7280' 
                  }}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">Bought: {new Date(item.dateBought).toLocaleDateString()}</span>
                            </div>
                            
                            {item.dateSold && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-green-500" />
                                <span className="text-gray-600">Sold: {new Date(item.dateSold).toLocaleDateString()}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1">
                              <Truck className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">Mileage: {item.mileage} mi</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">Bought at: {item.locationBought}</span>
                            </div>

                            {item.locationSold && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-green-500" />
                                <span className="text-gray-600">Sold at: {item.locationSold}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                            <span className="text-gray-600 font-medium">Purchase: ${item.purchasePrice.toLocaleString()}</span>
                            {item.sellPrice && (
                              <span className="text-green-600 font-medium">Sale: ${item.sellPrice.toLocaleString()}</span>
                            )}
                            {item.sellPrice && (
                              <span className={`font-medium ${
                                item.sellPrice > item.purchasePrice ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {item.sellPrice > item.purchasePrice ? 'Profit' : 'Loss'}: ${Math.abs(item.sellPrice - item.purchasePrice).toLocaleString()}
                              </span>
                            )}
                          </div>

                          {item.notes && (
                            <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                              <span className="text-gray-500 font-medium">Notes: </span>
                              <span className="text-gray-700">{item.notes}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteDialogOpen(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Button */}
      <Card>
        <CardContent className="pt-4">
          <div className="text-center">
            <Button 
              onClick={handleExportInventory}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Mail className="h-4 w-4 mr-2" />
              Export Inventory to Email (XML)
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Export all inventory data in XML format via email
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Controlled Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen !== null} onOpenChange={(open: boolean) => !open && setDeleteDialogOpen(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Delete Inventory Item</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to delete "{inventoryItems.find(item => item.id === deleteDialogOpen)?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const itemToDelete = inventoryItems.find(item => item.id === deleteDialogOpen);
                if (itemToDelete) {
                  handleDelete(itemToDelete);
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