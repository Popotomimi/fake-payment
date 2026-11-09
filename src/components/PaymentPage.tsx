import { useEffect, useRef, useState, type FormEvent } from "react";
import { isPayload } from "../lib/payload";

type Props = {
  onSubmitPayload: (value: string) => void;
};

function formatCard(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function PaymentPage({ onSubmitPayload }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPayload(name)) {
      onSubmitPayload(name);
      return;
    }

    setToast("Pagamento aprovado.");
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  }

  return (
    <div className="checkout-wrap">
      <header className="brand">
        <div className="brand-logo">V</div>
        <div>
          <h1>VulnPay</h1>
          <p>checkout</p>
        </div>
      </header>

      <div className="checkout-grid">
        <section className="order-card" aria-label="Resumo do pedido">
          <span className="pill">Pedido #A7F3-2291</span>
          <h2>Plano Pro</h2>
          <p className="muted">Assinatura anual • renovação automática</p>

          <div className="order-row">
            <span>Subtotal</span>
            <span>R$ 249,90</span>
          </div>
          <div className="order-row">
            <span>Impostos</span>
            <span>R$ 0,00</span>
          </div>
          <div className="order-total">
            <span>Total</span>
            <span>R$ 249,90</span>
          </div>

          <ul className="perks">
            <li>Acesso ilimitado</li>
            <li>Suporte prioritário</li>
            <li>Cancele quando quiser</li>
          </ul>
        </section>

        <form className="pay-card" onSubmit={handleSubmit} autoComplete="off">
          <h2>Dados de pagamento</h2>

          <label className="field">
            <span>Nome completo</span>
            <input
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Como no cartão"
              required
            />
          </label>

          <label className="field">
            <span>E-mail</span>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@exemplo.com"
              required
            />
          </label>

          <label className="field">
            <span>Número do cartão</span>
            <input
              name="card"
              value={card}
              onChange={(event) => setCard(formatCard(event.target.value))}
              placeholder="0000 0000 0000 0000"
              inputMode="numeric"
              maxLength={19}
              required
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Validade</span>
              <input
                name="expiry"
                value={expiry}
                onChange={(event) => setExpiry(formatExpiry(event.target.value))}
                placeholder="MM/AA"
                inputMode="numeric"
                maxLength={5}
                required
              />
            </label>
            <label className="field">
              <span>CVV</span>
              <input
                name="cvv"
                value={cvv}
                onChange={(event) =>
                  setCvv(event.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="123"
                inputMode="numeric"
                maxLength={4}
                required
              />
            </label>
          </div>

          <button className="pay-btn" type="submit">
            Pagar R$ 249,90
          </button>

          {toast && <div className="toast">{toast}</div>}
        </form>
      </div>
    </div>
  );
}
