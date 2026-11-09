import { useState, type ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  onClose?: () => void;
};

export default function TerminalFrame({ title, children, onClose }: Props) {
  const [closing, setClosing] = useState(false);

  function handleClose() {
    if (!onClose || closing) return;
    setClosing(true);
    window.setTimeout(onClose, 170);
  }

  return (
    <div className={`wt-window${closing ? " closing" : ""}`}>
      <div className="wt-tabbar">
        <div className="wt-tab">
          <span className="wt-tab-icon" aria-hidden="true">
            &gt;_
          </span>
          <span className="wt-tab-title">{title}</span>
          {onClose ? (
            <button
              type="button"
              className="wt-tab-close"
              aria-label="fechar aba"
              onClick={handleClose}
            >
              ×
            </button>
          ) : (
            <span className="wt-tab-close" aria-hidden="true">
              ×
            </span>
          )}
        </div>
        <span className="wt-newtab" aria-hidden="true">
          +
        </span>
        <div className="wt-window-controls">
          <span aria-hidden="true">—</span>
          <span aria-hidden="true">□</span>
          {onClose ? (
            <button
              type="button"
              className="wt-close"
              aria-label="fechar janela"
              onClick={handleClose}
            >
              ×
            </button>
          ) : (
            <span className="wt-close" aria-hidden="true">
              ×
            </span>
          )}
        </div>
      </div>
      <div className="wt-body">{children}</div>
    </div>
  );
}
