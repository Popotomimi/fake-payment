import { useCallback, useEffect, useState } from "react";
import DemoControls from "./components/DemoControls";
import DoomScreen from "./components/DoomScreen";
import ExploitScreen from "./components/ExploitScreen";
import FakeTerminal from "./components/FakeTerminal";
import PaymentPage from "./components/PaymentPage";
import RevealScreen from "./components/RevealScreen";
import { EXAMPLE_PAYLOAD } from "./lib/payload";
import { sceneFromHash, type Scene } from "./lib/scenes";

export default function App() {
  const [scene, setScene] = useState<Scene>(sceneFromHash);
  const [payload, setPayload] = useState(EXAMPLE_PAYLOAD);
  const [showControls, setShowControls] = useState(false);

  const go = useCallback((next: Scene) => setScene(next), []);
  const toExploit = useCallback((value: string) => {
    setPayload(value);
    setScene("exploit");
  }, []);
  const toTerminal = useCallback(() => setScene("terminal"), []);
  const toDoom = useCallback(() => setScene("doom"), []);
  const restart = useCallback(() => setScene("checkout"), []);

  useEffect(() => {
    const onHash = () => setScene(sceneFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const target = `#${scene}`;
    if (window.location.hash !== target) {
      window.history.replaceState(null, "", target);
    }
  }, [scene]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
        event.preventDefault();
        setShowControls((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app">
      <main className="stage" key={scene}>
        {scene === "checkout" && <PaymentPage onSubmitPayload={toExploit} />}
        {scene === "exploit" && (
          <ExploitScreen payload={payload} onNext={toTerminal} />
        )}
        {scene === "terminal" && (
          <FakeTerminal onComplete={toDoom} onRestart={restart} />
        )}
        {scene === "doom" && <DoomScreen onRestart={restart} />}
        {scene === "reveal" && <RevealScreen onRestart={restart} />}
      </main>
      {showControls && (
        <DemoControls
          current={scene}
          onJump={go}
          onClose={() => setShowControls(false)}
        />
      )}
    </div>
  );
}
