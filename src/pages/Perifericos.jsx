import { useState } from "react";
import { Plus, Pencil, Trash2, Headphones, Monitor, Mouse, Keyboard, Cpu } from "lucide-react";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";

// --- MOCK DE MARCAS (Vindas de Catálogos) ---
const mockMarcas = [
    { id: 1, nome: "Dell" },
    { id: 2, nome: "Logitech" },
    { id: 3, nome: "Samsung" },
    { id: 4, nome: "LG" },
    { id: 5, nome: "Redragon" },
    { id: 6, nome: "HyperX" }
];

// --- MOCK DE MÁQUINAS (Para vínculo de periféricos) ---
const mockMaquinas = [
    { id: 1, nome: "PC-TI-01 (Carlos Eduardo)" },
    { id: 2, nome: "PC-DES-02 (Sucata)" },
    { id: 3, nome: "PC-[#103] (Recepção)" }
];

// --- DADOS INICIAIS DA PÁGINA COM MAQUINA_ID ---
const initialHeadsets = [
    { id: 1, modelo: "Cloud Stinger Core", status: "livre", marca_id: 6, maquina_id: null },
    { id: 2, modelo: "H390 USB", status: "inativo", marca_id: 2, maquina_id: 1 },
    { id: 3, modelo: "Hylas H260", status: "sucata", marca_id: 5, maquina_id: 2 } // Puxa o PC Sucata!
];

const initialMonitores = [
    { id: 1, polegadas: '24"', status: "ocupado", marca_id: 1, maquina_id: 1 },
    { id: 2, polegadas: '27"', status: "livre", marca_id: 3, maquina_id: null },
    { id: 3, polegadas: '21.5"', status: "sucata", marca_id: 4, maquina_id: 2 }
];

const initialMouses = [
    { id: 1, tipo: "com_fio", status: "ocupado", marca_id: 2, maquina_id: 1 },
    { id: 2, tipo: "bluetooth", status: "livre", marca_id: 2, maquina_id: null },
    { id: 3, tipo: "com_fio", status: "inativo", marca_id: 1, maquina_id: 3 }
];

const initialTeclados = [
    { id: 1, tipo: "com_fio", status: "ocupado", marca_id: 1, maquina_id: 1 },
    { id: 2, tipo: "bluetooth", status: "livre", marca_id: 2, maquina_id: null },
    { id: 3, tipo: "com_fio", status: "sucata", marca_id: 5, maquina_id: 2 }
];

