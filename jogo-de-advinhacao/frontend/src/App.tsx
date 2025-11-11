import React, { useState, useEffect } from "react";
import estilos from "./App.module.css";

import CabecalhoJogo from "./componentes/CabecalhoJogo";
import CaixaDica from "./componentes/CaixaDica";
import PalavraDisplay from "./componentes/Palavra";
import FormularioPalpite from "./componentes/FormPalpite";
import HistoricoLetras from "./componentes/HistoricoLetras";

const PALAVRAS = [
  { palavra: "REACT", dica: "Biblioteca para criar interfaces Web com JavaScript." },
  { palavra: "FIGMA", dica: "Ferramenta de design popular para interfaces." },
  { palavra: "VITE", dica: "Ferramenta de build moderna e rápida." },
];

const MAX_TENTATIVAS = 10;

function App() {
  const [indicePalavra, setIndicePalavra] = useState(0);
  const [palavra, setPalavra] = useState(PALAVRAS[0].palavra);
  const [dica, setDica] = useState(PALAVRAS[0].dica);
  const [letras, setLetras] = useState<string[]>([]);
  const [entrada, setEntrada] = useState("");
  const [tentativas, setTentativas] = useState(MAX_TENTATIVAS);
  const [mensagem, setMensagem] = useState("");
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const [historico, setHistorico] = useState<{ letra: string; certa: boolean }[]>([]);

  useEffect(() => {
    if (tentativas <= 0) {
      setMensagem("Você perdeu! A palavra era " + palavra);
      setJogoFinalizado(true);
    } else if (palavra.split("").every((letra) => letras.includes(letra))) {
      setMensagem("Parabéns! Você acertou a palavra!");
      setJogoFinalizado(true);
    }
  }, [tentativas, letras, palavra]);

  function reiniciarJogo() {
    const novoIndice = (indicePalavra + 1) % PALAVRAS.length;
    setIndicePalavra(novoIndice);
    setPalavra(PALAVRAS[novoIndice].palavra);
    setDica(PALAVRAS[novoIndice].dica);
    setLetras([]);
    setEntrada("");
    setTentativas(MAX_TENTATIVAS);
    setMensagem("");
    setJogoFinalizado(false);
    setHistorico([]);
  }

  function confirmarLetra(e: React.FormEvent) {
    e.preventDefault();
    const letra = entrada.toUpperCase();

    if (!letra) return;

    if (letras.includes(letra)) {
      setMensagem(`A letra "${letra}" já foi usada!`);
      setEntrada("");
      return;
    }

    const estaCerta = palavra.includes(letra);
    setLetras((prev) => [...prev, letra]);
    setHistorico((prev) => [...prev, { letra, certa: estaCerta }]);

    if (!estaCerta) {
      setTentativas((t) => t - 1);
      setMensagem(`A letra "${letra}" não existe!`);
    } else {
      setMensagem(`Boa! A letra "${letra}" está certa!`);
    }

    setEntrada("");
  }

  return (
    <div className={estilos.cx}>
      <CabecalhoJogo tentativas={tentativas} onReiniciar={reiniciarJogo} />
      <CaixaDica dica={dica} />
      <PalavraDisplay palavra={palavra} letras={letras} />

      <p className={estilos.msgStatus}>{mensagem}</p>

      {!jogoFinalizado && (
        <FormularioPalpite
          entrada={entrada}
          setEntrada={setEntrada}
          onConfirmar={confirmarLetra}
        />
      )}

      <HistoricoLetras historico={historico} />
    </div>
  );
}

export default App;
