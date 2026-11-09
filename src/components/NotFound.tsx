type Props = {
  onBack: () => void;
};

export default function NotFound({ onBack }: Props) {
  return (
    <div className="notfound">
      <p className="notfound-code">404</p>
      <h1 className="notfound-title">Página não encontrada</h1>
      <p className="notfound-text">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>
      <button type="button" className="primary-btn" onClick={onBack}>
        voltar ao início
      </button>
    </div>
  );
}
