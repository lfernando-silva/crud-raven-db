import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import { ErrorBlock, LoadingBlock } from '../../components/StateBlock.jsx';
import { api, dateTime, money } from '../../lib/api.js';

export default function PedidoDetailsPage() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setStatus('loading');
    setError('');

    api
      .getPedido(id)
      .then((payload) => {
        if (!alive) return;
        setPedido(payload?.data || null);
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

  const total = useMemo(() => Number(pedido?.totalPedido || 0), [pedido]);

  return (
    <section>
      <PageHeader
        title="Detalhes do pedido"
        subtitle={pedido?.clienteNome || pedido?.clienteId || 'Consulta por ID'}
        actions={
          <>
            <Link to="/pedidos" className="btn" title="Voltar para pedidos">
              <ArrowLeft size={16} aria-hidden="true" />
              Voltar
            </Link>
            <Link to={`/pedidos/${id}/editar`} className="btn btn-primary" title="Editar pedido">
              <Pencil size={16} aria-hidden="true" />
              Editar
            </Link>
          </>
        }
      />

      <div className="overflow-hidden rounded-md border border-line bg-white">
        {status === 'loading' ? <LoadingBlock /> : null}
        {status === 'error' ? <ErrorBlock message={error} /> : null}

        {status === 'ready' && pedido ? (
          <div className="grid gap-4 p-4">
            <dl className="grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="label">ID</dt>
                <dd className="mt-1 font-mono text-sm text-slate-700">{id}</dd>
              </div>
              <div>
                <dt className="label">Cliente</dt>
                <dd className="mt-1 text-sm text-slate-700">{pedido.clienteNome || pedido.clienteId || '-'}</dd>
              </div>
              <div>
                <dt className="label">Criado em</dt>
                <dd className="mt-1 text-sm text-slate-700">{dateTime(pedido.criadoEm)}</dd>
              </div>
            </dl>

            <div className="overflow-x-auto rounded-md border border-line">
              <table className="w-full min-w-[620px] border-collapse">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="table-cell">Produto</th>
                    <th className="table-cell">Categoria</th>
                    <th className="table-cell">Qtd.</th>
                    <th className="table-cell">Preco unit.</th>
                    <th className="table-cell">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(pedido.itens || []).map((item, index) => {
                    const quantidade = Number(item.quantidade || 0);
                    const precoUnitario = Number(item.precoUnitario || 0);
                    return (
                      <tr key={`${item.produtoId || item.produtoNome || 'item'}-${index}`} className="hover:bg-slate-50">
                        <td className="table-cell text-slate-700">{item.produtoNome || item.produtoId || '-'}</td>
                        <td className="table-cell text-slate-700">{item.produtoCategoria || '-'}</td>
                        <td className="table-cell text-slate-700">{quantidade}</td>
                        <td className="table-cell text-slate-700">{money(precoUnitario)}</td>
                        <td className="table-cell font-semibold text-slate-700">
                          {money(quantidade * precoUnitario)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <p className="rounded-md bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                Total: {money(total)}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
