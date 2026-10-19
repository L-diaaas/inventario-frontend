import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Cpu, Zap, HardDrive, Clock, Check, Trash2 } from "lucide-react";

// Mock de Modificações Recentes (Feed de Atividades)
const mockModificacoes = [
    {
        id: 1,
        usuario: "Laura Dias",
        acao: "Cadastrou a máquina",
        item: "PC-TI-01",
        tempo: "há 10 min"
    },
    {
        id: 2,
        usuario: "Carlos Eduardo",
        acao: "Alterou status do Nobreak",
        item: "NB-002 para 'Para Arrumar'",
        tempo: "há 1 hora"
    },
    {
        id: 3,
        usuario: "Ana Paula",
        acao: "Atribuiu monitor",
        item: "Dell 24\" para Mariana Costa",
        tempo: "há 3 horas"
    },
    {
        id: 4,
        usuario: "Laura Dias",
        acao: "Excluiu componente",
        item: "HD 500GB (Sucata)",
        tempo: "há 1 dia"
    }
];

export default function Home() {
    const navigate = useNavigate();

    // Estado dos Lembretes (para poder adicionar/remover/concluir)
    const [lembretes, setLembretes] = useState([
        { id: 1, texto: "Trocar pasta térmica do PC-DES-02", concluido: false },
        { id: 2, texto: "Verificar garantia dos nobreaks do 2º andar", concluido: false },
        { id: 3, texto: "Comprar mais 5 mouses com fio", concluido: true }
    ]);
    const [novoLembrete, setNovoLembrete] = useState("");

    // Adicionar Lembrete
    const handleAddLembrete = (e) => {
        e.preventDefault();
        if (!novoLembrete.trim()) return;
        setLembretes(prev => [
            ...prev,
            { id: Date.now(), texto: novoLembrete, concluido: false }
        ]);
        setNovoLembrete("");
    };

    // Alternar Concluído
    const handleToggleLembrete = (id) => {
        setLembretes(prev =>
            prev.map(l => (l.id === id ? { ...l, concluido: !l.concluido } : l))
        );
    };

    // Remover Lembrete
    const handleRemoveLembrete = (id) => {
        setLembretes(prev => prev.filter(l => l.id !== id));
    };

    return (
        <div className="space-y-8">
            {/* 1. Header da Página + Saudação Mobile */}
            <div>
                <div className="block md:hidden mb-1">
                    <span className="text-sm font-semibold text-gray-600">Olá,</span>
                    <h2 className="text-xl font-bold text-gray-900">Laura Dias!</h2>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Início</h1>
            </div>

            {/* 2. Ações Rápidas */}
            <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                    Ações rápidas
                </h2>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate("/equipamentos")}
                        className="flex items-center gap-2 rounded-xl bg-[#eba882] px-5 py-2.5 font-bold text-gray-900 transition-all hover:bg-[#e4976c] active:scale-95 shadow-sm"
                    >
                        <Cpu size={18} />
                        <span>Listar Máquinas</span>
                    </button>

                    <button
                        onClick={() => navigate("/equipamentos")}
                        className="flex items-center gap-2 rounded-xl bg-[#9bb3a8] px-5 py-2.5 font-bold text-gray-900 transition-all hover:bg-[#8ca59a] active:scale-95 shadow-sm"
                    >
                        <Zap size={18} />
                        <span>Listar Nobreaks</span>
                    </button>

                    <button
                        onClick={() => navigate("/equipamentos")}
                        className="flex items-center gap-2 rounded-xl bg-gray-200/80 px-5 py-2.5 font-bold text-gray-800 transition-all hover:bg-gray-300 active:scale-95 shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Adicionar Máquina</span>
                    </button>
                </div>
            </div>

            {/* 3. Principais Itens (Cards Dashboard) */}
            <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                    Principais itens
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Card 1: Máquinas */}
                    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                        <div>
                            <p className="text-sm font-semibold text-gray-700 leading-tight">
                                Máquinas <br /> em uso
                            </p>
                            <p className="mt-2 text-xs font-medium text-gray-500">
                                de 85 máquinas
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-4xl font-extrabold text-[#4a7c59]">80</span>
                        </div>
                    </div>

                    {/* Card 2: Nobreaks */}
                    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                        <div>
                            <p className="text-sm font-semibold text-gray-700 leading-tight">
                                Nobreaks <br /> em uso
                            </p>
                            <p className="mt-2 text-xs font-medium text-gray-500">
                                de 20 nobreaks
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-4xl font-extrabold text-[#4a7c59]">30</span>
                        </div>
                    </div>

                    {/* Card 3: Memórias RAM */}
                    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md sm:col-span-2 lg:col-span-1">
                        <div>
                            <p className="text-sm font-semibold text-gray-700 leading-tight">
                                Memórias Ram <br /> disponíveis
                            </p>
                            <p className="mt-2 text-xs font-medium text-gray-500">
                                de 10 sucatas
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-4xl font-extrabold text-[#4a7c59]">05</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Grid Inferior: Lembretes + Modificações Recentes */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Lembretes (Coluna da Esquerda - 5/12) */}
                <div className="space-y-3 lg:col-span-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                        Lembretes
                    </h2>

                    <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                        {/* Formulário rápido para criar lembrete */}
                        <form onSubmit={handleAddLembrete} className="flex gap-2">
                            <input
                                type="text"
                                value={novoLembrete}
                                onChange={(e) => setNovoLembrete(e.target.value)}
                                placeholder="Novo lembrete..."
                                className="flex-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-gray-400"
                            />
                            <button
                                type="submit"
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eba882] text-gray-900 transition-transform active:scale-95 shrink-0"
                                title="Adicionar"
                            >
                                <Plus size={18} />
                            </button>
                        </form>

                        {/* Lista de Lembretes */}
                        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                            {lembretes.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition-all ${
                                        item.concluido
                                            ? "bg-gray-100 border-gray-200 text-gray-400 line-through"
                                            : "bg-white border-gray-100 text-gray-800 shadow-sm"
                                    }`}
                                >
                                    <div
                                        onClick={() => handleToggleLembrete(item.id)}
                                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                                    >
                                        <div
                                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                                                item.concluido
                                                    ? "border-green-600 bg-green-600 text-white"
                                                    : "border-gray-300 bg-white"
                                            }`}
                                        >
                                            {item.concluido && <Check size={14} />}
                                        </div>
                                        <span className="text-sm font-medium truncate">
                                            {item.texto}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleRemoveLembrete(item.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        title="Excluir lembrete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}

                            {lembretes.length === 0 && (
                                <p className="text-center text-xs text-gray-400 py-4">
                                    Nenhum lembrete no momento.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modificações Recentes (Coluna da Direita - 7/12) */}
                <div className="space-y-3 lg:col-span-7">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                        Modificações recentes
                    </h2>

                    <div className="rounded-2xl bg-[#9bb3a8] p-5 shadow-sm text-gray-900">
                        <div className="divide-y divide-gray-900/10 space-y-3">
                            {mockModificacoes.map((mod) => (
                                <div key={mod.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-gray-900">
                                            {mod.usuario}{" "}
                                            <span className="font-normal text-gray-800">
                                                {mod.acao.toLowerCase()}
                                            </span>
                                        </p>
                                        <p className="text-xs font-semibold text-gray-700 bg-white/40 inline-block px-2 py-0.5 rounded-md">
                                            {mod.item}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-800 font-medium shrink-0">
                                        <Clock size={12} />
                                        <span>{mod.tempo}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}