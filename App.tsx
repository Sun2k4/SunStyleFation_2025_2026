import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { AuthProvider } from './app/AuthContext';
import { CartProvider } from './app/CartContext';
import { AppRoutes } from './components/route/index';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;