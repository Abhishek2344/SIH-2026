import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/public/LandingPage';
import { TransparencyPage } from './pages/public/TransparencyPage';
import { VerifyTransactionPage } from './pages/public/VerifyTransactionPage';
import { TechnologyPage } from './pages/public/TechnologyPage';
import { LoginPage } from './pages/auth/LoginPage';
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { SlotBookingPage } from './pages/farmer/SlotBookingPage';
import { QueueStatusPage } from './pages/farmer/QueueStatusPage';
import { FarmerStocksPage } from './pages/farmer/FarmerStocksPage';
import { FarmerTransactionsPage } from './pages/farmer/FarmerTransactionsPage';
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { CentreOperatorDashboard } from './pages/centre/CentreOperatorDashboard';
import { MinistryDashboard } from './pages/ministry/MinistryDashboard';
import { DocaIntelligencePage } from './pages/doca/DocaIntelligencePage';
import { DistrictAuthorityPage } from './pages/district/DistrictAuthorityPage';
import { ComplaintModal } from './components/complaint/ComplaintModal';

const AppContent: React.FC = () => {
  const { currentRole, isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);

  // Render current tab page
  const renderContent = () => {
    switch (activeTab) {
      // Public Pages
      case 'landing':
        return <LandingPage setActiveTab={setActiveTab} />;
      case 'public-verify':
        return <VerifyTransactionPage />;
      case 'public-transparency':
        return <TransparencyPage />;
      case 'public-technology':
        return <TechnologyPage />;
      case 'auth-login':
        return <LoginPage onSuccess={() => {}} setActiveTab={setActiveTab} />;

      // Farmer Pages
      case 'farmer-dashboard':
        return <FarmerDashboard setActiveTab={setActiveTab} />;
      case 'farmer-book-slot':
        return <SlotBookingPage setActiveTab={setActiveTab} />;
      case 'farmer-queue':
        return <QueueStatusPage />;
      case 'farmer-stocks':
        return <FarmerStocksPage />;
      case 'farmer-transactions':
        return <FarmerTransactionsPage setActiveTab={setActiveTab} />;
      case 'farmer-grievance':
        return (
          <div className="py-8">
            <FarmerDashboard setActiveTab={setActiveTab} />
            <ComplaintModal onClose={() => setActiveTab('farmer-dashboard')} />
          </div>
        );

      // Vendor Pages
      case 'vendor-dashboard':
      case 'vendor-market':
      case 'vendor-requests':
      case 'vendor-prices':
        return <VendorDashboard />;

      // Procurement Centre Pages
      case 'centre-dashboard':
      case 'centre-queue-mgmt':
      case 'centre-intake':
      case 'centre-transactions':
        return <CentreOperatorDashboard setActiveTab={setActiveTab} />;

      // District Authority Pages
      case 'district-dashboard':
      case 'district-centres':
      case 'district-grievances':
      case 'district-audit':
        return <DistrictAuthorityPage />;

      // Ministry Pages
      case 'ministry-dashboard':
      case 'ministry-stocks':
      case 'ministry-alerts':
      case 'ministry-audit':
        return <MinistryDashboard setActiveTab={setActiveTab} />;

      // DoCA Module
      case 'doca-intelligence':
        return <DocaIntelligencePage />;

      default:
        return <LandingPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans">
      {/* Universal National Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Routed Content Area */}
      <main className="flex-1">{renderContent()}</main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Global Grievance Modal when triggered */}
      {showGrievanceModal && (
        <ComplaintModal onClose={() => setShowGrievanceModal(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
