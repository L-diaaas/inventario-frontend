// src/layouts/Layout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAutoLogout } from "../hooks/useAutoLogout";

export default function Layout() {
    const navigate = useNavigate();

    // Função de Logout
    const handleLogout = () => {
        // 1. Limpa tokens / sessão
        localStorage.removeItem("token"); // ou limpa o estado global/contexto
        
        // 2. Redireciona para a tela de login
        alert("Sua sessão expirou por inatividade.");
        navigate("/login");
    };

    // Ativa o auto-logout configurado para 15 minutos (por exemplo)
    useAutoLogout(handleLogout, 15);

    return (
        <div className="flex min-h-screen bg-cervix-card">
            <Sidebar />
            <div className="flex flex-1 flex-col min-w-0">
                <Header />
                <main className="flex-1 rounded-t-3xl md:rounded-tr-none md:rounded-tl-[35px] bg-white p-4 sm:p-6 md:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}