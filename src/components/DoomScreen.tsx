import { useEffect, useState } from "react";
import NotFound from "./NotFound";
import TerminalFrame from "./TerminalFrame";

const DOOM_BUNDLE = "https://v8.js-dos.com/bundles/doom.jsdos";

const SRCDOC = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; height: 100%; background: #000; overflow: hidden; }
      #dos { width: 100%; height: 100%; }
      #dos .sidebar-slider { display: none !important; }
    </style>
    <link rel="stylesheet" href="https://v8.js-dos.com/latest/js-dos.css" />
  </head>
  <body>
    <div id="dos"></div>
    <script src="https://v8.js-dos.com/latest/js-dos.js"></script>
    <script>
      (function () {
        function post(type, extra) {
          try {
            parent.postMessage(
              Object.assign({ source: "dos-demo", type: type }, extra || {}),
              "*"
            );
          } catch (error) {
            /* ignore */
          }
        }
        function isKeyboardLock(message) {
          return message.indexOf("lock") !== -1 && message.indexOf("Keyboard") !== -1;
        }
        window.addEventListener("error", function (event) {
          var message = String(event.message || event);
          if (isKeyboardLock(message)) {
            event.preventDefault();
            return;
          }
          post("dos-error", { message: message });
        });
        window.addEventListener("unhandledrejection", function (event) {
          var reason = event.reason;
          var message = String((reason && reason.message) || reason);
          if (isKeyboardLock(message)) {
            event.preventDefault();
          }
        });

        var dosInstance = null;
        var ciReady = false;

        function hideMouseUi() {
          var root = document.getElementById("dos");
          if (!root) return;
          var elements = root.querySelectorAll("div");
          for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (
              element.childElementCount === 0 &&
              element.textContent &&
              element.textContent.indexOf("Click to capture mouse") !== -1
            ) {
              if (element.parentElement) {
                element.parentElement.style.display = "none";
              }
            }
          }
          var slider = root.querySelector(".sidebar-slider");
          if (slider) slider.style.display = "none";
        }

        function disableMouseCapture() {
          try {
            if (dosInstance && typeof dosInstance.setMouseCapture === "function") {
              dosInstance.setMouseCapture(false);
            }
          } catch (error) {
            /* ignore */
          }
          hideMouseUi();
        }

        function watchMouseUi() {
          var root = document.getElementById("dos");
          if (!root || typeof MutationObserver === "undefined") return;
          var observer = new MutationObserver(hideMouseUi);
          observer.observe(root, { childList: true, subtree: true });
        }

        watchMouseUi();

        try {
          dosInstance = Dos(document.getElementById("dos"), {
            url: "${DOOM_BUNDLE}",
            pathPrefix: "https://v8.js-dos.com/latest/emulators/",
            theme: "dark",
            autoStart: true,
            kiosk: true,
            mouseCapture: false,
            onEvent: function (event) {
              if (event === "ci-ready") {
                ciReady = true;
                disableMouseCapture();
                setTimeout(disableMouseCapture, 400);
                setTimeout(disableMouseCapture, 1200);
                post("dos-ready");
              }
            }
          });
          if (ciReady) disableMouseCapture();
        } catch (error) {
          post("dos-error", {
            message: String((error && error.message) || error)
          });
        }
      })();
    </script>
  </body>
</html>`;

type Props = {
  onRestart: () => void;
};

type DosMessage = {
  source?: string;
  type?: string;
  message?: string;
};

export default function DoomScreen({ onRestart }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slow, setSlow] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data as DosMessage | null;
      if (!data || data.source !== "dos-demo") return;

      if (data.type === "dos-ready") {
        setReady(true);
        setError(null);
      }

      if (data.type === "dos-error") {
        setError(data.message ?? "erro desconhecido");
      }
    }

    window.addEventListener("message", onMessage);
    const timer = window.setTimeout(() => setSlow(true), 12000);

    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="doom-wrap">
      <div className="wt-stack">
        <NotFound onBack={onRestart} />

        {!closed && (
          <div className="wt-overlay">
            <TerminalFrame
              title="root@vulnpay: ~"
              onClose={() => setClosed(true)}
            >
              <div className="doom-screen">
                <iframe
                  title="DOOM"
                  srcDoc={SRCDOC}
                  allow="autoplay; fullscreen"
                />

                {!ready && (
                  <div className="doom-loading">
                    <div className="spinner" aria-hidden="true" />
                    <p>
                      {error
                        ? "Não foi possível carregar o DOOM."
                        : "Carregando DOOM..."}
                    </p>
                    {error && (
                      <p className="doom-note">
                        Recarregue a página para tentar novamente.
                      </p>
                    )}
                    {slow && !error && (
                      <p className="doom-note">
                        Ainda carregando... verifique a conexão com a internet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </TerminalFrame>
          </div>
        )}
      </div>

      {!closed && <p className="doom-caption">DOOM shareware © id Software.</p>}
    </div>
  );
}
