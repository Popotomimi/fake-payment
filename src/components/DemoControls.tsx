import { SCENES, type Scene } from "../lib/scenes";

type Props = {
  current: Scene;
  onJump: (scene: Scene) => void;
  onClose: () => void;
};

export default function DemoControls({ current, onJump, onClose }: Props) {
  return (
    <aside className="demo-panel" aria-label="Controles de gravação">
      <div className="demo-head">
        <strong>Controles de gravação</strong>
        <button type="button" onClick={onClose} aria-label="Fechar controles">
          ×
        </button>
      </div>

      <p className="demo-hint">Atalho: Ctrl + Shift + D</p>

      <div className="demo-scenes">
        {SCENES.map((scene) => (
          <button
            type="button"
            key={scene}
            className={scene === current ? "is-active" : ""}
            onClick={() => onJump(scene)}
          >
            {scene}
          </button>
        ))}
      </div>

      <p className="demo-hint">
        Payload de exemplo: <code>' OR 1=1; --</code>
      </p>
    </aside>
  );
}
