import React, { useState, useEffect } from "react";
import TaskFormModal from "../components/modals/TaskFormModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function CreateTask() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(true);
  const [houseMembers, setHouseMembers] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.papel !== "admin" && user.papel !== "ADMIN") {
      alert("Acesso negado: Apenas ADMIN pode criar tarefas.");
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await api.get("/house");
        // A API retorna a casa com a propriedade 'members'
        if (response.data && response.data.members) {
             setHouseMembers(response.data.members);
        }
      } catch (error) {
        console.error("Erro ao buscar membros da casa", error);
        // Fallback para o usuário atual em caso de erro (ex: sem casa)
        if (user) setHouseMembers([{ id: user.id, name: user.nome }]);
      }
    }
    fetchMembers();
  }, [user]);

  const handleClose = () => {
    setShowModal(false);
    navigate("/"); // Volta para dashboard ao fechar
  };

  const handleSuccess = () => {
      alert("Tarefa criada com sucesso!");
      navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <h2 className="text-xl text-gray-500 mb-4">Abrindo formulário...</h2>
        {/* Reusing the Modal, but passing visible=true always for this page context or we could refactor Modal to be a standalone form if needed. 
            For now, rendering the Modal over this "empty" page works as a quick implementation of the menu item action. 
        */}
        <TaskFormModal 
            visible={showModal} 
            onClose={handleClose} 
            onSuccess={handleSuccess}
            houseMembers={houseMembers}
        />
    </div>
  );
}
