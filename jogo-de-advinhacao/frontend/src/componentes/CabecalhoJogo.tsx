import React from "react";
import estilos from "./cabecalhoJogo.module.css";

interface Props {
  tentativas: number;
  onReiniciar: () => void;
}

export default function CabecalhoJogo({ tentativas, onReiniciar }: Props) {
  return (
    <>
      <img src="logo.png" className={estilos.logo} alt="Logo do jogo" />
      <div className={estilos.linhaTent}>
        <p className={estilos.txtTent}>
          Tentativas restantes: <span>{tentativas}</span>
        </p>
        <button onClick={onReiniciar} className={estilos.btnReiniciar}>
          <span>↻</span>
        </button>
      </div>
    
    </>
  );
}
