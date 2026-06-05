import { useEffect, useState } from 'react';
import { Eye, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import Pagination from '../../components/Pagination.jsx';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../../components/StateBlock.jsx';
import { api, documentId, money } from '../../lib/api.js';

export default function ProdutosPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [result, setResult] = useState({ data: [], total: 0 });
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const loadProdutos = () => {
    setStatus('loading');
    setError('');

    const loader = activeQuery ? api.searchProdutos(activeQuery) : api.listProdutos(page);

    loader
      .then((payload) => {
        setResult(payload);
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.message);
        setStatus('error');
      });
  };

  useEffect(() => {
    loadProdutos();
  }, [page, activeQuery]);

  const onSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setActiveQuery(query.trim());
  };

  const clearSearch = () => {
    setQuery('');
    setActiveQuery('');
    setPage(1);
  };

  const onDelete = async (id) => {
    if (!window.confirm('Deseja excluir este produto?')) return;

    setError('');
    try {
      await api.deleteProduto(id);
      loadProdutos();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <PageHeader
        title="Produtos"
        subtitle="Listagem paginada com busca por nome e acoes por linha"
        actions={
          <form onSubmit={onSubmit} className="flex w-full gap-2 sm:w-auto">
            <input
              className="input min-w-0 sm:w-72"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar produto"
            />
            <button className="btn btn-primary" type="submit" title="Buscar produto">
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

      <div className="overflow-hidden rounded-md border border-line bg-white">
        {status === 'loading' ? <LoadingBlock /> : null}
        {status === 'error' ? <ErrorBlock message={error} /> : null}
        {status === 'ready' && result.data.length === 0 ? <EmptyBlock /> : null}
        {status === 'ready' && result.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] border-collapse">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="table-cell">Produto</th>
                  <th className="table-cell">Categoria</th>
                  <th className="table-cell">Preco</th>
                  <th className="table-cell">ID</th>
                  <th className="table-cell">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((produto) => {
                  const id = documentId(produto);

                  return (
                    <tr key={produto.id} className="hover:bg-slate-50">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          {produto.imagem ? (
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={produto.imagem}
                              alt=""
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-slate-100" />
                          )}
                          <span className="font-medium text-ink">{produto.nome}</span>
                        </div>
                      </td>
                      <td className="table-cell text-slate-600">{produto.categoria || '-'}</td>
                      <td className="table-cell font-medium">{money(produto.preco)}</td>
                      <td className="table-cell font-mono text-xs text-slate-500">{id}</td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <Link className="btn h-8 px-2" to={`/produtos/${id}`} title="Ver produto">
                            <Eye size={14} aria-hidden="true" />
                            Ver
                          </Link>
                          <Link
                            className="btn h-8 px-2"
                            to={`/produtos/${id}/editar`}
                            title="Editar produto"
                          >
                            <Pencil size={14} aria-hidden="true" />
                            Editar
                          </Link>
                          <button
                            className="btn h-8 px-2"
                            type="button"
                            onClick={() => onDelete(id)}
                            title="Excluir produto"
                          >
                            <Trash2 size={14} aria-hidden="true" />
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
        {!activeQuery ? (
          <Pagination
            page={page}
            total={result.total}
            pageSize={api.pageSize}
            disabled={status === 'loading'}
            onPageChange={setPage}
          />
        ) : null}
      </div>

      <Link to="/produtos/novo" className="fab" title="Adicionar produto">
        <Plus size={20} aria-hidden="true" />
      </Link>
    </section>
  );
}
