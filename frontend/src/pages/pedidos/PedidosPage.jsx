import { useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, Plus, Search, Send, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import Pagination from '../../components/Pagination.jsx';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../../components/StateBlock.jsx';
import { api, dateTime, documentId, money } from '../../lib/api.js';

const blankItem = {
  produtoId: '',
  quantidade: 1,
};

export default function PedidosPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [orders, setOrders] = useState({ data: [], total: 0 });
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [draftItem, setDraftItem] = useState(blankItem);
  const [cart, setCart] = useState([]);
  const [saving, setSaving] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  const produtosById = useMemo(() => {
    return produtos.reduce((acc, produto) => {
      acc[documentId(produto)] = produto;
      return acc;
    }, {});
  }, [produtos]);

  const totalPedido = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantidade * item.precoUnitario, 0);
  }, [cart]);

  const loadOrders = () => {
    setStatus('loading');
    setError('');

    const loader = activeQuery ? api.searchPedidos(activeQuery) : api.listPedidos(page);

    loader
      .then((payload) => {
        setOrders(payload);
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.message);
        setStatus('error');
      });
  };

  useEffect(() => {
    loadOrders();
  }, [page, activeQuery]);

  useEffect(() => {
    api
      .listClientes(1)
      .then((payload) => setClientes(payload.data || []))
      .catch(() => setClientes([]));
    api
      .listProdutos(1)
      .then((payload) => setProdutos(payload.data || []))
      .catch(() => setProdutos([]));
  }, []);

  const onSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setActiveQuery(query.trim());
  };

  const clearSearch = () => {
    setQuery('');
    setActiveQuery('');
    setPage(1);
  };

  const addItem = () => {
    const produto = produtosById[draftItem.produtoId];
    const quantidade = Number(draftItem.quantidade);

    if (!produto || quantidade < 1) return;

    setCart((current) => {
      const existing = current.find((item) => item.produtoId === draftItem.produtoId);
      if (existing) {
        return current.map((item) =>
          item.produtoId === draftItem.produtoId
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item,
        );
      }

      return [
        ...current,
        {
          produtoId: draftItem.produtoId,
          nome: produto.nome,
          quantidade,
          precoUnitario: Number(produto.preco || 0),
        },
      ];
    });

    setDraftItem(blankItem);
    setCartMessage('');
  };

  const removeItem = (produtoId) => {
    setCart((current) => current.filter((item) => item.produtoId !== produtoId));
  };

  const submitOrder = async () => {
    setCartMessage('');

    if (!clienteId) {
      setCartMessage('Selecione um cliente antes de concluir o pedido.');
      return;
    }

    if (cart.length === 0) {
      setCartMessage('Adicione pelo menos um produto ao carrinho.');
      return;
    }

    setSaving(true);
    try {
      await api.createPedido({
        clienteId,
        itens: cart.map(({ produtoId, quantidade, precoUnitario }) => ({
          produtoId,
          quantidade,
          precoUnitario,
        })),
        totalPedido,
      });

      setClienteId('');
      setCart([]);
      setCartMessage('Pedido criado com sucesso.');
      loadOrders();
    } catch (err) {
      setCartMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!id || !window.confirm('Deseja excluir este pedido?')) return;

    setError('');
    try {
      await api.deletePedido(id);
      loadOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <PageHeader
        title="Pedidos"
        subtitle="Listagem, busca por cliente, criacao e acoes por linha"
        actions={
          <form onSubmit={onSearch} className="flex w-full gap-2 sm:w-auto">
            <input
              className="input min-w-0 sm:w-80"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar pelo nome do cliente"
            />
            <button className="btn btn-primary" type="submit" title="Buscar pedido">
              <Search size={16} aria-hidden="true" />
              Buscar
            </button>
            {activeQuery ? (
              <button className="btn" type="button" onClick={clearSearch} title="Limpar busca">
                <X size={16} aria-hidden="true" />
              </button>
            ) : null}
          </form>
        }
      />

      <div className="grid gap-6">
        <div className="overflow-hidden rounded-md border border-line bg-white">
          {status === 'loading' ? <LoadingBlock /> : null}
          {status === 'error' ? <ErrorBlock message={error} /> : null}
          {status === 'ready' && orders.data.length === 0 ? <EmptyBlock /> : null}
          {status === 'ready' && orders.data.length > 0 ? (
            <div className="divide-y divide-line">
              {orders.data.map((pedido, index) => {
                const id = documentId(pedido);

                return (
                  <article key={`${pedido.id || pedido.clienteNome}-${index}`} className="p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-ink">{pedido.clienteNome || pedido.clienteId}</h3>
                        <p className="text-sm text-slate-500">
                          {pedido.criadoEm ? dateTime(pedido.criadoEm) : 'Pedido sem data informada'}
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        {pedido.totalPedido ? (
                          <span className="text-sm font-semibold text-brand">{money(pedido.totalPedido)}</span>
                        ) : null}
                        <div className="flex flex-wrap gap-2">
                          <Link
                            className="btn h-8 px-2"
                            to={id ? `/pedidos/${id}` : '/pedidos'}
                            title="Ver pedido"
                          >
                            <Eye size={14} aria-hidden="true" />
                            Ver
                          </Link>
                          <Link
                            className="btn h-8 px-2"
                            to={id ? `/pedidos/${id}/editar` : '/pedidos'}
                            title="Editar pedido"
                          >
                            <Pencil size={14} aria-hidden="true" />
                            Editar
                          </Link>
                          <button
                            className="btn h-8 px-2"
                            type="button"
                            onClick={() => onDelete(id)}
                            title="Excluir pedido"
                            disabled={!id}
                          >
                            <Trash2 size={14} aria-hidden="true" />
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>

                    {Array.isArray(pedido.itens) && pedido.itens.length > 0 ? (
                      <div className="mt-3 grid gap-2 sm:grid-cols-1">
                        <details className="group overflow-hidden rounded-md border border-line">
                          <summary className="flex cursor-pointer items-center justify-between bg-slate-50 p-3 font-medium text-ink list-none">
                            <span>Itens do pedido ({pedido.itens.length})</span>
                            <svg
                              className="h-4 w-4 transition-transform group-open:rotate-180"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </summary>

                          <div className="space-y-2 border-t border-line p-3">
                            {pedido.itens.map((item, itemIndex) => (
                              <div
                                key={`${item.produtoNome || item.produtoId}-${itemIndex}`}
                                className="rounded-md border border-line bg-slate-50 p-3"
                              >
                                <p className="text-sm font-medium text-ink">
                                  {item.produtoNome || item.produtoId}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {item.produtoCategoria || 'Categoria nao informada'} · qtd.{' '}
                                  {item.quantidade}
                                </p>
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : null}
          {!activeQuery ? (
            <Pagination
              page={page}
              total={orders.total}
              pageSize={api.pageSize}
              disabled={status === 'loading'}
              onPageChange={setPage}
            />
          ) : null}
        </div>
      </div>
      
      <Link to="/pedidos/novo" className="fab" title="Adicionar pedido">
        <Plus size={20} aria-hidden="true" />
      </Link>
    </section>
  );
}
