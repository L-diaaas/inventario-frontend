import { useEffect } from "react";

export function useAutoLogout(onLogout, timeoutInMinutes = 15) {
    useEffect(() => {
        let timer;

        // Função que reinicia o contador
        const resetTimer = () => {
            clearTimeout(timer);
            // Converte minutos para milissegundos
            timer = setTimeout(onLogout, timeoutInMinutes * 60 * 1000);
        };

        // Eventos que indicam que o usuário está ativo
        const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

        // Adiciona os ouvintes de eventos
        events.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        // Inicia o contador pela primeira vez
        resetTimer();

        // Limpeza dos eventos ao desmontar ou deslogar (essencial para não vazar memória!)
        return () => {
            clearTimeout(timer);
            events.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [onLogout, timeoutInMinutes]);
}