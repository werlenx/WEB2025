import React from "react";
import estilos from "./CaixaDica.module.css";

interface Props {
  dica: string;
}

export default function CaixaDica({ dica }: Props) {
  return (
    <div className={estilos.caixaDica}>
      <span className={estilos.icoDica}>💡</span>
      <div>
        <p className={estilos.ttDica}>Dica:</p>
        <p className={estilos.txtDica}>{dica}</p>
      </div>
    </div>
  );
}
