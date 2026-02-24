import type { FC, ReactNode } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import AIOutfitAssistant from '../components/user/AIOutfitAssistant';

const MainLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-white relative">
        {children}
      </main>
      <Footer />
      {/* Global Floating Chatbot for Users */}
      <AIOutfitAssistant />
    </div>
  );
};

export default MainLayout;