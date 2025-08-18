const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="bg-white">
      <div className="max-w-screen mx-auto px-4 md:px-12 py-2">
        <nav className="flex gap-6 border-1 border-gray-200 rounded-md shadow-xs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;