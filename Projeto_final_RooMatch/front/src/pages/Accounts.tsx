import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Edit, Trash2, Plus } from "../ui/Icos";

export default function Accounts() {
  const { user } = useAuth();
  const [accountFilter, setAccountFilter] = useState("fixa");
  
  // Mock accounts
  const accounts = [
      { id: 1, name: "Aluguel", type: "fixa", amount: 1200, dueDate: "2024-12-10", paidBy: 1, status: "pending", division: { method: "equal" }, payments: { 1: { paid: true, amount: 400 }, 2: { paid: false, amount: 400 }, 3: { paid: false, amount: 400 } } },
      { id: 2, name: "Internet", type: "fixa", amount: 150, dueDate: "2024-12-15", paidBy: 2, status: "settled", division: { method: "equal" }, payments: { 1: { paid: true, amount: 50 }, 2: { paid: true, amount: 50 }, 3: { paid: true, amount: 50 } } },
  ];

  const accountsInHouse = accounts.filter(a => a.type === accountFilter);
  const isAdmin = user?.papel === "admin" || true; // Mock admin true

  const formatCurrency = (val: number) => `R$ ${val.toFixed(2)}`;

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Contas da Casa</h2>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2 p-1 bg-gray-100 rounded-xl shadow-inner">
            <button
              onClick={() => setAccountFilter("fixa")}
              className={`p-2 rounded-lg font-semibold text-sm transition ${
                accountFilter === "fixa"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-white"
              }`}
            >
              Contas Fixas
            </button>
            <button
              onClick={() => setAccountFilter("flutuante")}
              className={`p-2 rounded-lg font-semibold text-sm transition ${
                accountFilter === "flutuante"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-white"
              }`}
            >
              Contas Flutuantes
            </button>
          </div>
          {isAdmin && (
            <button
              onClick={() => alert("Criar Conta - Em breve")}
              className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" /> Adicionar Conta
            </button>
          )}
        </div>

        <div className="space-y-4">
          {accountsInHouse.length > 0 ? (
            accountsInHouse.map((account) => {
                const myPayment = account.payments[1]; // Mock user id
                const isPaid = myPayment?.paid;
                const myShare = myPayment?.amount || 0;
                const isSettled = Object.values(account.payments).every((p: any) => p.paid);
                
                return (
                    <div
                        key={account.id}
                        className={`p-4 rounded-xl shadow-md transition-all duration-300 ${
                            isSettled
                            ? "bg-green-50 border-l-4 border-green-500"
                            : "bg-white border-l-4 border-red-500"
                        }`}
                        >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold text-gray-800">{account.name}</h4>
                            <span
                            className={`text-xs font-bold text-white px-3 py-1 rounded-full flex-shrink-0 ${isSettled ? "bg-green-600" : "bg-red-600"}`}
                            >
                            {isSettled ? "QUITADA" : "PENDENTE"}
                            </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                            <p>Valor Total: <strong>{formatCurrency(account.amount)}</strong></p>
                            <p>Vencimento: <strong>{account.dueDate}</strong></p>
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                            <div>
                                <span className={`text-base font-extrabold ${isPaid ? "text-green-600" : "text-red-600"}`}>
                                    Sua Cota: {formatCurrency(myShare)}
                                </span>
                                <p className="text-xs font-medium text-gray-500">
                                    {isPaid ? "PAGO" : "PENDENTE"}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })
          ) : (
            <p className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
              Nenhuma conta {accountFilter} registrada.
            </p>
          )}
        </div>
    </div>
  );
}
