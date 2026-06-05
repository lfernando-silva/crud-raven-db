import { useEffect, useState } from 'react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import { ErrorBlock, LoadingBlock } from '../../components/StateBlock.jsx';
import { api, documentId, money } from '../../lib/api.js';

export default function ProdutoDetailsPage() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setStatus('loading');
    setError('');

    api
      .getProduto(id)
      .then((payload) => {
        if (!alive) return;
        setProduto(payload?.data || null);
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
        title="Detalhes do produto"
        subtitle={produto?.nome || 'Consulta por ID'}
        actions={
          <>
            <Link to="/produtos" className="btn" title="Voltar para produtos">
              <ArrowLeft size={16} aria-hidden="true" />
              Voltar
            </Link>
            <Link to={`/produtos/${id}/editar`} className="btn btn-primary" title="Editar produto">
              <Pencil size={16} aria-hidden="true" />
              Editar
            </Link>
          </>
        }
      />

      <div className="overflow-hidden rounded-md border border-line bg-white">
        {status === 'loading' ? <LoadingBlock /> : null}
        {status === 'error' ? <ErrorBlock message={error} /> : null}
        {status === 'ready' && produto ? (
          <dl className="grid gap-4 p-4 sm:grid-cols-2">
            <div>
              <dt className="label">ID</dt>
              <dd className="mt-1 font-mono text-sm text-slate-700">{documentId(produto)}</dd>
            </div>
            <div>
              <dt className="label">Nome</dt>
              <dd className="mt-1 text-sm text-slate-700">{produto.nome || '-'}</dd>
            </div>
            <div>
              <dt className="label">Categoria</dt>
              <dd className="mt-1 text-sm text-slate-700">{produto.categoria || '-'}</dd>
            </div>
            <div>
              <dt className="label">Preco</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-700">{money(produto.preco)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="label">Imagem</dt>
              <dd className="mt-2 text-sm text-slate-700">
                {produto.imagem ? (
                  <img src={produto.imagem} alt={produto.nome || ''} className="h-48 rounded-md border border-line object-cover" />
                ) : (
                  '-'
                )}
              </dd>
            </div>
          </dl>
        ) : null}
      </div>
    </section>
  );
}
