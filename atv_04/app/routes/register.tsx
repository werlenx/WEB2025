import { useForm, type SubmitHandler } from "react-hook-form";
import React from "react"; 

type Inputs = {
    email: string;
    username: string;
    senha: string;
};

export default function AuthLogin() {
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
                <div className="bg-[#F9FAFA] h-screen w-200 lg:rounded-tl-3xl shadow-none flex items-center justify-center "> 
                    
                    <div className="mx-auto py-12 px-6 rounded-xl bg-[#F9FAFA]"> 

                        <div className="flex justify-center mb-10">
                            <img src="/logodowarley.png" alt="" />
                        </div>

                        <div className="mb-4 border-1 border-gray-500 p-12 rounded-xl">
                            <h2 className="text-xl font-semibold text-gray-800 mb-1">Acesse o portal</h2>
                            <p className="text-sm text-gray-600 mb-6">Entre usando seu e-mail e senha cadastrados</p>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                                <div>
                                    <label htmlFor="username" className="block text-xs font-medium text-gray-700 uppercase mb-1">USUÁRIO</label>
                                    <input 
                                        id="username"
                                        type="text" 
                                        placeholder="digite seu nome de usuário"
                                        className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-purple-500 text-gray-700" 
                                        {...register("username", { required: true })}
                                    />
                                    {errors.username && <p className="text-red-500 text-xs mt-1">O nome de usuário é obrigatório.</p>}
                                </div>
                                
                                <div>
                                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 uppercase mb-1">E-MAIL</label>
                                    <input 
                                        id="email"
                                        type="email"
                                        placeholder="exemplo@mail.com"
                                        className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-purple-500 text-gray-700" 
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
                                        className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-purple-500 text-gray-700"
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
                        
                        <div className="mt-8 p-12 border-1 border-gray-500 rounded-xl">
                            <h3 className="text-base font-medium text-gray-800 mb-1"> Já tem uma conta?</h3>
                            <p className="text-sm text-gray-600 mb-4">Entre agora mesmo</p>
                            <a 
                                href="/" 
                                className="inline-block w-full bg-[#E3E5EB] text-gray-800 font-medium py-2 rounded-md hover:bg-gray-500 transition-colors duration-200 text-center"
                            >
                                Acessar conta
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}