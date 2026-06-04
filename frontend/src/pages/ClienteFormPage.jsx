import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { ErrorBlock, LoadingBlock } from '../components/StateBlock.jsx';
import { api } from '../lib/api.js';

const blankForm = {
  nome: '',
  email: '',
  instagram: '',
  endereco: '',
  telefoneText: '',
};

export default function ClienteFormPage() {
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
      .getCliente(id)
      .then((payload) => {
        if (!alive) return;
        const cliente = payload?.data || {};
        setForm({
          nome: cliente.nome || '',
          email: cliente.email || '',
          instagram: cliente.instagram || '',
          endereco: cliente.endereco || '',
          telefoneText: Array.isArray(cliente.telefone) ? cliente.telefone.join(', ') : '',
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

    const telefone = form.telefoneText
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    const payload = {
      nome: form.nome || undefined,
      email: form.email || undefined,
      instagram: form.instagram || undefined,
      endereco: form.endereco || undefined,
      telefone: telefone.length > 0 ? telefone : undefined,
    };

    try {
      if (isEdit) {
        await api.updateCliente(id, payload);
      } else {
        await api.createCliente(payload);
      }
      navigate('/clientes');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <PageHeader
        title={isEdit ? 'Editar cliente' : 'Novo cliente'}
        subtitle="Preencha os campos conforme o contrato da API"
        actions={
          <Link to="/clientes" className="btn" title="Voltar para clientes">
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
            <div>
              <label className="label" htmlFor="nome">
                Nome
              </label>
              <input
                id="nome"
                className="input mt-1"
                value={form.nome}
                onChange={onFieldChange('nome')}
                placeholder="Nome do cliente"
              />
            </div>

            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="input mt-1"
                type="email"
                value={form.email}
                onChange={onFieldChange('email')}
                placeholder="email@dominio.com"
              />
            </div>

            <div>
              <label className="label" htmlFor="instagram">
                Instagram
              </label>
              <input
                id="instagram"
                className="input mt-1"
                value={form.instagram}
                onChange={onFieldChange('instagram')}
                placeholder="@perfil"
              />
            </div>

            <div>
              <label className="label" htmlFor="telefone">
                Telefones
              </label>
              <input
                id="telefone"
                className="input mt-1"
                value={form.telefoneText}
                onChange={onFieldChange('telefoneText')}
                placeholder="(11) 99999-9999, (11) 98888-8888"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="label" htmlFor="endereco">
                Endereco
              </label>
              <input
                id="endereco"
                className="input mt-1"
                value={form.endereco}
                onChange={onFieldChange('endereco')}
                placeholder="Rua, numero, bairro, cidade"
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
