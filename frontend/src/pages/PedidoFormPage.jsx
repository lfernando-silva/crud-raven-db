import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { ErrorBlock, LoadingBlock } from '../components/StateBlock.jsx';
import { api, documentId, money } from '../lib/api.js';

const blankItem = {
  produtoId: '',
  quantidade: 1,
};

export default function PedidoFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [draftItem, setDraftItem] = useState(blankItem);
  const [items, setItems] = useState([]);

  const produtosById = useMemo(() => {
    return produtos.reduce((acc, produto) => {
      acc[documentId(produto)] = produto;
      return acc;
    }, {});
  }, [produtos]);

  const totalPedido = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantidade * item.precoUnitario, 0);
  }, [items]);

  useEffect(() => {
    let alive = true;
    setStatus('loading');
    setError('');

    Promise.all([api.getPedido(id), api.listClientes(1), api.listProdutos(1)])
      .then(([pedidoPayload, clientesPayload, produtosPayload]) => {
        if (!alive) return;

        const pedido = pedidoPayload?.data || {};
        const loadedProdutos = produtosPayload?.data || [];

        const mappedItems = (pedido.itens || []).map((item) => {
          const produtoId = item.produtoId || item.id || '';
          const produtoFromCatalog = loadedProdutos.find((produto) => documentId(produto) === produtoId);
          const precoUnitario = Number(
            item.precoUnitario ?? produtoFromCatalog?.preco ?? 0,
          );

          return {
            produtoId,
            nome: item.produtoNome || produtoFromCatalog?.nome || produtoId,
            quantidade: Number(item.quantidade || 1),
            precoUnitario,
          };
        });

        setClientes(clientesPayload?.data || []);
        setProdutos(loadedProdutos);
        setClienteId(pedido.clienteId || '');
        setItems(mappedItems);
        setStatus('ready');
      })
      .catch((err) => {
        if (!alive) return;
        setError(err.message);
        setStatus('error');
      });

    return () => {
      alive = false;
    };
  }, [id]);

  const addItem = () => {
    setError('');
    const produto = produtosById[draftItem.produtoId];
    const quantidade = Number(draftItem.quantidade);

    if (!produto || quantidade < 1) {
      setError('Selecione um produto e informe quantidade valida.');
      return;
    }

    setItems((current) => {
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
  };

  const removeItem = (produtoId) => {
    setItems((current) => current.filter((item) => item.produtoId !== produtoId));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!clienteId) {
      setError('Selecione um cliente para atualizar o pedido.');
      return;
    }

    if (items.length === 0) {
      setError('Adicione pelo menos um item no pedido.');
      return;
    }

    setSaving(true);
    try {
      await api.updatePedido(id, {
        clienteId,
        itens: items.map(({ produtoId, quantidade, precoUnitario }) => ({
          produtoId,
          quantidade,
          precoUnitario,
        })),
        totalPedido,
      });
      navigate('/pedidos');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <PageHeader
        title="Editar pedido"
        subtitle="Atualize cliente, itens e total"
        actions={
          <Link to="/pedidos" className="btn" title="Voltar para pedidos">
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar
          </Link>
        }
      />

      <div className="overflow-hidden rounded-md border border-line bg-white">
        {status === 'loading' ? <LoadingBlock /> : null}
        {status === 'error' ? <ErrorBlock message={error} /> : null}

        {status === 'ready' ? (
          <form onSubmit={onSubmit} className="grid gap-4 p-4">
            <div>
              <label className="label" htmlFor="clienteId">
                Cliente
              </label>
              <select
                id="clienteId"
                className="input mt-1"
                value={clienteId}
                onChange={(event) => setClienteId(event.target.value)}
              >
                <option value="">Selecione</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={documentId(cliente)}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_90px_auto] gap-2">
              <div>
                <label className="label" htmlFor="produtoId">
                  Produto
                </label>
                <select
                  id="produtoId"
                  className="input mt-1"
                  value={draftItem.produtoId}
                  onChange={(event) =>
                    setDraftItem((current) => ({ ...current, produtoId: event.target.value }))
                  }
                >
                  <option value="">Selecione</option>
                  {produtos.map((produto) => (
                    <option key={produto.id} value={documentId(produto)}>
                      {produto.nome} · {money(produto.preco)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" htmlFor="quantidade">
                  Qtd.
                </label>
                <input
                  id="quantidade"
                  className="input mt-1"
                  type="number"
                  min="1"
                  value={draftItem.quantidade}
                  onChange={(event) =>
                    setDraftItem((current) => ({ ...current, quantidade: event.target.value }))
                  }
                />
              </div>

              <button className="btn mt-6" type="button" onClick={addItem} title="Adicionar item">
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-x-auto rounded-md border border-line">
              <table className="w-full min-w-[620px] border-collapse">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="table-cell">Produto</th>
                    <th className="table-cell">Qtd.</th>
                    <th className="table-cell">Preco unit.</th>
                    <th className="table-cell">Subtotal</th>
                    <th className="table-cell">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.produtoId} className="hover:bg-slate-50">
                      <td className="table-cell text-slate-700">{item.nome}</td>
                      <td className="table-cell text-slate-700">{item.quantidade}</td>
                      <td className="table-cell text-slate-700">{money(item.precoUnitario)}</td>
                      <td className="table-cell font-semibold text-slate-700">
                        {money(item.quantidade * item.precoUnitario)}
                      </td>
                      <td className="table-cell">
                        <button
                          type="button"
                          className="btn h-8 px-2"
                          onClick={() => removeItem(item.produtoId)}
                          title="Remover item"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between rounded-md bg-slate-50 px-4 py-3">
              <span className="text-sm font-medium text-slate-700">Total do pedido</span>
              <strong className="text-lg text-ink">{money(totalPedido)}</strong>
            </div>

            {error ? <p className="text-sm text-red-700">{error}</p> : null}

            <div className="flex justify-end">
              <button className="btn btn-primary" type="submit" disabled={saving}>
                <Save size={16} aria-hidden="true" />
                {saving ? 'Salvando...' : 'Salvar alteracoes'}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </section>
  );
}
