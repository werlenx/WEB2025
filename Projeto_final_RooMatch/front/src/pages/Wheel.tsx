import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Zap } from "../ui/Icos";

export default function Wheel() {
  const { user } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<any>(null);

  // Mock
  const punishments = [
      { id: 1, descricao: "Lavar a louça do jantar por 3 dias", pontosPerdidos: 50, ativo: true },
      { id: 2, descricao: "Pagar uma rodada de pizza", pontosPerdidos: 100, ativo: true },
      { id: 3, descricao: "Limpar o banheiro extra esta semana", pontosPerdidos: 30, ativo: true },
  ];

  const handleSpinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSpinResult(null);

    const activePunishments = punishments.filter((p) => p.ativo);
    if (activePunishments.length === 0) {
      alert("Nenhuma punição ativa!");
      setIsSpinning(false);
      return;
    }

    // Gira a roda (animação simulada)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * activePunishments.length);
      const punishment = activePunishments[randomIndex];

      setSpinResult(punishment);
      setIsSpinning(false);
      
      // Aqui chamaria API para aplicar punição
    }, 3000); 
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 rounded-xl shadow-inner min-h-[500px]">
      <h3 className="text-2xl font-extrabold text-yellow-800 mb-4 flex items-center">
        <Zap className="w-6 h-6 mr-2 fill-yellow-500 text-yellow-800" /> Roda da
        Punição!
      </h3>
      <p className="text-center text-gray-700 mb-6">
        Gire a roda para aplicar uma punição a si mesmo(a) e perder pontos no
        ranking!
      </p>

      {/* Simulação da Roda */}
      <div className="relative mb-6">
        <div
          className={`w-64 h-64 border-8 border-yellow-600 rounded-full flex items-center justify-center transition-transform duration-300 ${
            isSpinning ? "animate-spin" : ""
          }`}
          style={{
            transform: `rotate(${isSpinning ? 360 * 5 + 90 : 0}deg)`,
            animationDuration: isSpinning ? "3s" : "0s",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex flex-col items-center justify-center p-4">
            <span className="text-4xl" role="img" aria-label="Wheel">
              🎯
            </span>
            {!isSpinning && (
              <span className="text-sm font-semibold text-yellow-900 mt-2">
                Pronto para girar
              </span>
            )}
          </div>
          <div className="absolute top-0 right-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-red-600 transform translate-x-1/2 -translate-y-full"></div>
        </div>

        {spinResult && !isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="p-3 bg-red-600 text-white rounded-xl shadow-xl transform scale-110 border-4 border-red-800 z-10 w-48">
              <p className="text-lg font-bold text-center">PUNIÇÃO SORTEADA:</p>
              <p className="text-xl font-extrabold text-center leading-tight mt-1">
                {spinResult.descricao}
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleSpinWheel}
        disabled={isSpinning || !user}
        className={`px-8 py-3 text-lg font-bold rounded-xl shadow-xl transition duration-300 flex items-center justify-center ${
          isSpinning
            ? "opacity-50 cursor-not-allowed bg-gray-500 text-white"
            : "bg-red-600 hover:bg-red-700 text-white"
        }`}
      >
        {isSpinning ? "GIRANDO..." : "GIRAR A RODA!"}
      </button>
    </div>
  );
}
