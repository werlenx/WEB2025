import React from "react";
import estilos from "./Palavra.module.css";

interface Props {
  palavra: string;
  letras: string[];
}

export default function PalavraDisplay({ palavra, letras }: Props) {
  return (
    <div className={estilos.areaPalavra}>
      {palavra.split("").map((letra, i) => (
        <div key={i} className={`${estilos.caixaLetra} ${letras.includes(letra) ? estilos.certa : ""}`}>
          {letras.includes(letra) ? letra : ""}
        </div>
      ))}
    </div>
  );
}
