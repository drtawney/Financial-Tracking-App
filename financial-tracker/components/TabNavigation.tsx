/**
 * financial-tracker/components/TabNavigation.tsx
 *
 * Bottom tab navigation used across the app to switch between main views
 * such as Dashboard, Add Transaction, Transactions history, Budget, and Inventory.
 */
import { Target, Home, Plus, List, Package } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * TabNavigation
 *
 * Renders the bottom fixed tab bar. Calls `onTabChange` when a tab is selected.
 * @param activeTab - Currently active tab id
 * @param onTabChange - Callback to change the active tab
 */
export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'add', label: 'Add', icon: Plus },
    { id: 'transactions', label: 'History', icon: List },
    { id: 'budget', label: 'Budget', icon: Target },
    { id: 'inventory', label: 'Inventory', icon: Package }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-3 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 min-w-0 relative group ${
                isActive 
                  ? 'text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 hover:scale-105'
              }`}
              style={{ 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                willChange: 'transform'
              }}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs mt-1 truncate max-w-[60px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}