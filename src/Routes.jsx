
import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { navItems } from './nav-items';

const Routes = () => {
  return (
    <RouterRoutes>
      {navItems.map(({ to, page }) => (
        <Route key={to} path={to} element={page} />
      ))}
    </RouterRoutes>
  );
};

export default Routes;
