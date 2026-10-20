import { useState } from "react";
import { Plus, Pencil, Trash2, HardDrive, Cpu, CircuitBoard, Monitor, Link as LinkIcon, Layers } from "lucide-react";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";

// --- MOCKS DE DADOS DE RELACIONAMENTO ---
const initialTiposMemoria = [
    { id: 1, tipo: "DDR4" },
    { id: 2, tipo: "DDR5" },
    { id: 3, tipo: "DDR3" }
];

const mockMarcas = [
    { id: 1, nome: "Intel" },
    { id: 2, nome: "AMD" }
];

// Lista de Máquinas cadastradas no sistema
const mockMaquinas = [
    { id: 1, nome: "PC-TI-01 (Carlos Eduardo)", status: "em_uso" },
    { id: 2, nome: "PC-DES-02 (Sucata)", status: "sucata" },
    { id: 3, nome: "PC-[#103] (Recepção)", status: "em_uso" }
];

// --- DADOS INICIAIS ---
const initialArmazenamento = [
    { id: 1, quantidade: "500 GB SSD", status: "em_uso", maquina_id: 1 },
    { id: 2, quantidade: "1 TB HD", status: "sucata", maquina_id: 2 },
    { id: 3, quantidade: "256 GB NVMe", status: "sobrando", maquina_id: null }
];

const initialMemoriaRam = [
    { id: 1, quantidade: "16 GB", status: "em_uso", tipo_memoria_ram_id: 1, maquina_id: 1 },
    { id: 2, quantidade: "8 GB", status: "sucata", tipo_memoria_ram_id: 1, maquina_id: 2 },
    { id: 3, quantidade: "32 GB", status: "sobrando", tipo_memoria_ram_id: 2, maquina_id: null }
];

const initialProcessadores = [
    { id: 1, quantidade: "Core i7-11700", status: "em_uso", marca_id: 1, maquina_id: 1 },
    { id: 2, quantidade: "Ryzen 5 5600X", status: "sucata", marca_id: 2, maquina_id: 2 },
    { id: 3, quantidade: "Core i5-10400", status: "sobrando", marca_id: 1, maquina_id: null }
];

// Helper para Badges de Status
const getStatusBadge = (status) => {
    switch (status) {
        case "em_uso":
            return (
                <span className="inline-flex rounded-full bg-green-100 border border-green-200 px-3 py-1 text-xs font-semibold text-green-700">
                    Em Uso
                </span>
            );
        case "sobrando":
        case "livre":
            return (
                <span className="inline-flex rounded-full bg-blue-100 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
                    Estoque / Sobrando
                </span>
            );
        case "sucata":
            return (
                <span className="inline-flex rounded-full bg-red-100 border border-red-200 px-3 py-1 text-xs font-semibold text-red-700">
                    Sucata
                </span>
            );
        case "inativo":
            return (
                <span className="inline-flex rounded-full bg-gray-100 border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
                    Inativo
                </span>
            );
        default:
            return null;
    }
};