// Helper para Renderizar Badges de Status
const getStatusBadge = (status) => {
    switch (status) {
        case "livre":
            return (
                <span className="inline-flex rounded-full bg-green-100 border border-green-200 px-3 py-1 text-xs font-semibold text-green-700">
                    Livre
                </span>
            );
        case "ocupado":
            return (
                <span className="inline-flex rounded-full bg-blue-100 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
                    Ocupado
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

// Helper para Renderizar Badge da Máquina Vinculada
const getMaquinaBadge = (id) => {
    if (!id) {
        return (
            <span className="inline-flex rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500 border border-gray-200">
                Sem Máquina (Em Estoque)
            </span>
        );
    }
    const maq = mockMaquinas.find(m => m.id === Number(id));
    return maq ? (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200">
            <Cpu size={12} />
            {maq.nome}
        </span>
    ) : "Desconhecida";
};

// Helper de Formatação de Tipo de Conexão
const formatTipo = (tipo) => {
    return tipo === "bluetooth" ? "Bluetooth / Sem Fio" : "Com Fio (USB)";
};

export default function Perifericos() {
    const [activeTab, setActiveTab] = useState("headsets"); // 'headsets', 'monitores', 'mouses' ou 'teclados'

    // Estados dos Dados
    const [headsets, setHeadsets] = useState(initialHeadsets);
    const [monitores, setMonitores] = useState(initialMonitores);
    const [mouses, setMouses] = useState(initialMouses);
    const [teclados, setTeclados] = useState(initialTeclados);

    // Modais e Seleções
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Campos dos Formulários
    const [modelo, setModelo] = useState("");
    const [polegadas, setPolegadas] = useState("");
    const [tipo, setTipo] = useState("com_fio");
    const [status, setStatus] = useState("livre");
    const [marcaId, setMarcaId] = useState(mockMarcas[0].id);
    const [maquinaId, setMaquinaId] = useState(""); // Novo campo de Máquina Vinculada

    // Abrir Modal de Cadastro
    const handleOpenCreate = () => {
        setSelectedItem(null);
        setModelo("");
        setPolegadas("");
        setTipo("com_fio");
        setStatus("livre");
        setMarcaId(mockMarcas[0].id);
        setMaquinaId("");
        setIsFormOpen(true);
    };

    // Abrir Modal de Edição
    const handleOpenEdit = (item) => {
        setSelectedItem(item);
        setStatus(item.status);
        setMarcaId(item.marca_id);
        setMaquinaId(item.maquina_id || "");

        if (activeTab === "headsets") {
            setModelo(item.modelo);
        } else if (activeTab === "monitores") {
            setPolegadas(item.polegadas);
        } else {
            setTipo(item.tipo);
        }
        setIsFormOpen(true);
    };

    // Abrir Modal de Exclusão
    const handleOpenDelete = (item) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    // Salvar Registo
    const handleSave = (e) => {
        e.preventDefault();
        const payloadMaquinaId = maquinaId ? Number(maquinaId) : null;

        if (activeTab === "headsets") {
            if (!modelo.trim()) return;
            const payload = { modelo, status, marca_id: Number(marcaId), maquina_id: payloadMaquinaId };
            if (selectedItem) {
                setHeadsets(prev => prev.map(h => h.id === selectedItem.id ? { ...payload, id: h.id } : h));
            } else {
                setHeadsets(prev => [...prev, { ...payload, id: Date.now() }]);
            }
        } else if (activeTab === "monitores") {
            if (!polegadas.trim()) return;
            const payload = { polegadas, status, marca_id: Number(marcaId), maquina_id: payloadMaquinaId };
            if (selectedItem) {
                setMonitores(prev => prev.map(m => m.id === selectedItem.id ? { ...payload, id: m.id } : m));
            } else {
                setMonitores(prev => [...prev, { ...payload, id: Date.now() }]);
            }
        } else if (activeTab === "mouses") {
            const payload = { tipo, status, marca_id: Number(marcaId), maquina_id: payloadMaquinaId };
            if (selectedItem) {
                setMouses(prev => prev.map(m => m.id === selectedItem.id ? { ...payload, id: m.id } : m));
            } else {
                setMouses(prev => [...prev, { ...payload, id: Date.now() }]);
            }
        } else {
            const payload = { tipo, status, marca_id: Number(marcaId), maquina_id: payloadMaquinaId };
            if (selectedItem) {
                setTeclados(prev => prev.map(t => t.id === selectedItem.id ? { ...payload, id: t.id } : t));
            } else {
                setTeclados(prev => [...prev, { ...payload, id: Date.now() }]);
            }
        }

        setIsFormOpen(false);
    };

    // Confirmar Exclusão
    const handleDeleteConfirm = () => {
        if (!selectedItem) return;

        if (activeTab === "headsets") {
            setHeadsets(prev => prev.filter(h => h.id !== selectedItem.id));
        } else if (activeTab === "monitores") {
            setMonitores(prev => prev.filter(m => m.id !== selectedItem.id));
        } else if (activeTab === "mouses") {
            setMouses(prev => prev.filter(m => m.id !== selectedItem.id));
        } else {
            setTeclados(prev => prev.filter(t => t.id !== selectedItem.id));
        }
    };

    // Helper para buscar nome da Marca pelo ID
    const getMarcaNome = (id) => {
        const marca = mockMarcas.find(m => m.id === Number(id));
        return marca ? marca.nome : "Não informada";
    };

    return (
        <div className="space-y-6">
            {/* Header + Botão de Ação */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="block md:hidden mb-1">
                        <span className="text-sm font-semibold text-gray-600">Olá,</span>
                        <h2 className="text-lg font-bold text-gray-900">Laura Dias!</h2>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Periféricos</h1>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#eba882] px-5 py-2.5 font-bold text-gray-900 transition-all hover:bg-[#e4976c] active:scale-95 shadow-sm"
                >
                    <Plus size={20} />
                    <span>
                        Novo{" "}
                        {activeTab === "headsets"
                            ? "Headset"
                            : activeTab === "monitores"
                            ? "Monitor"
                            : activeTab === "mouses"
                            ? "Mouse"
                            : "Teclado"}
                    </span>
                </button>
            </div>

            {/* Abas de Navegação */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveTab("headsets")}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                        activeTab === "headsets"
                            ? "bg-[#9bb3a8] text-gray-900 shadow-sm"
                            : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <Headphones size={16} />
                    Headsets
                </button>

                <button
                    onClick={() => setActiveTab("monitores")}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                        activeTab === "monitores"
                            ? "bg-[#9bb3a8] text-gray-900 shadow-sm"
                            : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <Monitor size={16} />
                    Monitores
                </button>

                <button
                    onClick={() => setActiveTab("mouses")}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                        activeTab === "mouses"
                            ? "bg-[#9bb3a8] text-gray-900 shadow-sm"
                            : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <Mouse size={16} />
                    Mouses
                </button>

                <button
                    onClick={() => setActiveTab("teclados")}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                        activeTab === "teclados"
                            ? "bg-[#9bb3a8] text-gray-900 shadow-sm"
                            : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <Keyboard size={16} />
                    Teclados
                </button>
            </div>

            {/* Tabela de Dados */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-[#fdebe1] text-xs font-bold uppercase text-gray-800">
                            <tr>
                                <th className="px-6 py-4 w-24">ID</th>
                                {activeTab === "headsets" && <th className="px-6 py-4">Modelo</th>}
                                {activeTab === "monitores" && <th className="px-6 py-4">Polegadas</th>}
                                {(activeTab === "mouses" || activeTab === "teclados") && (
                                    <th className="px-6 py-4">Tipo de Conexão</th>
                                )}
                                <th className="px-6 py-4">Marca</th>
                                <th className="px-6 py-4">Máquina Vinculada</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center w-32">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {activeTab === "headsets" &&
                                headsets.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-gray-50/80">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{item.modelo}</td>
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            {getMarcaNome(item.marca_id)}
                                        </td>
                                        <td className="px-6 py-4">{getMaquinaBadge(item.maquina_id)}</td>
                                        <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                                                    title="Editar"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDelete(item)}
                                                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            {activeTab === "monitores" &&
                                monitores.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-gray-50/80">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{item.polegadas}</td>
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            {getMarcaNome(item.marca_id)}
                                        </td>
                                        <td className="px-6 py-4">{getMaquinaBadge(item.maquina_id)}</td>
                                        <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                                                    title="Editar"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDelete(item)}
                                                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            {activeTab === "mouses" &&
                                mouses.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-gray-50/80">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{formatTipo(item.tipo)}</td>
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            {getMarcaNome(item.marca_id)}
                                        </td>
                                        <td className="px-6 py-4">{getMaquinaBadge(item.maquina_id)}</td>
                                        <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                                                    title="Editar"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDelete(item)}
                                                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            {activeTab === "teclados" &&
                                teclados.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-gray-50/80">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{formatTipo(item.tipo)}</td>
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            {getMarcaNome(item.marca_id)}
                                        </td>
                                        <td className="px-6 py-4">{getMaquinaBadge(item.maquina_id)}</td>
                                        <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                                                    title="Editar"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDelete(item)}
                                                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
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
                              activeTab === "headsets"
                                  ? "Headset"
                                  : activeTab === "monitores"
                                  ? "Monitor"
                                  : activeTab === "mouses"
                                  ? "Mouse"
                                  : "Teclado"
                          }`
                        : `Novo ${
                              activeTab === "headsets"
                                  ? "Headset"
                                  : activeTab === "monitores"
                                  ? "Monitor"
                                  : activeTab === "mouses"
                                  ? "Mouse"
                                  : "Teclado"
                          }`
                }
            >
                <form onSubmit={handleSave} className="space-y-4">
                    {activeTab === "headsets" && (
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                Modelo do Headset
                            </label>
                            <input
                                type="text"
                                value={modelo}
                                onChange={(e) => setModelo(e.target.value)}
                                placeholder="Ex: Cloud Stinger, H390..."
                                autoFocus
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                            />
                        </div>
                    )}

                    {activeTab === "monitores" && (
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                Polegadas
                            </label>
                            <input
                                type="text"
                                value={polegadas}
                                onChange={(e) => setPolegadas(e.target.value)}
                                placeholder='Ex: 24", 27", 21.5"...'
                                autoFocus
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                            />
                        </div>
                    )}

                    {(activeTab === "mouses" || activeTab === "teclados") && (
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                Tipo de Conexão
                            </label>
                            <select
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                            >
                                <option value="com_fio">Com Fio (USB)</option>
                                <option value="bluetooth">Bluetooth / Sem Fio</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                            Marca
                        </label>
                        <select
                            value={marcaId}
                            onChange={(e) => setMarcaId(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                        >
                            {mockMarcas.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                            Máquina Vinculada (Onde está instalado / ligado?)
                        </label>
                        <select
                            value={maquinaId}
                            onChange={(e) => setMaquinaId(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
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
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                        >
                            <option value="livre">Livre</option>
                            <option value="ocupado">Ocupado</option>
                            <option value="sucata">Sucata</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsFormOpen(false)}
                            className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-[#eba882] px-5 py-2 text-sm font-bold text-gray-900 hover:bg-[#e4976c]"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal de Exclusão */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                message={`Tem certeza que deseja excluir este item?`}
            />
        </div>
    );
}