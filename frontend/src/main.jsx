import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import { 
  ClienteDetailsPage,
  ClienteFormPage,
  ClientesPage,
} from './pages/clientes';
import {
  ProdutoDetailsPage,
  ProdutoFormPage,
  ProdutosPage,
} from './pages/produtos';
import {
  PedidoDetailsPage,
  PedidoFormPage,
  PedidosPage,
} from './pages/pedidos';
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
          <Route path="/pedidos/novo" element={<PedidoFormPage />} />
          <Route path="/pedidos/:id" element={<PedidoDetailsPage />} />
          <Route path="/pedidos/:id/editar" element={<PedidoFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
