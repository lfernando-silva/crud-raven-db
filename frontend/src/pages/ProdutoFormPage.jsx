import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { ErrorBlock, LoadingBlock } from '../components/StateBlock.jsx';
import { api } from '../lib/api.js';

const blankForm = {
  nome: '',
  preco: '',
  imagem: '',
  categoria: '',
};

export default function ProdutoFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = useMemo(() => Boolean(id), [id]);

  const [form, setForm] = useState(blankForm);
  const [status, setStatus] = useState(isEdit ? 'loading' : 'ready');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    let alive = true;
    setStatus('loading');
    setError('');

    api
      .getProduto(id)
      .then((payload) => {
        if (!alive) return;
        const produto = payload?.data || {};
        setForm({
          nome: produto.nome || '',
          preco: produto.preco ?? '',
          imagem: produto.imagem || '',
          categoria: produto.categoria || '',
        });
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
  }, [id, isEdit]);

  const onFieldChange = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      nome: form.nome || undefined,
      preco: form.preco === '' ? undefined : Number(form.preco),
      imagem: form.imagem || undefined,
      categoria: form.categoria || undefined,
    };

    try {
      if (isEdit) {
        await api.updateProduto(id, payload);
      } else {
        await api.createProduto(payload);
      }
      navigate('/produtos');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <PageHeader
        title={isEdit ? 'Editar produto' : 'Novo produto'}
        subtitle="Preencha os campos conforme o contrato da API"
        actions={
          <Link to="/produtos" className="btn" title="Voltar para produtos">
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar
          </Link>
        }
      />

      <div className="overflow-hidden rounded-md border border-line bg-white">
        {status === 'loading' ? <LoadingBlock /> : null}
        {status === 'error' ? <ErrorBlock message={error} /> : null}
        {status === 'ready' ? (
          <form onSubmit={onSubmit} className="grid gap-4 p-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="nome">
                Nome
              </label>
              <input
                id="nome"
                className="input mt-1"
                value={form.nome}
                onChange={onFieldChange('nome')}
                placeholder="Nome do produto"
              />
            </div>

            <div>
              <label className="label" htmlFor="preco">
                Preco
              </label>
              <input
                id="preco"
                className="input mt-1"
                type="number"
                min="0.01"
                step="0.01"
                value={form.preco}
                onChange={onFieldChange('preco')}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="label" htmlFor="categoria">
                Categoria
              </label>
              <input
                id="categoria"
                className="input mt-1"
                value={form.categoria}
                onChange={onFieldChange('categoria')}
                placeholder="Categoria"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="label" htmlFor="imagem">
                URL da imagem
              </label>
              <input
                id="imagem"
                className="input mt-1"
                type="url"
                value={form.imagem}
                onChange={onFieldChange('imagem')}
                placeholder="https://..."
              />
            </div>

            {error ? <p className="sm:col-span-2 text-sm text-red-700">{error}</p> : null}

            <div className="sm:col-span-2 flex justify-end">
              <button className="btn btn-primary" type="submit" disabled={saving}>
                <Save size={16} aria-hidden="true" />
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </section>
  );
}
