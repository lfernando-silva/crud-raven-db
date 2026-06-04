export function LoadingBlock() {
  return (
    <div className="border-y border-line bg-white px-4 py-10 text-center text-sm text-slate-500">
      Carregando...
    </div>
  );
}

export function ErrorBlock({ message }) {
  return (
    <div className="border-y border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
      {message}
    </div>
  );
}

export function EmptyBlock({ message = 'Nenhum registro encontrado.' }) {
  return (
    <div className="border-y border-line bg-white px-4 py-10 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}
