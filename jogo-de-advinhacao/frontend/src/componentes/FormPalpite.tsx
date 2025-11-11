import React from "react";
import estilos from "./FormPalpite.module.css";

interface Props {
  entrada: string;
  setEntrada: React.Dispatch<React.SetStateAction<string>>;
  onConfirmar: (e: React.FormEvent) => void;
}

export default function FormularioPalpite({ entrada, setEntrada, onConfirmar }: Props) {
  return (
    <form onSubmit={onConfirmar} className={estilos.formPalpite}>
      <label htmlFor="letra" className={estilos.lblPalpite}>
        Letra:
      </label>
      <input
        id="letra"
        type="text"
        maxLength={1}
        value={entrada}
        onChange={(e) => setEntrada(e.target.value)}
        className={estilos.campoInp}
      />
      <button type="submit" className={estilos.btnConfirma} disabled={!entrada}>
        Confirmar
      </button>
    </form>
  );
}
