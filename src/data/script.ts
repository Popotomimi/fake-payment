export type OutputClass = "dim" | "ok" | "warn" | "err";
export type PromptKind = "ps" | "root";

export type TerminalStep =
  | {
      kind: "command";
      text: string;
      prompt?: PromptKind;
      typo?: boolean;
      pause?: number;
    }
  | { kind: "output"; text: string; className?: OutputClass }
  | { kind: "blank" };

export const terminalScript: TerminalStep[] = [
  { kind: "command", text: "nmap -sV vulnpay.app", typo: true },
  {
    kind: "output",
    text: "Starting Nmap 7.94 ( https://nmap.org )",
    className: "dim",
  },
  {
    kind: "output",
    text: "Nmap scan report for vulnpay.app (10.0.0.42)",
    className: "dim",
  },
  { kind: "output", text: "PORT     STATE  SERVICE   VERSION", className: "dim" },
  { kind: "output", text: "22/tcp   open   ssh       OpenSSH 8.9" },
  { kind: "output", text: "80/tcp   open   http      nginx 1.24" },
  { kind: "output", text: "443/tcp  open   ssl/https nginx 1.24" },
  { kind: "output", text: "3306/tcp open   mysql     MySQL 8.0.32" },
  { kind: "blank" },
  { kind: "command", text: "ssh admin@10.0.0.42", typo: true },
  { kind: "output", text: "admin@10.0.0.42's password:", className: "dim" },
  {
    kind: "output",
    text: "Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)",
    className: "ok",
  },
  {
    kind: "output",
    text: "Last login: Thu Nov  6 03:12:44 2026 from 10.0.0.7",
    className: "dim",
  },
  { kind: "blank" },
  { kind: "command", text: "whoami", prompt: "root" },
  { kind: "output", text: "root", className: "ok" },
  { kind: "command", text: "ls -la /var/www/vulnpay" },
  { kind: "output", text: "total 48", className: "dim" },
  { kind: "output", text: "drwxr-xr-x 6 root root 4096 Nov  6 03:10 ." },
  { kind: "output", text: "drwxr-xr-x 4 root root 4096 Nov  6 02:55 .." },
  { kind: "output", text: "-rw-r--r-- 1 root root 1821 Nov  6 03:10 app.js" },
  { kind: "output", text: "-rw-r--r-- 1 root root  912 Nov  6 03:10 checkout.tsx" },
  { kind: "output", text: "-rw-r--r-- 1 root root  448 Nov  6 03:10 .env" },
  { kind: "blank" },
  { kind: "command", text: "cat /etc/passwd | head -n 3" },
  { kind: "output", text: "root:x:0:0:root:/root:/bin/bash" },
  { kind: "output", text: "daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin" },
  {
    kind: "output",
    text: "www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin",
  },
  { kind: "blank" },
  { kind: "command", text: "curl -O https://vulnpay.app/doom.jsdos" },
  {
    kind: "output",
    text: "  % Total    % Received % Xferd  Average Speed",
    className: "dim",
  },
  {
    kind: "output",
    text: "100 5410k  100 5410k    0     0  12.4M      0",
    className: "dim",
  },
  { kind: "blank" },
  { kind: "command", text: "./doom" },
  {
    kind: "output",
    text: "[ok] carregando DOOM...",
    className: "ok",
  },
];
