import React from "react";
import estilos from "./HistoricoLetras.module.css";

interface Item {
  letra: string;
  certa: boolean;
}

interface Props {
  historico: Item[];
}

export default function HistoricoLetras({ historico }: Props) {
  return (
    <div className={estilos.hist}>
      <p className={estilos.ttHist}>Letras usadas:</p>
      <div className={estilos.listaHist}>
        {historico.map((item, i) => (
          <span
            key={i}
            className={`${estilos.itemHist} ${item.certa ? estilos.certo : estilos.errado}`}
          >
            {item.letra}
          </span>
        ))}
      </div>
    </div>
  );
}
