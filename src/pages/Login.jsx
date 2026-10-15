import { useState } from 'react'
import line1laranja from '../assets/line1-laranja.png'
import line2laranja from '../assets/line2-laranja.png'
import line1verde from '../assets/line1-verde.png'
import line2verde from '../assets/line2-verde.png'
import logoSol from '../assets/cervixSol.png'
import { User, Eye, EyeOff } from 'lucide-react'


export default function Login() {

    const [mostrarSenha, setMostrarSenha] = useState(false)

    return(
        <main className="relative min-h-screen overflow-hidden bg-white">

            {/* Linhas do canto superior esquerdo e inferior direito, respectivamente*/}
            <img src={line2laranja} alt="" className="pointer-events-none absolute -top-40 left-0 w-1/2 md:w-1/3" />
            <img src={line1verde} alt="" className="pointer-events-none absolute -top-20 left-0 w-1/2 md:w-1/3" />
            <img src={line2verde} alt="" className="pointer-events-none absolute -right-10 bottom-0 w-2/3 md:w-1/3" />
            <img src={line1laranja} alt="" className="pointer-events-none absolute -right-10 bottom-0 w-2/3 md:w-1/3" />

            {/* Logo do Sol ao fundo do formulário para login */}
            <img src={logoSol} alt="" className="hidden lg:block absolute top-[64%] right-[5%] -translate-x-1/2 -translate-y-1/2 " />

            {/* Formulário de login */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 px-4">
                <header className="text-center">
                    <h1 className="font-serif text-4xl font-bold text-cervix-verde md:text-6xl">CERVIX</h1>
                    <p className="mt-4 font-serif text-xl text-black md:text-3xl">Inventário de Equipamentos</p>
                </header>

                {/* Caixa do formulário */}
                <form className="flex w-full max-w-md flex-col lg:rounded-l-2xl lg:rounded-r-none bg-cervix-card/95 px-8 py-10 shadow-lg lg:-translate-x-[10vw] md:-translate-x-[0vw] rounded-2xl">
                    <User size={56} className="self-center text-white" />
                    <h2 className="mt-2 mb-6 text-center text-2xl font-bold text-white">Entrar</h2>

                    <label htmlFor="usuario" className="mb-1 ml-3 font-semibold text-white">Usuário ou E-mail</label>
                    <input id="usuario" type={mostrarSenha ? 'text' : 'password'} className="mb-4 h-14 rounded-2xl border border-cervix-verde bg-cervix-campo px-4 focus:ring-2 focus:ring-cervix-verde focus:outline-none"/>

                    <label htmlFor="senha" className="mb-1 ml-3 font-semibold text-white">Senha</label>
                    <div className="relative mb-4">
                        <input id="senha" type={mostrarSenha ? 'text' : 'password'} className="h-14 w-full rounded-2xl border border-cervix-verde bg-cervix-campo px-4 pr-12 focus:ring-2 focus:ring-cervix-verde focus:outline-none"/>
                        <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} aria-label={mostrarSenha ? 'Esconder senha' : 'Mostrar senha'} className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-cervix-botao">{mostrarSenha ? <EyeOff size={22} /> : <Eye size={22} />}</button>
                    </div>

                    <button type="submit" className="mt-6 cursor-pointer self-center rounded-2xl bg-cervix-botao px-10 py-3 font-bold text-white shadow-md transition-colors hover:bg-green-800">Entrar</button>
                </form>
            </div>
        </main>
    )

}