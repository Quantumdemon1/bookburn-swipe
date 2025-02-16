
import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import { navItems } from './nav-items';
import { CartProvider } from './contexts/CartContext';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/login" element={<Login />} />
      <Route element={<CartProvider><Layout /></CartProvider>}>
        {navItems.map(({ to, page }) => (
          <Route key={to} path={to} element={page} />
        ))}
      </Route>
    </RouterRoutes>
  );
};

export default Routes;
