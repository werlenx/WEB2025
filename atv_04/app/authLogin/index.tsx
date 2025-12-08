import { useForm, type SubmitHandler } from "react-hook-form";
import React from "react";

type Inputs = {
  email: string;
  senha: string;
};

export default function AuthLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  // const onSubmit: SubmitHandler<Inputs> = (data) => {
  //     console.log("Dados do Login:", data);
  // };
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { email, senha } = data;

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: senha,
        }),
      });
      const result = await response.json();

      if (response.ok) {
        console.log("Login bem-sucedido:", result);
        window.location.href = "/dashboard";
      } else {
        console.error("Erro no Login:", result.error);
        alert(`Falha no login: ${result.error || "Erro desconhecido."}`);
      }
    } catch (error) {
      console.error("Erro de rede/servidor:", error);
      alert(
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando."
      );
    }
  };

  return (
    <div className=" bg-purple-900 flex justify-end">
      <div>
        <div className="bg-[#F9FAFA] h-screen w-200 lg:rounded-tl-3xl shadow-none flex items-center justify-center ">
          <div className="mx-auto py-12 px-6 rounded-xl bg-[#F9FAFA]">
            <div className="flex justify-center mb-10">
              <img src="/logodowarley.png" alt="" />
            </div>

            <div className="mb-4 border-1 border-gray-500 p-12 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Acesse o portal
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Entre usando seu e-mail e senha cadastrados
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-gray-700 uppercase mb-1"
                  >
                    E-MAIL
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="exemplo@mail.com"
                    className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-purple-500 text-gray-700"
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      O email é obrigatório.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="senha"
                    className="block text-xs font-medium text-gray-700 uppercase mb-1"
                  >
                    SENHA
                  </label>
                  <input
                    id="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-purple-500 text-gray-700"
                    {...register("senha", { required: true })}
                  />
                  {errors.senha && (
                    <p className="text-red-500 text-xs mt-1">
                      A senha é obrigatória.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white font-medium py-3 rounded-md hover:bg-gray-700 transition-colors duration-200 mt-6"
                >
                  Entrar
                </button>
              </form>
            </div>

            <div className="mt-8 p-12 border-1 border-gray-500 rounded-xl">
              <h3 className="text-base font-medium text-gray-800 mb-1">
                Ainda não tem uma conta?
              </h3>
              <p className="text-sm text-gray-600 mb-4">Cadastre agora mesmo</p>
              <a
                href="/register"
                className="inline-block w-full bg-[#E3E5EB] text-gray-800 font-medium py-2 rounded-md hover:bg-gray-500 transition-colors duration-200 text-center"
              >
                Criar conta
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
