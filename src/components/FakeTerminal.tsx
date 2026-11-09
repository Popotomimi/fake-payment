import { useEffect, useRef, useState } from "react";
import {
  terminalScript,
  type OutputClass,
  type PromptKind,
} from "../data/script";
import NotFound from "./NotFound";
import TerminalFrame from "./TerminalFrame";

type Line = {
  id: number;
  kind: "command" | "output" | "blank";
  text: string;
  className?: OutputClass;
  prompt?: PromptKind;
};

type Props = {
  onComplete: () => void;
  onRestart: () => void;
};

const PS_PATH = "C:\\Users\\admin";

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function charDelay(char: string) {
  if (char === " ") return randomBetween(120, 240);
  if ("-./\\@:~_".includes(char)) return randomBetween(85, 175);
  return randomBetween(55, 135);
}

function Prompt({ kind }: { kind: PromptKind }) {
  if (kind === "root") {
    return <span className="term-prompt root-prompt">root@vulnpay:~# </span>;
  }
  return (
    <span className="term-prompt ps-prompt">
      <span className="ps-label">PS </span>
      <span className="ps-path">{PS_PATH}</span>
      <span className="ps-caret">&gt; </span>
    </span>
  );
}

export default function FakeTerminal({ onComplete, onRestart }: Props) {
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");
  const [done, setDone] = useState(false);
  const [prompt, setPrompt] = useState<PromptKind>("ps");
  const [closed, setClosed] = useState(false);
  const promptRef = useRef<PromptKind>("ps");
  const fastRef = useRef(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const onCompleteRef = useRef(onComplete);

  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (closed) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCompleteRef.current();
      }
      if (event.key === "F2") {
        event.preventDefault();
        fastRef.current = !fastRef.current;
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closed]);

  useEffect(() => {
    if (closed) return;

    let cancelled = false;

    setLines([]);
    setTyping("");
    setDone(false);
    setPrompt("ps");
    promptRef.current = "ps";
    idRef.current = 0;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const factor = fastRef.current ? 22 : 1;
        window.setTimeout(resolve, Math.max(0, Math.round(ms / factor)));
      });

    const push = (line: Omit<Line, "id">) => {
      if (cancelled) return;
      setLines((previous) => [...previous, { ...line, id: idRef.current++ }]);
    };

    const typeCommand = async (text: string, allowTypo: boolean) => {
      let typed = "";
      let typoUsed = false;

      for (let index = 0; index < text.length; index += 1) {
        if (cancelled) return;
        const char = text[index];

        const shouldTypo =
          allowTypo &&
          !fastRef.current &&
          !typoUsed &&
          index > 2 &&
          /[a-z]/i.test(char) &&
          Math.random() < 0.035;

        if (shouldTypo) {
          typoUsed = true;
          const wrong = String.fromCharCode(
            97 + Math.floor(Math.random() * 26),
          );
          typed += wrong;
          setTyping(typed);
          await sleep(randomBetween(90, 170));
          if (cancelled) return;
          typed = typed.slice(0, -1);
          setTyping(typed);
          await sleep(randomBetween(130, 280));
          if (cancelled) return;
        }

        typed += char;
        setTyping(typed);
        await sleep(fastRef.current ? 10 : charDelay(char));
      }

      if (cancelled) return;
      setTyping("");
      push({ kind: "command", text, prompt: promptRef.current });
      await sleep(fastRef.current ? 70 : randomBetween(320, 720));
    };

    const run = async () => {
      await sleep(500);

      for (const step of terminalScript) {
        if (cancelled) return;

        if (step.kind === "command") {
          if (step.prompt && step.prompt !== promptRef.current) {
            promptRef.current = step.prompt;
            setPrompt(step.prompt);
            await sleep(fastRef.current ? 60 : 450);
          }
          await typeCommand(step.text, Boolean(step.typo));
        } else if (step.kind === "output") {
          push({ kind: "output", text: step.text, className: step.className });
          await sleep(fastRef.current ? 20 : randomBetween(70, 140));
        } else {
          push({ kind: "blank", text: "" });
          await sleep(fastRef.current ? 30 : 160);
        }
      }

      if (cancelled) return;
      setDone(true);
      await sleep(fastRef.current ? 100 : 900);
      if (cancelled) return;
      onCompleteRef.current();
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [closed]);

  useEffect(() => {
    const element = bodyRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [lines, typing]);

  return (
    <div className="wt-stack">
      <NotFound onBack={onRestart} />

      {!closed && (
        <div className="wt-overlay">
          <TerminalFrame
            title="Windows PowerShell"
            onClose={() => setClosed(true)}
          >
            <div className="terminal-body" ref={bodyRef}>
              <div className="term-line term-banner">Windows PowerShell</div>
              <div className="term-line term-dim">
                Copyright (C) Microsoft Corporation. All rights reserved.
              </div>
              <div className="term-line">&nbsp;</div>
              <div className="term-line term-dim">
                Install the latest PowerShell for new features and improvements!
                https://aka.ms/PSWindows
              </div>
              <div className="term-line">&nbsp;</div>

              {lines.map((line) =>
                line.kind === "blank" ? (
                  <div key={line.id} className="term-line">
                    &nbsp;
                  </div>
                ) : (
                  <div
                    key={line.id}
                    className={`term-line ${line.className ?? ""}`}
                  >
                    {line.kind === "command" && (
                      <Prompt kind={line.prompt ?? "ps"} />
                    )}
                    <span>{line.text}</span>
                  </div>
                ),
              )}

              {!done && (
                <div className="term-line">
                  <Prompt kind={prompt} />
                  <span>{typing}</span>
                  <span className="term-cursor" />
                </div>
              )}

              {done && (
                <div className="term-line">
                  <Prompt kind={prompt} />
                  <span className="term-cursor" />
                </div>
              )}
            </div>
          </TerminalFrame>
        </div>
      )}
    </div>
  );
}
