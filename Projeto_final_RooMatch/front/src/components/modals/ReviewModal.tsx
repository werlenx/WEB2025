import React, { useState } from "react";
import { Star } from "../../ui/Icos";
import api from "../../services/api";

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  taskId: number | null;
  taskTitle: string;
}

export default function ReviewModal({
  visible,
  onClose,
  onSuccess,
  taskId,
  taskTitle,
}: ReviewModalProps) {
  const [stars, setStars] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!visible || !taskId) return null;

  const handleSubmit = async () => {
    if (stars === 0) {
      alert("Por favor, selecione uma nota.");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/tasks/${taskId}/review`, { stars });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      alert("Erro ao avaliar tarefa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Avaliar Tarefa</h3>
          <p className="text-gray-600 mb-6 font-medium bg-gray-50 p-2 rounded-lg">
            "{taskTitle}"
          </p>

          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setStars(s)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`w-10 h-10 ${
                    s <= stars ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || stars === 0}
              className="flex-1 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-xl hover:bg-yellow-500 font-bold disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Avaliar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
