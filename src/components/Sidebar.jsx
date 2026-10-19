import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import logo from '../assets/logoESol.png'

const links = [
    {to: '/home', label: 'Início'},
    {to: '/catalogos', label: 'Catálogos'},
    {to: '/localizacao', label: 'Localização'},
    {to: '/pessoas', label: 'Pessoas'},
    {to: '/equipamentos', label: 'Equipamentos'},
    {to: '/componentes', label: 'Componentes'},
    {to: '/perifericos', label: 'Periféricos'},
    {to: '/especificacoes', label: 'Especificações'}
]

export default function Sidebar() {
    return(
        <aside className="hidden w-64 shrink-0 flex-col px-4 py-6 md:flex">
            <img src={logo} alt="CERVIX" className="mx-auto mb-10 w-30" />

            <nav className="flex flex-1 flex-col gap-1">
                {links.map(({to,label}) => (
                    <NavLink key={to} to={to} className={({isActive}) => `-mr-4 rounded-l-2xl py-1 pl-6 pr-4 font-semibold transition-colors ${isActive ? 'bg-white text-cervix-verde':'text-cervix-botao hover:bg-white/30'}`}>{label}</NavLink>
                ))}
            </nav>
            <button className="flex cursor-pointer flex-col items-center gap-1 font-bold">
                <LogOut size={36}/>
                Sair
            </button>
        </aside>
    )
}