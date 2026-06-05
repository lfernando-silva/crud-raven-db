import { useEffect, useState } from 'react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import { ErrorBlock, LoadingBlock } from '../../components/StateBlock.jsx';
import { api, documentId } from '../../lib/api.js';

export default function ClienteDetailsPage() {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setStatus('loading');
    setError('');

    api
      .getCliente(id)
      .then((payload) => {
        if (!alive) return;
        setCliente(payload?.data || null);
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

  return (
    <section>
      <PageHeader
        title="Detalhes do cliente"
        subtitle={cliente?.nome || 'Consulta por ID'}
        actions={
          <>
            <Link to="/clientes" className="btn" title="Voltar para clientes">
              <ArrowLeft size={16} aria-hidden="true" />
              Voltar
            </Link>
            <Link to={`/clientes/${id}/editar`} className="btn btn-primary" title="Editar cliente">
              <Pencil size={16} aria-hidden="true" />
              Editar
            </Link>
          </>
        }
      />

      <div className="overflow-hidden rounded-md border border-line bg-white">
        {status === 'loading' ? <LoadingBlock /> : null}
        {status === 'error' ? <ErrorBlock message={error} /> : null}
        {status === 'ready' && cliente ? (
          <dl className="grid gap-4 p-4 sm:grid-cols-2">
            <div>
              <dt className="label">ID</dt>
              <dd className="mt-1 font-mono text-sm text-slate-700">{documentId(cliente)}</dd>
            </div>
            <div>
              <dt className="label">Nome</dt>
              <dd className="mt-1 text-sm text-slate-700">{cliente.nome || '-'}</dd>
            </div>
            <div>
              <dt className="label">Email</dt>
              <dd className="mt-1 text-sm text-slate-700">{cliente.email || '-'}</dd>
            </div>
            <div>
              <dt className="label">Instagram</dt>
              <dd className="mt-1 text-sm text-slate-700">{cliente.instagram || '-'}</dd>
            </div>
            <div>
              <dt className="label">Telefone</dt>
              <dd className="mt-1 text-sm text-slate-700">
                {Array.isArray(cliente.telefone) ? cliente.telefone.join(', ') : '-'}
              </dd>
            </div>
            <div>
              <dt className="label">Endereco</dt>
              <dd className="mt-1 text-sm text-slate-700">{cliente.endereco || '-'}</dd>
            </div>
          </dl>
        ) : null}
      </div>
    </section>
  );
}
