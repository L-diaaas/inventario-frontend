import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";

// Mapeamento dos campos e rótulos por separador
const TAB_CONFIG = {
    marcas: {
        label: "Marca",
        fieldKey: "nome",
        fieldLabel: "Nome da Marca",
        placeholder: "Ex: Dell, HP, Lenovo...",
        tableHeader: "Nome"
    },
    sistemas: {
        label: "Sistemas Operacionais",
        fieldKey: "versao",
        fieldLabel: "Versão do Sistema",
        placeholder: "Ex: Windows 11 Pro, Ubuntu 22.04...",
        tableHeader: "Versão"
    },
    memorias: {
        label: "Tipo Memória Ram",
        fieldKey: "tipo",
        fieldLabel: "Tipo de Memória",
        placeholder: "Ex: DDR4 8GB, DDR5 16GB...",
        tableHeader: "Tipo"
    }
};

// Dados de exemplo simplificados
const initialMockData = {
    marcas: [
        { id: 1, nome: "Dell" },
        { id: 2, nome: "HP" },
        { id: 3, nome: "Lenovo" }
    ],
    sistemas: [
        { id: 1, versao: "Windows 11 Pro" },
        { id: 2, versao: "Ubuntu 22.04 LTS" }
    ],
    memorias: [
        { id: 1, tipo: "DDR4 8GB" },
        { id: 2, tipo: "DDR5 16GB" }
    ]
};

export default function Catalogos() {
    const [activeTab, setActiveTab] = useState("marcas");
    const [data, setData] = useState(initialMockData);
    
    // Estados dos Modais
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    
    // Item selecionado para Edição ou Eliminação
    const [selectedItem, setSelectedItem] = useState(null);
    const [formValue, setFormValue] = useState("");

    const currentConfig = TAB_CONFIG[activeTab];

    // Abrir modal para novo registo
    const handleOpenCreate = () => {
        setSelectedItem(null);
        setFormValue("");
        setIsFormOpen(true);
    };

    // Abrir modal para edição
    const handleOpenEdit = (item) => {
        setSelectedItem(item);
        setFormValue(item[currentConfig.fieldKey]);
        setIsFormOpen(true);
    };

    // Abrir modal para eliminação
    const handleOpenDelete = (item) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    // Guardar (Novo ou Edição)
    const handleSave = (e) => {
        e.preventDefault();
        if (!formValue.trim()) return;

        if (selectedItem) {
            // Editar item existente
            setData(prev => ({
                ...prev,
                [activeTab]: prev[activeTab].map(item =>
                    item.id === selectedItem.id
                        ? { ...item, [currentConfig.fieldKey]: formValue }
                        : item
                )
            }));
        } else {
            // Criar novo item
            const newItem = {
                id: Date.now(),
                [currentConfig.fieldKey]: formValue
            };
            setData(prev => ({
                ...prev,
                [activeTab]: [...prev[activeTab], newItem]
            }));
        }

        setIsFormOpen(false);
    };

    // Confirmar eliminação
    const handleDeleteConfirm = () => {
        if (!selectedItem) return;
        setData(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].filter(item => item.id !== selectedItem.id)
        }));
    };

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="block md:hidden mb-1">
                        <span className="text-sm font-semibold text-gray-600">Olá,</span>
                        <h2 className="text-lg font-bold text-gray-900">Laura Dias!</h2>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Catálogos</h1>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#eba882] px-5 py-2.5 font-bold text-gray-900 transition-all hover:bg-[#e4976c] active:scale-95 shadow-sm"
                >
                    <Plus size={20} />
                    <span>Novo Registo</span>
                </button>
            </div>

            {/* Separadores (Abas) */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
                {Object.entries(TAB_CONFIG).map(([key, config]) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                            activeTab === key
                                ? "bg-[#9bb3a8] text-gray-900 shadow-sm"
                                : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {config.label}
                    </button>
                ))}
            </div>

            {/* Tabela Simplificada */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-[#fdebe1] text-xs font-bold uppercase text-gray-800">
                            <tr>
                                <th className="px-6 py-4 w-24">ID</th>
                                <th className="px-6 py-4">{currentConfig.tableHeader}</th>
                                <th className="px-6 py-4 text-center w-32">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data[activeTab].map((item) => (
                                <tr key={item.id} className="transition-colors hover:bg-gray-50/80">
                                    <td className="px-6 py-4 font-medium text-gray-900">#{item.id}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">
                                        {item[currentConfig.fieldKey]}
                                    </td>
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
                                                title="Eliminar"
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
                title={selectedItem ? `Editar ${currentConfig.label}` : `Novo Registo em ${currentConfig.label}`}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                            {currentConfig.fieldLabel}
                        </label>
                        <input
                            type="text"
                            value={formValue}
                            onChange={(e) => setFormValue(e.target.value)}
                            placeholder={currentConfig.placeholder}
                            autoFocus
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                        />
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
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal de Eliminação */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                message={`Tem a certeza que deseja eliminar "${selectedItem?.[currentConfig.fieldKey]}"?`}
            />
        </div>
    );
}