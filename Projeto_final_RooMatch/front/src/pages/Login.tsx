import { LogIn } from "../ui/Icos";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, senha);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Falha no login. Verifique suas credenciais.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-2xl max-w-sm mx-auto my-12">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">
        Bem-vindo(a) ao Roomatch
      </h2>
      <p className="text-gray-500 mb-6 text-center">
        Entre para gerenciar suas tarefas e o ranking.
      </p>
      
      {error && (
        <div className="w-full bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Email (Ex: ana, bruno, carla)"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />

        <input
          type="password"
          name="senha"
          placeholder="Senha (Use: 1)"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center"
        >
          <LogIn className="w-5 h-5 mr-2" /> Entrar
        </button>
      </form>
      <div className="mt-6 flex flex-col items-center space-y-3 w-full">
        <p className="text-sm text-gray-500 font-medium">Não tem conta?</p>
        <Link
          to="/register"
          className="w-full text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 font-bold py-2 px-4 rounded-lg text-center transition text-sm"
        >
          Criar Conta e Juntar-se a uma Casa
        </Link>
      </div>
    </div>
  );
}
