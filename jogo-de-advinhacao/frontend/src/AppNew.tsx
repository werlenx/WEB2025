import React, { useState, useEffect } from "react";
import estilos from "./App.module.css";

import CabecalhoJogo from "./componentes/CabecalhoJogo";
import CaixaDica from "./componentes/CaixaDica";
import PalavraDisplay from "./componentes/Palavra";
import FormularioPalpite from "./componentes/FormPalpite";
import HistoricoLetras from "./componentes/HistoricoLetras";

const MAX_TENTATIVAS = 10;

function App() {
  const [palavras, setPalavras] = useState<{ palavra: string; dica: string }[]>([]);
  const [indicePalavra, setIndicePalavra] = useState(0);
  const [palavra, setPalavra] = useState("");
  const [dica, setDica] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);
  const [letras, setLetras] = useState<string[]>([]);
  const [entrada, setEntrada] = useState("");
  const [tentativas, setTentativas] = useState(MAX_TENTATIVAS);
  const [mensagem, setMensagem] = useState("");
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const [historico, setHistorico] = useState<{ letra: string; certa: boolean }[]>([]);

  useEffect(() => {
    async function carregarPalavras() {
      try {
        setCarregando(true);
        setErroCarregamento(null);
        const resposta = await fetch("http://localhost:3001/api/palavras");
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        const dados = await resposta.json();
        console.log("Resposta /palavras:", resposta);
        console.log("Dados recebidos do backend:", dados);

        if (!Array.isArray(dados) || dados.length === 0) {
          setErroCarregamento("Resposta vazia ou inválida do backend");
          setPalavras([]);
          setPalavra("");
          setDica("");
          return;
        }

        const primeiro = dados[0];
        const texto = (primeiro.palavra ?? primeiro.word ?? "").toString();
        const textoDica = (primeiro.dica ?? primeiro.hint ?? "").toString();

        if (!texto) {
          setErroCarregamento("Objeto de palavra não possui campo 'palavra' nem 'word'");
          setPalavras(dados);
          setPalavra("");
          setDica(textoDica);
          return;
        }

        setPalavras(dados);
        setPalavra(texto.toUpperCase());
        setDica(textoDica);
      } catch (err: any) {
        console.error("Erro ao carregar palavras:", err);
        setErroCarregamento(String(err.message ?? err));
      } finally {
        setCarregando(false);
      }
    }
    carregarPalavras();
  }, []);

  // Verifica se o jogo acabou
  useEffect(() => {
    if (tentativas <= 0) {
      setMensagem("Você perdeu! A palavra era " + palavra);
      setJogoFinalizado(true);
    } else if (palavra && palavra.split("").every((letra) => letras.includes(letra))) {
      setMensagem("Parabéns! Você acertou a palavra!");
      setJogoFinalizado(true);
    }
  }, [tentativas, letras, palavra]);

  function reiniciarJogo() {
    if (palavras.length === 0) return;

    const novoIndice = (indicePalavra + 1) % palavras.length;
    setIndicePalavra(novoIndice);
    setPalavra(palavras[novoIndice].palavra.toUpperCase());
    setDica(palavras[novoIndice].dica);
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
    if (!letra || letras.includes(letra)) return;

    const estaCerta = palavra.toUpperCase().includes(letra);
    setLetras((prev) => [...prev, letra]);
    setHistorico((prev) => [...prev, { letra, certa: estaCerta }]);

    if (!estaCerta) setTentativas((t) => t - 1);
    setEntrada("");
  }

  if (carregando) {
    return <div className={estilos.cx}>Carregando...</div>;
  }

  if (erroCarregamento) {
    return <div className={estilos.cx}>Erro ao carregar palavras: {erroCarregamento}</div>;
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
