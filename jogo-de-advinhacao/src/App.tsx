import React, { useState, useEffect } from "react";
import styles from "./App.module.css";

const PALAVRAS = ["REACT", "FIGMA", "VITE"];
const DICAS = [
  "Biblioteca para criar interfaces Web com Javascript.",
  "Ferramenta de design popular para interfaces.",
  "Ferramenta de build moderna e rápida."
];

const MAX_TENTATIVAS = 10;

const App = () => {
  const [indice, setIndice] = useState(0);
  const [palavra, setPalavra] = useState(PALAVRAS[0]);
  const [dica, setDica] = useState(DICAS[0]);
  const [letrasUsadas, setLetrasUsadas] = useState<string[]>([]);
  const [palpite, setPalpite] = useState("");
  const [tentativas, setTentativas] = useState(0);
  const [estado, setEstado] = useState<"jogando" | "ganhou" | "perdeu">("jogando");
  const [mensagem, setMensagem] = useState("");

  const novoJogo = () => {
    const i = Math.floor(Math.random() * PALAVRAS.length);
    setIndice(i);
    setPalavra(PALAVRAS[i]);
    setDica(DICAS[i]);
    setLetrasUsadas([]);
    setPalpite("");
    setTentativas(0);
    setEstado("jogando");
    setMensagem("Tente adivinhar a palavra!");
  };

  useEffect(() => {
    novoJogo();
  }, []);

  const verificarPalpite = (e: React.FormEvent) => {
    e.preventDefault();
    if (estado !== "jogando") return;

    const letra = palpite.toUpperCase();

    if (letra.length !== 1 || !/^[A-Z]$/.test(letra)) {
      setMensagem("Digite apenas uma letra válida!");
      return;
    }

    if (letrasUsadas.includes(letra)) {
      setMensagem(`A letra "${letra}" já foi usada.`);
      setPalpite("");
      return;
    }

    const novasLetras = [...letrasUsadas, letra];
    setLetrasUsadas(novasLetras);
    setTentativas(tentativas + 1);
    setPalpite("");

    if (palavra.includes(letra)) {
      setMensagem(`Boa! A letra "${letra}" está na palavra.`);
    } else {
      setMensagem(`Letra "${letra}" não encontrada.`);
    }

    const todasLetras = [...new Set(palavra)];
    const venceu = todasLetras.every((l) => novasLetras.includes(l));

    if (venceu) {
      setEstado("ganhou");
      setMensagem(`🎉 Parabéns! A palavra era ${palavra}.`);
    } else if (tentativas + 1 >= MAX_TENTATIVAS) {
      setEstado("perdeu");
      setMensagem(`😭 Fim de jogo! A palavra era ${palavra}.`);
    }
  };

  const exibirPalavra = palavra.split("").map((l, i) => (
    <span key={i} className={`${styles.wordBox} ${letrasUsadas.includes(l) ? styles.correct : ""}`}>
      {letrasUsadas.includes(l) ? l : ""}
    </span>
  ));

  const exibirHistorico = letrasUsadas.map((l) => {
    const correta = palavra.includes(l);
    return (
      <span
        key={l}
        className={`${styles.historyItem} ${correta ? styles.correctHistory : styles.incorrectHistory}`}
      >
        {l}
      </span>
    );
  });

  return (
    <div className={styles.container}>
      <img className={styles.logo} src="logo.png" alt="Logo" />

      <div className={styles.attemptsRow}>
        <p>
          Tentativas: <strong>{tentativas}</strong> / {MAX_TENTATIVAS}
        </p>
        <button onClick={novoJogo} className={styles.restartButton}>🔄</button>
      </div>

      <div className={styles.hintBox}>
        <p><b>Dica:</b> {dica}</p>
      </div>

      <div className={styles.wordArea}>{exibirPalavra}</div>

      <p className={styles.statusMessage}>{mensagem}</p>

      <form onSubmit={verificarPalpite} className={styles.guessForm}>
        <input
          type="text"
          maxLength={1}
          value={palpite}
          onChange={(e) => setPalpite(e.target.value.toUpperCase())}
          disabled={estado !== "jogando"}
          className={styles.inputField}
        />
        <button type="submit" disabled={!palpite || estado !== "jogando"} className={styles.confirmButton}>
          Confirmar
        </button>
      </form>

      <div className={styles.historyContainer}>
        <p>Letras usadas:</p>
        <div>{exibirHistorico.length > 0 ? exibirHistorico : "—"}</div>
      </div>
    </div>
  );
};

export default App;
