import { useState } from 'react';
import { Layout } from './components/Layout';
import { UploadPage } from './pages/UploadPage';
import { MatchingPage } from './pages/MatchingPage';
import { MessagesPage } from './pages/MessagesPage';
import { TrackingPage } from './pages/TrackingPage';

function App() {
  const [activeTab, setActiveTab] = useState('upload');

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'upload':
        return <UploadPage onNext={() => setActiveTab('matching')} />;
      case 'matching':
        return <MatchingPage />;
      case 'messages':
        return <MessagesPage />;
      case 'tracking':
        return <TrackingPage />;
      default:
        return <UploadPage onNext={() => setActiveTab('matching')} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;
