import React, { useState, useEffect } from "react";
import { Plus, X } from "../../ui/Icos";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface TaskFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  houseMembers: any[];
}

export default function TaskFormModal({ visible, onClose, onSuccess, houseMembers }: TaskFormModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    frequencia: "DAILY",
    pontos: 10,
    responsavel: "",
    dataLimite: "", // YYYY-MM-DD
    timeLimite: "18:00",
    canBuyOut: false
  });

  if (!visible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.responsavel) {
        alert("Por favor, selecione um responsável.");
        setLoading(false);
        return;
    }

    try {
        const dateTimeString = `${formData.dataLimite}T${formData.timeLimite}:00`;
        const dateObj = new Date(dateTimeString);
        
        // Enviar ISO string completa para evitar problemas de parsing no backend
        const dueDateISO = dateObj.toISOString();

        console.log("Enviando tarefa:", {
             ...formData,
             dueDateISO
        });
        
        await api.post("/tasks", {
            title: formData.titulo,
            description: formData.descricao,
            frequency: formData.frequencia, // DAILY, WEEKLY, MONTHLY
            points: Number(formData.pontos),
            responsibleId: Number(formData.responsavel),
            dueDate: dueDateISO,
            canBuyOut: formData.canBuyOut
        });
        
        console.log("Tarefa criada com sucesso!");
        onSuccess();
        onClose();
        // Reset form
        setFormData({
            titulo: "",
            descricao: "",
            frequencia: "DAILY",
            pontos: 10,
            responsavel: "",
            dataLimite: "",
            timeLimite: "18:00",
            canBuyOut: false
        })
    } catch (error: any) {
        console.error("Erro ao criar tarefa detailed:", error.response?.data || error.message);
        const errorMsg = error.response?.data?.message || "Erro desconhecido ao criar tarefa";
        alert(`Erro ao criar tarefa: ${errorMsg}`);
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = e.target.checked;
    
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">
                Nova Tarefa
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                <X className="w-6 h-6" />
            </button>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
            </label>
            <input
                type="text"
                name="titulo"
                required
                value={formData.titulo}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            </div>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
            </label>
            <textarea
                name="descricao"
                rows={2}
                value={formData.descricao}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequência
                </label>
                <select
                name="frequencia"
                required
                value={formData.frequencia}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                >
                <option value="DAILY">Diária</option>
                <option value="WEEKLY">Semanal</option>
                <option value="MONTHLY">Mensal</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Pontos
                </label>
                <input
                type="number"
                name="pontos"
                value={formData.pontos}
                onChange={handleChange}
                min="1"
                required
                className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>
            {/* Campos de Data e Hora Limite */}
            <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Vencimento
                </label>
                <div className="flex space-x-2">
                <input
                    type="date"
                    name="dataLimite"
                    required
                    value={formData.dataLimite}
                    onChange={handleChange}
                    className="w-1/2 p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <input
                    type="time"
                    name="timeLimite"
                    required
                    value={formData.timeLimite}
                    onChange={handleChange}
                    className="w-1/2 p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                </div>
            </div>
            <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável
                </label>
                <select
                name="responsavel"
                required
                value={formData.responsavel}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                >
                <option value="">Selecione</option>
                {houseMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                    {m.name || m.nome}
                    </option>
                ))}
                </select>
            </div>
            {/* Checkbox para Compra de Folga */}
            <div className="col-span-2 flex items-center pt-8">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <input
                    type="checkbox"
                    name="canBuyOut"
                    checked={formData.canBuyOut}
                    onChange={handleChange}
                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span>Disponível para "Compra de Folga"</span>
                </label>
            </div>
            </div>
            <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center"
            >
             {loading ? "Criando..." : "Criar Tarefa"}
            </button>
        </form>
      </div>
    </div>
  );
}