export default function Componentes() {
    // Abas: 'armazenamento', 'memoria_ram', 'processadores', 'tipo_memoria_ram'
    const [activeTab, setActiveTab] = useState("armazenamento");

    // Estados dos Dados
    const [armazenamentos, setArmazenamentos] = useState(initialArmazenamento);
    const [memorias, setMemorias] = useState(initialMemoriaRam);
    const [processadores, setProcessadores] = useState(initialProcessadores);
    const [tiposMemoria, setTiposMemoria] = useState(initialTiposMemoria);

    // Modais e Seleção
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Campos dos Formulários
    const [quantidade, setQuantidade] = useState("");
    const [status, setStatus] = useState("em_uso");
    const [tipoMemoriaId, setTipoMemoriaId] = useState(initialTiposMemoria[0]?.id || "");
    const [marcaId, setMarcaId] = useState(mockMarcas[0].id);
    const [maquinaId, setMaquinaId] = useState("");
    const [tipoNome, setTipoNome] = useState(""); // Exclusivo para Tipo de Memória RAM

    // Resolver Nome da Máquina Vinculada
    const getMaquinaBadge = (id) => {
        if (!id) {
            return (
                <span className="inline-flex rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500 border border-gray-200">
                    Sem Máquina (Em Estoque)
                </span>
            );
        }
        const maq = mockMaquinas.find((m) => m.id === Number(id));
        return maq ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200">
                <Monitor size={12} />
                {maq.nome}
            </span>
        ) : (
            "Desconhecida"
        );
    };

    // Helper para buscar nome do Tipo de Memória pelo ID
    const getTipoMemoriaNome = (id) => {
        const found = tiposMemoria.find((t) => t.id === Number(id));
        return found ? found.tipo : "Não informado";
    };

    // Helper para buscar nome da Marca pelo ID
    const getMarcaNome = (id) => {
        const marca = mockMarcas.find((m) => m.id === Number(id));
        return marca ? marca.nome : "Não informada";
    };

    // Helper para Uso do Tipo de Memória RAM em tempo real
    const getUsoTipoMemoria = (tipoId) => {
        const memoriasUsando = memorias.filter((m) => Number(m.tipo_memoria_ram_id) === Number(tipoId));
        if (memoriasUsando.length === 0) {
            return <span className="text-xs text-gray-400 italic">Nenhum módulo cadastrado com este padrão</span>;
        }
        return (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 border border-green-200">
                <LinkIcon size={12} />
                {memoriasUsando.length} {memoriasUsando.length === 1 ? "módulo" : "módulos"} ({memoriasUsando.map((m) => m.quantidade).join(", ")})
            </span>
        );
    };

    // Abrir Modal de Cadastro
    const handleOpenCreate = () => {
        setSelectedItem(null);
        setQuantidade("");
        setTipoNome("");
        setStatus("em_uso");
        setMaquinaId("");
        setTipoMemoriaId(tiposMemoria[0]?.id || "");
        setMarcaId(mockMarcas[0].id);
        setIsFormOpen(true);
    };

    // Abrir Modal de Edição
    const handleOpenEdit = (item) => {
        setSelectedItem(item);
        if (activeTab === "tipo_memoria_ram") {
            setTipoNome(item.tipo);
        } else {
            setQuantidade(item.quantidade);
            setStatus(item.status);
            setMaquinaId(item.maquina_id || "");
            if (activeTab === "memoria_ram") setTipoMemoriaId(item.tipo_memoria_ram_id);
            if (activeTab === "processadores") setMarcaId(item.marca_id);
        }
        setIsFormOpen(true);
    };

    // Abrir Modal de Exclusão
    const handleOpenDelete = (item) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    // Salvar Registro
    const handleSave = (e) => {
        e.preventDefault();
        const payloadMaquinaId = maquinaId ? Number(maquinaId) : null;

        if (activeTab === "armazenamento") {
            if (!quantidade.trim()) return;
            const payload = { quantidade, status, maquina_id: payloadMaquinaId };
            setArmazenamentos((prev) =>
                selectedItem
                    ? prev.map((a) => (a.id === selectedItem.id ? { ...payload, id: a.id } : a))
                    : [...prev, { ...payload, id: Date.now() }]
            );
        } else if (activeTab === "memoria_ram") {
            if (!quantidade.trim()) return;
            const payload = {
                quantidade,
                status,
                tipo_memoria_ram_id: Number(tipoMemoriaId),
                maquina_id: payloadMaquinaId
            };
            setMemorias((prev) =>
                selectedItem
                    ? prev.map((m) => (m.id === selectedItem.id ? { ...payload, id: m.id } : m))
                    : [...prev, { ...payload, id: Date.now() }]
            );
        } else if (activeTab === "processadores") {
            if (!quantidade.trim()) return;
            const payload = {
                quantidade,
                status,
                marca_id: Number(marcaId),
                maquina_id: payloadMaquinaId
            };
            setProcessadores((prev) =>
                selectedItem
                    ? prev.map((p) => (p.id === selectedItem.id ? { ...payload, id: p.id } : p))
                    : [...prev, { ...payload, id: Date.now() }]
            );
        } else if (activeTab === "tipo_memoria_ram") {
            if (!tipoNome.trim()) return;
            const payload = { tipo: tipoNome };
            setTiposMemoria((prev) =>
                selectedItem
                    ? prev.map((t) => (t.id === selectedItem.id ? { ...payload, id: t.id } : t))
                    : [...prev, { ...payload, id: Date.now() }]
            );
        }

        setIsFormOpen(false);
    };

    // Confirmar Exclusão
    const handleDeleteConfirm = () => {
        if (!selectedItem) return;

        if (activeTab === "armazenamento") {
            setArmazenamentos((prev) => prev.filter((a) => a.id !== selectedItem.id));
        } else if (activeTab === "memoria_ram") {
            setMemorias((prev) => prev.filter((m) => m.id !== selectedItem.id));
        } else if (activeTab === "processadores") {
            setProcessadores((prev) => prev.filter((p) => p.id !== selectedItem.id));
        } else if (activeTab === "tipo_memoria_ram") {
            setTiposMemoria((prev) => prev.filter((t) => t.id !== selectedItem.id));
        }

        setIsDeleteOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Header + Botão de Ação Dinâmico */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="block md:hidden mb-1">
                        <span className="text-sm font-semibold text-gray-600">Olá,</span>
                        <h2 className="text-lg font-bold text-gray-900">Laura Dias!</h2>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Componentes</h1>
                    <p className="text-xs text-gray-500 mt-1">Gestão de hardware interno, capacidades e vinculação de máquinas</p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#eba882] px-5 py-2.5 font-bold text-gray-900 transition-all hover:bg-[#e4976c] active:scale-95 shadow-sm"
                >
                    <Plus size={20} />
                    <span>
                        Novo{" "}
                        {activeTab === "armazenamento"
                            ? "Armazenamento"
                            : activeTab === "memoria_ram"
                            ? "Módulo de RAM"
                            : activeTab === "processadores"
                            ? "Processador"
                            : "Tipo de RAM"}
                    </span>
                </button>
            </div>

            {/* Abas de Navegação */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveTab("armazenamento")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                        activeTab === "armazenamento"
                            ? "bg-[#9bb3a8] text-gray-900 shadow-sm"
                            : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <HardDrive size={16} /> Armazenamento
                </button>

                <button
                    onClick={() => setActiveTab("memoria_ram")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                        activeTab === "memoria_ram"
                            ? "bg-[#9bb3a8] text-gray-900 shadow-sm"
                            : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <CircuitBoard size={16} /> Memória RAM
                </button>

                <button
                    onClick={() => setActiveTab("processadores")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                        activeTab === "processadores"
                            ? "bg-[#9bb3a8] text-gray-900 shadow-sm"
                            : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <Cpu size={16} /> Processadores
                </button>

                <button
                    onClick={() => setActiveTab("tipo_memoria_ram")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                        activeTab === "tipo_memoria_ram"
                            ? "bg-[#9bb3a8] text-gray-900 shadow-sm"
                            : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <Layers size={16} /> Tipo de Memória RAM
                </button>
            </div>

            {/* Tabela de Dados */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-[#fdebe1] text-xs font-bold uppercase text-gray-800">
                            <tr>
                                <th className="px-6 py-4 w-24">ID</th>
                                {activeTab === "armazenamento" && <th className="px-6 py-4">Capacidade / Tecnologia</th>}
                                {activeTab === "memoria_ram" && (
                                    <>
                                        <th className="px-6 py-4">Capacidade</th>
                                        <th className="px-6 py-4">Tipo de RAM</th>
                                    </>
                                )}
                                {activeTab === "processadores" && (
                                    <>
                                        <th className="px-6 py-4">Modelo do Processador</th>
                                        <th className="px-6 py-4">Marca</th>
                                    </>
                                )}
                                {activeTab === "tipo_memoria_ram" && (
                                    <>
                                        <th className="px-6 py-4">Padrão / Tecnologia</th>
                                        <th className="px-6 py-4">Uso no Sistema (Módulos Cadastrados)</th>
                                    </>
                                )}
                                {activeTab !== "tipo_memoria_ram" && (
                                    <>
                                        <th className="px-6 py-4">Máquina Onde Está Instalado</th>
                                        <th className="px-6 py-4">Status</th>
                                    </>
                                )}
                                <th className="px-6 py-4 text-center w-32">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* 1. Armazenamento */}
                            {activeTab === "armazenamento" &&
                                armazenamentos.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">#{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{item.quantidade}</td>
                                        <td className="px-6 py-4">{getMaquinaBadge(item.maquina_id)}</td>
                                        <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDelete(item)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            {/* 2. Memória RAM */}
                            {activeTab === "memoria_ram" &&
                                memorias.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">#{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{item.quantidade}</td>
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            {getTipoMemoriaNome(item.tipo_memoria_ram_id)}
                                        </td>
                                        <td className="px-6 py-4">{getMaquinaBadge(item.maquina_id)}</td>
                                        <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDelete(item)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            {/* 3. Processadores */}
                            {activeTab === "processadores" &&
                                processadores.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">#{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{item.quantidade}</td>
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            {getMarcaNome(item.marca_id)}
                                        </td>
                                        <td className="px-6 py-4">{getMaquinaBadge(item.maquina_id)}</td>
                                        <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDelete(item)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            {/* 4. Tipo de Memória RAM */}
                            {activeTab === "tipo_memoria_ram" &&
                                tiposMemoria.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">#{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{item.tipo}</td>
                                        <td className="px-6 py-4">{getUsoTipoMemoria(item.id)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDelete(item)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Formulário (Criar / Editar) */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={
                    selectedItem
                        ? `Editar ${
                              activeTab === "armazenamento"
                                  ? "Armazenamento"
                                  : activeTab === "memoria_ram"
                                  ? "Memória RAM"
                                  : activeTab === "processadores"
                                  ? "Processador"
                                  : "Tipo de Memória RAM"
                          }`
                        : `Novo ${
                              activeTab === "armazenamento"
                                  ? "Armazenamento"
                                  : activeTab === "memoria_ram"
                                  ? "Memória RAM"
                                  : activeTab === "processadores"
                                  ? "Processador"
                                  : "Tipo de Memória RAM"
                          }`
                }
            >
                <form onSubmit={handleSave} className="space-y-4">
                    {/* Caso 1: Formulário do Tipo de Memória RAM */}
                    {activeTab === "tipo_memoria_ram" ? (
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                Padrão / Tecnologia de RAM
                            </label>
                            <input
                                type="text"
                                value={tipoNome}
                                onChange={(e) => setTipoNome(e.target.value)}
                                placeholder="Ex: DDR4, DDR5, LPDDR4..."
                                autoFocus
                                className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none focus:border-gray-400"
                            />
                        </div>
                    ) : (
                        /* Caso 2: Componentes Físicos (Armazenamento, RAM e Processadores) */
                        <>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    {activeTab === "armazenamento"
                                        ? "Capacidade / Modelo"
                                        : activeTab === "memoria_ram"
                                        ? "Capacidade"
                                        : "Modelo do Processador"}
                                </label>
                                <input
                                    type="text"
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(e.target.value)}
                                    placeholder={
                                        activeTab === "armazenamento"
                                            ? "Ex: 500 GB SSD, 1 TB NVMe..."
                                            : activeTab === "memoria_ram"
                                            ? "Ex: 8 GB, 16 GB, 32 GB..."
                                            : "Ex: Core i7-11700, Ryzen 5 5600X..."
                                    }
                                    autoFocus
                                    className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none focus:border-gray-400"
                                />
                            </div>

                            {activeTab === "memoria_ram" && (
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                        Padrão / Tipo de RAM
                                    </label>
                                    <select
                                        value={tipoMemoriaId}
                                        onChange={(e) => setTipoMemoriaId(e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 p-2.5 text-sm bg-white outline-none focus:border-gray-400"
                                    >
                                        {tiposMemoria.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.tipo}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {activeTab === "processadores" && (
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                        Marca
                                    </label>
                                    <select
                                        value={marcaId}
                                        onChange={(e) => setMarcaId(e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 p-2.5 text-sm bg-white outline-none focus:border-gray-400"
                                    >
                                        {mockMarcas.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    Máquina Vinculada (Onde está instalado?)
                                </label>
                                <select
                                    value={maquinaId}
                                    onChange={(e) => setMaquinaId(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 p-2.5 text-sm bg-white outline-none focus:border-gray-400"
                                >
                                    <option value="">Nenhuma / Em Estoque Solto</option>
                                    {mockMaquinas.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 p-2.5 text-sm bg-white outline-none focus:border-gray-400"
                                >
                                    <option value="em_uso">Em Uso</option>
                                    <option value="sobrando">Estoque / Sobrando</option>
                                    <option value="sucata">Sucata</option>
                                    <option value="inativo">Inativo</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => setIsFormOpen(false)}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-[#eba882] px-5 py-2 text-sm font-bold text-gray-900 hover:bg-[#e4976c]"
                        >
                            Salvar Componente
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal de Confirmação de Exclusão */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                message={`Tem certeza que deseja excluir este item?`}
            />
        </div>
    );
}