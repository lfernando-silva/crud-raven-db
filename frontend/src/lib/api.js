const PAGE_SIZE = 25;

const request = async (path, options = {}) => {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || 'Erro ao comunicar com a API');
  }

  return payload;
};

const params = (values) => {
  const query = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });
  return query.toString();
};

export const api = {
  pageSize: PAGE_SIZE,

  listProdutos: (page = 1, qtd = PAGE_SIZE) =>
    request(`/api/produtos?${params({ qtd, page, orderBy: 'nome:asc' })}`),

  searchProdutos: (nome) => request(`/api/produtos/search?${params({ nome })}`),

  getProduto: (id) => request(`/api/produtos/${id}`),

  createProduto: (produto) =>
    request('/api/produtos', {
      method: 'POST',
      body: JSON.stringify(produto),
    }),

  updateProduto: (id, produto) =>
    request(`/api/produtos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(produto),
    }),

  deleteProduto: (id) =>
    request(`/api/produtos/${id}`, {
      method: 'DELETE',
    }),

  listClientes: (page = 1, qtd = PAGE_SIZE) =>
    request(`/api/clientes?${params({ qtd, page, orderBy: 'nome:asc' })}`),

  searchClientes: (nome) => request(`/api/clientes/search?${params({ nome })}`),

  getCliente: (id) => request(`/api/clientes/${id}`),

  createCliente: (cliente) =>
    request('/api/clientes', {
      method: 'POST',
      body: JSON.stringify(cliente),
    }),

  updateCliente: (id, cliente) =>
    request(`/api/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cliente),
    }),

  deleteCliente: (id) =>
    request(`/api/clientes/${id}`, {
      method: 'DELETE',
    }),

  listPedidos: (page = 1, qtd = PAGE_SIZE) =>
    request(`/api/pedidos?${params({ qtd, page, orderBy: 'criadoEm:desc' })}`),

  searchPedidos: (nome) => request(`/api/pedidos/search?${params({ nome })}`),

  getPedido: (id) => request(`/api/pedidos/${id}`),

  createPedido: (pedido) =>
    request('/api/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedido),
    }),

  updatePedido: (id, pedido) =>
    request(`/api/pedidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pedido),
    }),

  deletePedido: (id) =>
    request(`/api/pedidos/${id}`, {
      method: 'DELETE',
    }),
};

export const money = (value) =>
  Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export const dateTime = (value) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const documentId = (item) => item?.id?.split('/').pop() || item?.id || '';
