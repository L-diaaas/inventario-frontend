import { useState } from "react";
import { Plus, Pencil, Trash2, HardDrive, Cpu, CircuitBoard, Monitor } from "lucide-react";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";

// --- MOCKS DE DADOS DE RELACIONAMENTO ---
const mockTiposMemoria = [{ id: 1, tipo: "DDR4" }, { id: 2, tipo: "DDR5" }];
const mockMarcas = [{ id: 1, nome: "Intel" }, { id: 2, nome: "AMD" }];

// Lista de Máquinas cadastradas no sistema
const mockMaquinas = [
    { id: 1, nome: "PC-TI-01 (Carlos Eduardo)", status: "em_uso" },
    { id: 2, nome: "PC-DES-02 (Sucata)", status: "sucata" },
    { id: 3, nome: "PC-[#103] (Recepção)", status: "em_uso" }
];

// --- DADOS INICIAIS COM MAQUINA_ID ---
const initialArmazenamento = [
    { id: 1, quantidade: "500 GB SSD", status: "em_uso", maquina_id: 1 },
    { id: 2, quantidade: "1 TB HD", status: "sucata", maquina_id: 2 }, // <-- Agora você sabe qual PC Sucata!
    { id: 3, quantidade: "256 GB NVMe", status: "sobrando", maquina_id: null } // Solto no estoque
];

const initialMemoriaRam = [
    { id: 1, quantidade: "16 GB", status: "em_uso", tipo_memoria_ram_id: 1, maquina_id: 1 },
    { id: 2, quantidade: "8 GB", status: "sucata", tipo_memoria_ram_id: 1, maquina_id: 2 }
];

const initialProcessadores = [
    { id: 1, quantidade: "Core i7-11700", status: "em_uso", marca_id: 1, maquina_id: 1 },
    { id: 2, quantidade: "Ryzen 5 5600X", status: "sucata", marca_id: 2, maquina_id: 2 }
];

export default function Componentes() {
    const [activeTab, setActiveTab] = useState("armazenamento");
    const [armazenamentos, setArmazenamentos] = useState(initialArmazenamento);
    const [memorias, setMemorias] = useState(initialMemoriaRam);
    const [processadores, setProcessadores] = useState(initialProcessadores);

    // Modais
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Campos do Formulário
    const [quantidade, setQuantidade] = useState("");
    const [status, setStatus] = useState("em_uso");
    const [tipoMemoriaId, setTipoMemoriaId] = useState(mockTiposMemoria[0].id);
    const [marcaId, setMarcaId] = useState(mockMarcas[0].id);
    const [maquinaId, setMaquinaId] = useState(""); // Novo campo de máquina vinculada

    // Resolver Nome da Máquina Vinculada
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
                <Monitor size={12} />
                {maq.nome}
            </span>
        ) : "Desconhecida";
    };

    const handleOpenCreate = () => {
        setSelectedItem(null);
        setQuantidade("");
        setStatus("em_uso");
        setMaquinaId("");
        setIsFormOpen(true);
    };

    const handleOpenEdit = (item) => {
        setSelectedItem(item);
        setQuantidade(item.quantidade);
        setStatus(item.status);
        setMaquinaId(item.maquina_id || "");
        if (activeTab === "memoria_ram") setTipoMemoriaId(item.tipo_memoria_ram_id);
        if (activeTab === "processadores") setMarcaId(item.marca_id);
        setIsFormOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const payloadMaquinaId = maquinaId ? Number(maquinaId) : null;

        if (activeTab === "armazenamento") {
            const payload = { quantidade, status, maquina_id: payloadMaquinaId };
            setArmazenamentos(prev => selectedItem 
                ? prev.map(a => a.id === selectedItem.id ? { ...payload, id: a.id } : a)
                : [...prev, { ...payload, id: Date.now() }]
            );
        }
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Componentes</h1>
                <button onClick={handleOpenCreate} className="flex items-center gap-2 rounded-xl bg-[#eba882] px-5 py-2.5 font-bold">
                    <Plus size={20} /> Novo Componente
                </button>
            </div>

            {/* Tabela com a Coluna de Máquina Vinculada */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-[#fdebe1] text-xs font-bold uppercase text-gray-800">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Componente</th>
                            <th className="px-6 py-4">Máquina Onde Está Instalado</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {armazenamentos.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold">#{item.id}</td>
                                <td className="px-6 py-4 font-semibold text-gray-900">{item.quantidade}</td>
                                <td className="px-6 py-4">{getMaquinaBadge(item.maquina_id)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        item.status === 'em_uso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => handleOpenEdit(item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                        <Pencil size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal com opção de Vincular Máquina */}
            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Componente">
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Capacidade / Modelo</label>
                        <input
                            type="text"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            className="w-full rounded-xl border p-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                            Máquina Vinculada (Onde está instalado?)
                        </label>
                        <select
                            value={maquinaId}
                            onChange={(e) => setMaquinaId(e.target.value)}
                            className="w-full rounded-xl border p-2 text-sm bg-white"
                        >
                            <option value="">Nenhuma / Em Estoque Solto</option>
                            {mockMaquinas.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button type="submit" className="rounded-xl bg-[#eba882] px-5 py-2 font-bold">Salvar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}