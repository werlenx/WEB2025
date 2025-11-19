import { useForm, type SubmitHandler } from "react-hook-form";
import React from "react"; 

type Inputs = {
    email: string;
    senha: string;
};

export default function LoginForm() {
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log("Dados do Login:", data);
    };

    return (
        <div className=" bg-purple-900 flex justify-end">
            <div>
                <div className="bg-white h-screen w-200 lg:rounded-tl-3xl shadow-none flex items-center justify-center"> 
                    
                    <div className="w-full max-w-xs mx-auto my-auto py-12 px-6 border-black-3000 bg-red-500 rounded-lg"> 

                        <div className="flex justify-center mb-10">
                            {/* Logo */}
                            <svg className="h-8 w-auto text-purple-700" fill="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" /> 
                            </svg>
                            <span className="ml-2 text-2xl font-semibold text-gray-800">HelpDesk</span>
                        </div>

                        {/* CARD 1: ACESSO AO PORTAL */}
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-1">Acesse o portal</h2>
                            <p className="text-sm text-gray-600 mb-6">Entre usando seu e-mail e senha cadastrados</p>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                
                                <div>
                                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 uppercase mb-1">E-MAIL</label>
                                    <input 
                                        id="email"
                                        type="email"
                                        placeholder="exemplo@mail.com"
                                        className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-purple-500" 
                                        {...register("email", { required: true })}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">O email é obrigatório.</p>}
                                </div>

                                <div>
                                    <label htmlFor="senha" className="block text-xs font-medium text-gray-700 uppercase mb-1">SENHA</label>
                                    <input 
                                        id="senha"
                                        type="password"
                                        placeholder="Digite sua senha"
                                        className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-purple-500"
                                        {...register("senha", { required: true })}
                                    />
                                    {errors.senha && <p className="text-red-500 text-xs mt-1">A senha é obrigatória.</p>}
                                </div>
                    
                                <button 
                                    type="submit" 
                                    className="w-full bg-gray-800 text-white font-medium py-3 rounded-md hover:bg-gray-700 transition-colors duration-200 mt-6"
                                >
                                    Entrar
                                </button>
                            </form>
                        </div>
                        
                        {/* CARD 2: CRIAR CONTA */}
                        <div className="mt-8 pt-4 border-t border-gray-100">
                            <h3 className="text-base font-medium text-gray-800 mb-1">Ainda não tem uma conta?</h3>
                            <p className="text-sm text-gray-600 mb-4">Cadastre agora mesmo</p>
                            <a 
                                href="/authRegister" 
                                className="inline-block w-full bg-gray-100 text-gray-800 font-medium py-2 rounded-md hover:bg-gray-200 transition-colors duration-200 text-center"
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