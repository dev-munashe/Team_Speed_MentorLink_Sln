// src/components/Nav.tsx
import { useAppStore } from '../store/useAppStore';
import classNames from 'classnames';

interface NavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Nav({ activeTab, onTabChange }: NavProps) {
  const { resetAll } = useAppStore();

  const tabs = [
    { id: 'upload', label: 'Upload' },
    { id: 'matching', label: 'Matching' },
    { id: 'messages', label: 'Messages' },
    { id: 'tracking', label: 'Tracking' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">Mentor Matcher</h1>
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={classNames(
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                resetAll();
              }
            }}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
          >
            Reset Data
          </button>
        </div>
      </div>
    </nav>
  );
}