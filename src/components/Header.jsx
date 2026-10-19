import { Search, User, Menu } from "lucide-react";

export default function Header({ onOpenMenu }) {
    return (
        <header className="flex items-center justify-between gap-3 px-4 py-4 sm:px-8">
            {/* Esquerda: Botão Menu Mobile + Campo de Pesquisa */}
            <div className="flex items-center gap-2 flex-1 max-w-xs sm:max-w-sm md:max-w-md">
                {/* Botão Hambúrguer (visível apenas em telas menores que 'md') */}
                <button
                    onClick={onOpenMenu}
                    className="p-1.5 text-gray-800 rounded-lg md:hidden hover:bg-white/20 focus:outline-none"
                    aria-label="Abrir menu"
                >
                    <Menu size={26} />
                </button>

                {/* Campo de Pesquisa */}
                <div className="relative flex w-full items-center">
                    <input
                        type="text"
                        placeholder="Pesquisa..."
                        className="w-full rounded-full bg-gray-200/70 py-1.5 sm:py-2 pl-4 pr-10 text-xs sm:text-sm outline-none placeholder:text-gray-500 focus:bg-gray-200"
                    />
                    <button 
                        type="button"
                        className="absolute right-1 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#eba882] text-gray-800 transition-opacity hover:opacity-90"
                    >
                        <Search size={16} />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                {/* A saudação em texto só aparece do breakpoint 'md' em diante */}
                <div className="text-right leading-tight hidden md:block">
                    <span className="block text-xs sm:text-sm font-semibold text-gray-700">Olá,</span>
                    <span className="block text-sm sm:text-base font-bold text-black">Laura Dias!</span>
                </div>

                {/* Ícone / Foto de Perfil */}
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 border-black bg-transparent">
                    <User size={24} className="text-black" />
                </div>
            </div>
        </header>
    );
}