type Props = {
  onRestart: () => void;
};

const TIPS = [
  {
    title: "HTTPS não é selo de confiança",
    text: "O cadeado indica conexão criptografada — golpistas também usam HTTPS. Confira o domínio letra por letra.",
  },
  {
    title: "Desconfie de links de pagamento",
    text: "Cobranças por WhatsApp, SMS ou e-mail com urgência são o formato favorito de golpe. Abra o app oficial.",
  },
  {
    title: "Digite o endereço manualmente",
    text: "Evite clicar em links. Digite o site do banco ou da loja direto no navegador ou use o aplicativo.",
  },
  {
    title: "Ative a verificação em duas etapas",
    text: "Mesmo com a senha vazada, o segundo fator dificulta muito o acesso à sua conta.",
  },
  {
    title: "Nunca informe o cartão em página suspeita",
    text: "Se algo parece estranho no endereço, no layout ou na oferta, pare. Pagamento urgente pode esperar.",
  },
  {
    title: "Golpes exploram pressa e medo",
    text: "Boleto falso, prêmio, conta bloqueada: a pressão é a arma. Respire e verifique por um canal oficial.",
  },
];

export default function RevealScreen({ onRestart }: Props) {
  return (
    <div className="reveal-wrap">
      <h1 className="reveal-title">Dicas de segurança</h1>
      <p className="reveal-lead">
        Pequenos cuidados que evitam grandes problemas no dia a dia.
      </p>

      <div className="tips">
        {TIPS.map((tip, index) => (
          <article className="tip" key={tip.title}>
            <span className="tip-num">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{tip.title}</h3>
            <p>{tip.text}</p>
          </article>
        ))}
      </div>

      <div className="reveal-actions">
        <button type="button" className="primary-btn" onClick={onRestart}>
          voltar ao início
        </button>
      </div>
    </div>
  );
}
