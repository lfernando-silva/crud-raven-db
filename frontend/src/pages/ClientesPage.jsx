import { useEffect, useState } from 'react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Pagination from '../components/Pagination.jsx';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/StateBlock.jsx';
import { api, documentId } from '../lib/api.js';

export default function ClientesPage() {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], total: 0 });
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const loadClientes = () => {
    setStatus('loading');
    setError('');

    api
      .listClientes(page)
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
    loadClientes();
  }, [page]);

  const onDelete = async (id) => {
    if (!window.confirm('Deseja excluir este cliente?')) return;

    setError('');
    try {
      await api.deleteCliente(id);
      loadClientes();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <PageHeader title="Clientes" subtitle="Listagem paginada com acoes por registro" />

      <div className="overflow-hidden rounded-md border border-line bg-white">
        {status === 'loading' ? <LoadingBlock /> : null}
        {status === 'error' ? <ErrorBlock message={error} /> : null}
        {status === 'ready' && result.data.length === 0 ? <EmptyBlock /> : null}
        {status === 'ready' && result.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="table-cell">Nome</th>
                  <th className="table-cell">Email</th>
                  <th className="table-cell">Telefone</th>
                  <th className="table-cell">Instagram</th>
                  <th className="table-cell">ID</th>
                  <th className="table-cell">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((cliente) => {
                  const id = documentId(cliente);
                  return (
                    <tr key={cliente.id} className="hover:bg-slate-50">
                      <td className="table-cell font-medium text-ink">{cliente.nome}</td>
                      <td className="table-cell text-slate-600">{cliente.email || '-'}</td>
                      <td className="table-cell text-slate-600">
                        {Array.isArray(cliente.telefone)
                          ? cliente.telefone.join(', ')
                          : cliente.telefone || '-'}
                      </td>
                      <td className="table-cell text-slate-600">{cliente.instagram || '-'}</td>
                      <td className="table-cell font-mono text-xs text-slate-500">{id}</td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <Link className="btn h-8 px-2" to={`/clientes/${id}`} title="Ver cliente">
                            <Eye size={14} aria-hidden="true" />
                            Ver
                          </Link>
                          <Link
                            className="btn h-8 px-2"
                            to={`/clientes/${id}/editar`}
                            title="Editar cliente"
                          >
                            <Pencil size={14} aria-hidden="true" />
                            Editar
                          </Link>
                          <button
                            className="btn h-8 px-2"
                            type="button"
                            onClick={() => onDelete(id)}
                            title="Excluir cliente"
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
        <Pagination
          page={page}
          total={result.total}
          pageSize={api.pageSize}
          disabled={status === 'loading'}
          onPageChange={setPage}
        />
      </div>

      <Link to="/clientes/novo" className="fab" title="Adicionar cliente">
        <Plus size={20} aria-hidden="true" />
      </Link>
    </section>
  );
}
