import { useState } from 'react';
import NavBar from './adapters/ui/NavBar';
import RoutesTab from './adapters/ui/RoutesTab';
import CompareTab from './adapters/ui/CompareTab';
import BankingTab from './adapters/ui/BankingTab';
import PoolingTab from './adapters/ui/PoolingTab';

function App() {
  const [activeTab, setActiveTab] = useState('routes');

  const renderTab = () => {
    switch (activeTab) {
      case 'routes':
        return <RoutesTab />;
      case 'compare':
        return <CompareTab />;
      case 'banking':
        return <BankingTab />;
      case 'pooling':
        return <PoolingTab />;
      default:
        return <RoutesTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto p-4">
        {renderTab()}
      </main>
    </div>
  );
}

export default App;