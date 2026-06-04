import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import ClientesPage from './pages/ClientesPage.jsx';
import ClienteDetailsPage from './pages/ClienteDetailsPage.jsx';
import ClienteFormPage from './pages/ClienteFormPage.jsx';
import PedidosPage from './pages/PedidosPage.jsx';
import PedidoDetailsPage from './pages/PedidoDetailsPage.jsx';
import PedidoFormPage from './pages/PedidoFormPage.jsx';
import ProdutosPage from './pages/ProdutosPage.jsx';
import ProdutoDetailsPage from './pages/ProdutoDetailsPage.jsx';
import ProdutoFormPage from './pages/ProdutoFormPage.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Navigate to="/produtos" replace />} />

          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/produtos/novo" element={<ProdutoFormPage />} />
          <Route path="/produtos/:id" element={<ProdutoDetailsPage />} />
          <Route path="/produtos/:id/editar" element={<ProdutoFormPage />} />

          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/clientes/novo" element={<ClienteFormPage />} />
          <Route path="/clientes/:id" element={<ClienteDetailsPage />} />
          <Route path="/clientes/:id/editar" element={<ClienteFormPage />} />

          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/pedidos/:id" element={<PedidoDetailsPage />} />
          <Route path="/pedidos/:id/editar" element={<PedidoFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
