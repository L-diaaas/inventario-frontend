// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    // Exemplo: verifica se existe token salvo ou se o estado global diz que está autenticado
    const isAuthenticated = Boolean(localStorage.getItem("token"));

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}