import { UserPlus, Home, DoorOpen } from "../ui/Icos";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "create" ? "create" : "join";

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  
  // Mode: 'join' or 'create'
  const [mode, setMode] = useState<"join" | "create">(initialMode);

  // Join Mode Fields
  const [houseCode, setHouseCode] = useState("");

  // Create Mode Fields
  const [houseName, setHouseName] = useState("");
  const [newHouseCode, setNewHouseCode] = useState("");

  const [error, setError] = useState("");
  
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      console.log("Submitting Register:", { mode, houseCode, houseName, newHouseCode }); // Debug Log
      if (mode === "join") {
        if (!houseCode || !houseCode.trim()) {
            setError("Por favor, informe o código da casa.");
            return;
        }
        await register(nome, email, senha, houseCode.trim()); // Remove undefined/optional logic for now to force it
      } else {
        await register(nome, email, senha, undefined, { 
            name: houseName, 
            code: newHouseCode 
        });
      }
      navigate("/"); 
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Falha no cadastro. Tente novamente.";
      setError(msg);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-2xl max-w-md mx-auto my-12 animate-in fade-in zoom-in duration-300">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Criar Conta</h2>
      
      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl w-full mb-6">
          <button
            type="button"
            onClick={() => setMode("join")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition flex items-center justify-center gap-2 ${
                mode === "join" 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <DoorOpen className="w-4 h-4" /> Entrar em Casa
          </button>
          <button
            type="button"
            onClick={() => setMode("create")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition flex items-center justify-center gap-2 ${
                mode === "create" 
                ? "bg-white text-green-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Home className="w-4 h-4" /> Criar Casa
          </button>
      </div>

      {error && (
        <div className="w-full bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Common Fields */}
        <input
          type="text"
          placeholder="Seu Nome"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <input
          type="text"
          placeholder="Seu Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <input
          type="password"
          placeholder="Crie uma Senha"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* Dynamic Fields */}
        <div className="pt-4 border-t border-gray-100">
            {mode === "join" && (
                <div className="space-y-2 animate-in slide-in-from-left-4 duration-300">
                    <label className="text-xs font-bold text-gray-500 uppercase">Se Juntar a uma Casa</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Código da Casa (Ex: AB1234)"
                            value={houseCode}
                            onChange={(e) => setHouseCode(e.target.value.toUpperCase())}
                            className="w-full p-3 border border-indigo-200 bg-indigo-50 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-mono text-indigo-700"
                            required={mode === "join"}
                        />
                    </div>
                    <p className="text-xs text-gray-400">Insira o código compartilhado pelo administrador da casa.</p>
                </div>
            )}

            {mode === "create" && (
                 <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <label className="text-xs font-bold text-gray-500 uppercase">Criar Nova Casa</label>
                    <input
                        type="text"
                        placeholder="Nome da Casa (Ex: República)"
                        required={mode === "create"}
                        value={houseName}
                        onChange={(e) => setHouseName(e.target.value)}
                        className="w-full p-3 border border-green-200 bg-green-50 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <input
                        type="text"
                        placeholder="Crie um Código (Ex: MINHACASA)"
                        required={mode === "create"}
                        value={newHouseCode}
                        onChange={(e) => setNewHouseCode(e.target.value.toUpperCase().trim())}
                        className="w-full p-3 border border-green-200 bg-green-50 rounded-lg focus:ring-2 focus:ring-green-500 outline-none uppercase font-mono text-green-700"
                    />
                </div>
            )}
        </div>

        <button
          type="submit"
          className={`w-full p-3 rounded-lg font-bold text-white transition flex items-center justify-center shadow-lg ${
              mode === "join" 
               ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
               : "bg-green-600 hover:bg-green-700 shadow-green-200"
          }`}
        >
          <UserPlus className="w-5 h-5 mr-2" /> 
          {mode === "join" ? "Cadastrar & Entrar" : "Cadastrar & Criar"}
        </button>
      </form>
      <Link
        to="/login"
        className="mt-6 text-sm text-gray-500 hover:text-indigo-600 font-medium transition"
      >
        Já tem conta? <span className="underline">Voltar para o Login</span>
      </Link>
    </div>
  );
}
