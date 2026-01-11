import { Navigate, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import InventoryPage from './pages/InventoryPage';
import LoginPage from './pages/LoginPage';
import PlanPage from './pages/PlanPage';
import RecipesPage from './pages/RecipesPage';
import SettingsPage from './pages/SettingsPage';
import ShoppingPage from './pages/ShoppingPage';

const App = () => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Fridge Planner</h1>
          <p className="muted">Inventaire, péremption, recettes, menus.</p>
        </div>
      </header>
      <Navigation />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/inventory" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/shopping" element={<ShoppingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
