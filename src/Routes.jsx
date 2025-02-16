import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import { navItems } from './nav-items';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        {navItems.map(({ to, page }) => (
          <Route key={to} path={to} element={page} />
        ))}
      </Route>
    </RouterRoutes>
  );
};

export default Routes;
