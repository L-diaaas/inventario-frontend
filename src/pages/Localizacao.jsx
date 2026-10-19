import { useState } from "react";
import { Plus, Pencil, Trash2, Building, LayoutGrid, Monitor, User } from "lucide-react";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";

// --- MOCKS DE RELACIONAMENTO ---
const mockAndares = [
    { id: 1, nome: "1º Andar - Operacional" },
    { id: 2, nome: "2º Andar - TI & Diretoria" },
    { id: 3, nome: "Térreo - Recepção" }
];

const mockColaboradores = [
    { id: 1, nome: "Carlos Eduardo" },
    { id: 2, nome: "Ana Paula" },
    { id: 3, nome: "Mariana Costa" }
];

const mockMaquinas = [
    { id: 1, nome: "PC-TI-01" },
    { id: 2, nome: "PC-DES-02" }
];

// --- DADOS INICIAIS DAS MESAS COM VÍNCULOS ---
const initialMesas = [
    {
        id: 1,
        numero: "Mesa 01",
        status: "ocupada",
        andar_id: 2,
        colaborador_id: 1, // Carlos Eduardo
        maquina_id: 1       // PC-TI-01
    },
    {
        id: 2,
        numero: "Mesa 02",
        status: "ocupada",
        andar_id: 2,
        colaborador_id: 2, // Ana Paula
        maquina_id: 2       // PC-DES-02
    },
    {
        id: 3,
        numero: "Mesa 03",
        status: "livre",
        andar_id: 1,
        colaborador_id: null,
        maquina_id: null
    }
];

export default function Localizacao() {
    const [activeTab, setActiveTab] = useState("mesas"); // 'andares' ou 'mesas'
    const [mesas, setMesas] = useState(initialMesas);
    const [andares, setAndares] = useState(mockAndares);

    // Modais
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Form Mesa
    const [formMesa, setFormMesa] = useState({
        numero: "",
        status: "livre",
        andar_id: mockAndares[0].id,
        colaborador_id: "",
        maquina_id: ""
    });

    const getName = (list, id, fallback = "Nenhum") => {
        if (!id) return fallback;
        const found = list.find(item => item.id === Number(id));
        return found ? (found.nome || found.numero) : fallback;
    };

    const handleOpenCreate = () => {
        setSelectedItem(null);
        setFormMesa({
            numero: "",
            status: "livre",
            andar_id: mockAndares[0].id,
            colaborador_id: "",
            maquina_id: ""
        });
        setIsFormOpen(true);
    };

    const handleOpenEdit = (item) => {
        setSelectedItem(item);
        setFormMesa({
            ...item,
            colaborador_id: item.colaborador_id || "",
            maquina_id: item.maquina_id || ""
        });
        setIsFormOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const payload = {
            ...formMesa,
            andar_id: Number(formMesa.andar_id),
            colaborador_id: formMesa.colaborador_id ? Number(formMesa.colaborador_id) : null,
            maquina_id: formMesa.maquina_id ? Number(formMesa.maquina_id) : null,
            status: formMesa.colaborador_id || formMesa.maquina_id ? "ocupada" : formMesa.status
        };

        if (selectedItem) {
            setMesas(prev => prev.map(m => m.id === selectedItem.id ? { ...payload, id: m.id } : m));
        } else {
            setMesas(prev => [...prev, { ...payload, id: Date.now() }]);
        }
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Localização</h1>
                    <p className="text-xs text-gray-500 mt-1">Gestão de andares, posições de trabalho e seus ocupantes</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#eba882] px-5 py-2.5 font-bold text-gray-900 transition-all hover:bg-[#e4976c] shadow-sm"
                >
                    <Plus size={20} />
                    <span>Nova Mesa</span>
                </button>
            </div>

            {/* Abas */}
            <div className="flex gap-2 border-b border-gray-100 pb-3">
                <button
                    onClick={() => setActiveTab("mesas")}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                        activeTab === "mesas" ? "bg-[#9bb3a8] text-gray-900 shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    <LayoutGrid size={16} /> Mesas
                </button>
                <button
                    onClick={() => setActiveTab("andares")}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                        activeTab === "andares" ? "bg-[#9bb3a8] text-gray-900 shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    <Building size={16} /> Andares
                </button>
            </div>

            {/* Tabela de Mesas com Vínculos */}
            {activeTab === "mesas" && (
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-[#fdebe1] text-xs font-bold uppercase text-gray-800">
                            <tr>
                                <th className="px-6 py-4">Mesa / Posição</th>
                                <th className="px-6 py-4">Andar</th>
                                <th className="px-6 py-4">Colaborador Alocado</th>
                                <th className="px-6 py-4">Máquina na Mesa</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mesas.map((mesa) => (
                                <tr key={mesa.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-gray-900">{mesa.numero}</td>
                                    <td className="px-6 py-4 font-medium text-gray-700">{getName(andares, mesa.andar_id)}</td>
                                    <td className="px-6 py-4">
                                        {mesa.colaborador_id ? (
                                            <span className="inline-flex items-center gap-1.5 font-semibold text-gray-800">
                                                <User size={14} className="text-gray-400" />
                                                {getName(mockColaboradores, mesa.colaborador_id)}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Livre (Sem colaborador)</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {mesa.maquina_id ? (
                                            <span className="inline-flex items-center gap-1.5 font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                                                <Monitor size={14} />
                                                {getName(mockMaquinas, mesa.maquina_id)}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Sem máquina</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            mesa.status === 'ocupada' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {mesa.status === 'ocupada' ? 'Ocupada' : 'Livre'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleOpenEdit(mesa)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => { setSelectedItem(mesa); setIsDeleteOpen(true); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de Formulário com Opção de Alocação */}
            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Cadastro de Mesa">
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Identificação da Mesa</label>
                        <input
                            type="text"
                            value={formMesa.numero}
                            onChange={(e) => setFormMesa({ ...formMesa, numero: e.target.value })}
                            placeholder="Ex: Mesa 14, Estação TI-02"
                            className="w-full rounded-xl border p-2.5 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Andar</label>
                        <select
                            value={formMesa.andar_id}
                            onChange={(e) => setFormMesa({ ...formMesa, andar_id: e.target.value })}
                            className="w-full rounded-xl border p-2.5 text-sm bg-white"
                        >
                            {andares.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Colaborador Ocupante</label>
                            <select
                                value={formMesa.colaborador_id}
                                onChange={(e) => setFormMesa({ ...formMesa, colaborador_id: e.target.value })}
                                className="w-full rounded-xl border p-2.5 text-sm bg-white"
                            >
                                <option value="">Nenhum / Mesa Vazia</option>
                                {mockColaboradores.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Máquina Alocada</label>
                            <select
                                value={formMesa.maquina_id}
                                onChange={(e) => setFormMesa({ ...formMesa, maquina_id: e.target.value })}
                                className="w-full rounded-xl border p-2.5 text-sm bg-white"
                            >
                                <option value="">Nenhuma / Sem Máquina</option>
                                {mockMaquinas.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-600">Cancelar</button>
                        <button type="submit" className="rounded-xl bg-[#eba882] px-5 py-2 text-sm font-bold text-gray-900">Salvar Mesa</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}