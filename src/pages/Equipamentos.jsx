import { useState } from "react";
import { 
    Plus, Pencil, Trash2, Cpu, Zap, Eye, X, 
    Monitor, Keyboard, Mouse, HardDrive, Calendar, 
    User, ShieldCheck, Network, Layers, Image as ImageIcon,
    Plug, Gauge, Battery, Activity
} from "lucide-react";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";

// --- MOCK COMPLETO DE DADOS DE RELACIONAMENTO ---
const mockModelos = [{ id: 1, nome: "Dell OptiPlex 3080" }, { id: 2, nome: "ThinkCentre M70q" }];
const mockColaboradores = [{ id: 1, nome: "Carlos Eduardo" }, { id: 2, nome: "Ana Paula" }];
const mockSistemasOperacionais = [{ id: 1, nome: "Windows 11 Pro" }, { id: 2, nome: "Ubuntu 22.04 LTS" }];
const mockProcessadores = [{ id: 1, nome: "Intel Core i7-11700" }, { id: 2, nome: "AMD Ryzen 5 5600X" }];
const mockArmazenamentos = [{ id: 1, nome: "SSD 512GB NVMe" }, { id: 2, nome: "SSD 1TB NVMe" }];
const mockMonitores = [{ id: 1, nome: 'Dell 24" P2419H' }, { id: 2, nome: 'LG 21.5" 22MP410' }];
const mockTeclados = [{ id: 1, nome: "Dell KB216 USB Preto" }, { id: 2, nome: "Logitech K120 ABNT2" }];
const mockMouses = [{ id: 1, nome: "Dell MS116 Óptico 1000DPI" }, { id: 2, nome: "Logitech M90 USB" }];

// Especificações exclusivas do Nobreak
const mockModelosNobreak = [{ id: 1, nome: "Lite Black 1200VA (SMS)" }, { id: 2, nome: "Attiv 600VA (Intelbras)" }];
const mockVoltagens = [{ id: 1, valor: "110V" }, { id: 2, valor: "220V" }, { id: 3, valor: "Bivolt (110V/220V)" }];
const mockQtdTomadas = [{ id: 1, valor: "4 tomadas" }, { id: 2, valor: "6 tomadas" }, { id: 3, valor: "8 tomadas" }];
const mockTiposTomada = [{ id: 1, valor: "NBR 14136 (10A)" }, { id: 2, valor: "NBR 14136 (20A)" }];

// --- DADOS INICIAIS DA APLICAÇÃO ---
const initialMaquinas = [
    {
        id: 1,
        nome: "PC-TI-01",
        s_tag: "STAG-9981A",
        status: "em_uso",
        internet: true,
        data_compra: "2023-01-15",
        fim_garantia: "2026-01-15",
        data_manutencao: "2025-08-20",
        memoria_ram_total: "16 GB",
        slots_ram_total: 4,
        slots_ram_usados: 2,
        processador_id: 1,
        armazenamento_id: 1,
        modelo_id: 1,
        colaborador_id: 1,
        nobreak_id: 1,
        sistema_operacional_id: 1,
        monitor_id: 1,
        monitor_secundario_id: 2,
        teclado_id: 1,
        mouse_id: 1
    },
    {
        id: 2,
        nome: "PC-DES-02",
        s_tag: "STAG-4421B",
        status: "sobrando",
        internet: false,
        data_compra: "2024-03-10",
        fim_garantia: "2027-03-10",
        data_manutencao: "2025-12-01",
        memoria_ram_total: "8 GB",
        slots_ram_total: 2,
        slots_ram_usados: 1,
        processador_id: 2,
        armazenamento_id: 2,
        modelo_id: 2,
        colaborador_id: 2,
        nobreak_id: null,
        sistema_operacional_id: 2,
        monitor_id: 2,
        monitor_secundario_id: null,
        teclado_id: 2,
        mouse_id: 2
    }
];

const initialNobreaks = [
    {
        id: 1,
        codigo: "NB-001",
        status: "em_uso",
        data_troca_bateria: "2025-11-10",
        foto: "",
        modelo_nobreak_id: 1,
        voltagem_id: 3,
        qtd_tomadas_id: 2,
        tipo_tomada_id: 1
    },
    {
        id: 2,
        codigo: "NB-002",
        status: "para_arrumar",
        data_troca_bateria: "2024-05-15",
        foto: "",
        modelo_nobreak_id: 2,
        voltagem_id: 1,
        qtd_tomadas_id: 1,
        tipo_tomada_id: 1
    }
];

export default function Equipamentos() {
    const [activeTab, setActiveTab] = useState("maquinas"); // 'maquinas' ou 'nobreaks'
    const [maquinas, setMaquinas] = useState(initialMaquinas);
    const [nobreaks, setNobreaks] = useState(initialNobreaks);

    // Modais e Estado da Ficha Notion
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [detailDrawerItem, setDetailDrawerItem] = useState(null);

    // --- ESTADOS DO FORMULÁRIO DE MÁQUINA ---
    const [formMaquina, setFormMaquina] = useState({
        nome: "",
        s_tag: "",
        status: "em_uso",
        internet: true,
        memoria_ram_total: "16 GB",
        slots_ram_total: 4,
        slots_ram_usados: 2,
        processador_id: mockProcessadores[0].id,
        armazenamento_id: mockArmazenamentos[0].id,
        data_compra: "",
        fim_garantia: "",
        data_manutencao: "",
        modelo_id: mockModelos[0].id,
        colaborador_id: mockColaboradores[0].id,
        nobreak_id: "",
        sistema_operacional_id: mockSistemasOperacionais[0].id,
        monitor_id: mockMonitores[0].id,
        monitor_secundario_id: "",
        teclado_id: mockTeclados[0].id,
        mouse_id: mockMouses[0].id
    });

    // --- ESTADOS DO FORMULÁRIO DE NOBREAK ---
    const [formNobreak, setFormNobreak] = useState({
        codigo: "",
        status: "em_uso",
        data_troca_bateria: "",
        foto: "",
        modelo_nobreak_id: mockModelosNobreak[0].id,
        voltagem_id: mockVoltagens[0].id,
        qtd_tomadas_id: mockQtdTomadas[0].id,
        tipo_tomada_id: mockTiposTomada[0].id
    });

    // Helper para mapear Nomes por ID
    const getName = (list, id, fallback = "Não informado") => {
        if (!id) return fallback;
        const found = list.find(item => item.id === Number(id));
        return found ? (found.nome || found.codigo || found.valor) : fallback;
    };

    // Ações de Abertura de Formulário
    const handleOpenCreate = () => {
        setSelectedItem(null);
        if (activeTab === "maquinas") {
            setFormMaquina({
                nome: "",
                s_tag: "",
                status: "em_uso",
                internet: true,
                memoria_ram_total: "16 GB",
                slots_ram_total: 4,
                slots_ram_usados: 2,
                processador_id: mockProcessadores[0].id,
                armazenamento_id: mockArmazenamentos[0].id,
                data_compra: "",
                fim_garantia: "",
                data_manutencao: "",
                modelo_id: mockModelos[0].id,
                colaborador_id: mockColaboradores[0].id,
                nobreak_id: "",
                sistema_operacional_id: mockSistemasOperacionais[0].id,
                monitor_id: mockMonitores[0].id,
                monitor_secundario_id: "",
                teclado_id: mockTeclados[0].id,
                mouse_id: mockMouses[0].id
            });
        } else {
            setFormNobreak({
                codigo: "",
                status: "em_uso",
                data_troca_bateria: "",
                foto: "",
                modelo_nobreak_id: mockModelosNobreak[0].id,
                voltagem_id: mockVoltagens[0].id,
                qtd_tomadas_id: mockQtdTomadas[0].id,
                tipo_tomada_id: mockTiposTomada[0].id
            });
        }
        setIsFormOpen(true);
    };

    const handleOpenEdit = (item) => {
        setSelectedItem(item);
        if (activeTab === "maquinas") {
            setFormMaquina({
                ...item,
                nobreak_id: item.nobreak_id || "",
                monitor_secundario_id: item.monitor_secundario_id || ""
            });
        } else {
            setFormNobreak({ ...item });
        }
        setIsFormOpen(true);
    };

    const handleOpenDelete = (item) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    // Upload de Imagem do Nobreak
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Por favor, selecione uma imagem válida.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormNobreak(prev => ({ ...prev, foto: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Salvar Registro
    const handleSave = (e) => {
        e.preventDefault();

        if (activeTab === "maquinas") {
            if (!formMaquina.nome.trim() || !formMaquina.s_tag.trim()) return;

            const payload = {
                ...formMaquina,
                nobreak_id: formMaquina.nobreak_id ? Number(formMaquina.nobreak_id) : null,
                monitor_secundario_id: formMaquina.monitor_secundario_id ? Number(formMaquina.monitor_secundario_id) : null,
                modelo_id: Number(formMaquina.modelo_id),
                colaborador_id: Number(formMaquina.colaborador_id),
                sistema_operacional_id: Number(formMaquina.sistema_operacional_id),
                processador_id: Number(formMaquina.processador_id),
                armazenamento_id: Number(formMaquina.armazenamento_id),
                monitor_id: Number(formMaquina.monitor_id),
                teclado_id: Number(formMaquina.teclado_id),
                mouse_id: Number(formMaquina.mouse_id),
                slots_ram_total: Number(formMaquina.slots_ram_total),
                slots_ram_usados: Number(formMaquina.slots_ram_usados)
            };

            if (selectedItem) {
                setMaquinas(prev => prev.map(m => m.id === selectedItem.id ? { ...payload, id: m.id } : m));
                if (detailDrawerItem?.id === selectedItem.id) setDetailDrawerItem({ ...payload, id: selectedItem.id });
            } else {
                setMaquinas(prev => [...prev, { ...payload, id: Date.now() }]);
            }
        } else {
            if (!formNobreak.codigo.trim()) return;

            const payload = {
                ...formNobreak,
                modelo_nobreak_id: Number(formNobreak.modelo_nobreak_id),
                voltagem_id: Number(formNobreak.voltagem_id),
                qtd_tomadas_id: Number(formNobreak.qtd_tomadas_id),
                tipo_tomada_id: Number(formNobreak.tipo_tomada_id)
            };

            if (selectedItem) {
                setNobreaks(prev => prev.map(n => n.id === selectedItem.id ? { ...payload, id: n.id } : n));
                if (detailDrawerItem?.id === selectedItem.id) setDetailDrawerItem({ ...payload, id: selectedItem.id });
            } else {
                setNobreaks(prev => [...prev, { ...payload, id: Date.now() }]);
            }
        }

        setIsFormOpen(false);
    };

    const handleDeleteConfirm = () => {
        if (!selectedItem) return;
        if (activeTab === "maquinas") {
            setMaquinas(prev => prev.filter(m => m.id !== selectedItem.id));
        } else {
            setNobreaks(prev => prev.filter(n => n.id !== selectedItem.id));
        }
        if (detailDrawerItem?.id === selectedItem.id) setDetailDrawerItem(null);
    };

    const renderStatusBadge = (status) => {
        const styles = {
            em_uso: "bg-green-100 text-green-700",
            sobrando: "bg-blue-100 text-blue-700",
            sucata: "bg-red-100 text-red-700",
            para_arrumar: "bg-amber-100 text-amber-700"
        };
        const labels = {
            em_uso: "Em Uso",
            sobrando: "Sobrando",
            sucata: "Sucata",
            para_arrumar: "Para Arrumar"
        };
        return (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${styles[status] || "bg-gray-100 text-gray-700"}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Equipamentos</h1>
                    <p className="text-xs text-gray-500 mt-1">Visão galeria interativa para rápida consulta e auditoria</p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#eba882] px-5 py-2.5 font-bold text-gray-900 transition-all hover:bg-[#e4976c] shadow-sm"
                >
                    <Plus size={20} />
                    <span>Nova {activeTab === "maquinas" ? "Máquina" : "Nobreak"}</span>
                </button>
            </div>

            {/* Abas */}
            <div className="flex gap-2 border-b border-gray-100 pb-3">
                <button
                    onClick={() => { setActiveTab("maquinas"); setDetailDrawerItem(null); }}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                        activeTab === "maquinas" ? "bg-[#9bb3a8] text-gray-900 shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    <Cpu size={16} /> Máquinas
                </button>
                <button
                    onClick={() => { setActiveTab("nobreaks"); setDetailDrawerItem(null); }}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                        activeTab === "nobreaks" ? "bg-[#9bb3a8] text-gray-900 shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    <Zap size={16} /> Nobreaks
                </button>
            </div>

            {/* 1. GALERIA DE MÁQUINAS */}
            {activeTab === "maquinas" && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {maquinas.map((maq) => (
                        <div
                            key={maq.id}
                            onClick={() => setDetailDrawerItem(maq)}
                            className="group relative cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-gray-400 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#eba882] transition-colors">
                                        {maq.nome}
                                    </h3>
                                    <span className="text-xs font-semibold text-gray-400">{maq.s_tag}</span>
                                </div>
                                {renderStatusBadge(maq.status)}
                            </div>

                            <div className="mt-4 space-y-2 text-xs text-gray-600">
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-gray-400" />
                                    <span className="font-semibold text-gray-800">{getName(mockColaboradores, maq.colaborador_id)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Cpu size={14} className="text-gray-400" />
                                    <span>{getName(mockProcessadores, maq.processador_id)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Layers size={14} className="text-gray-400" />
                                    <span>RAM: <strong>{maq.memoria_ram_total}</strong> ({maq.slots_ram_usados}/{maq.slots_ram_total} slots)</span>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50 text-xs">
                                <span className="flex items-center gap-1 font-semibold text-gray-500 hover:text-gray-900">
                                    <Eye size={14} /> Ficha Notion
                                </span>
                                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => handleOpenEdit(maq)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                                        <Pencil size={15} />
                                    </button>
                                    <button onClick={() => handleOpenDelete(maq)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 2. GALERIA DE NOBREAKS */}
            {activeTab === "nobreaks" && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {nobreaks.map((nb) => (
                        <div
                            key={nb.id}
                            onClick={() => setDetailDrawerItem(nb)}
                            className="group relative cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-gray-400 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900 group-hover:text-[#eba882] transition-colors">
                                            {nb.codigo}
                                        </h3>
                                        <span className="text-xs font-semibold text-gray-400">
                                            {getName(mockModelosNobreak, nb.modelo_nobreak_id)}
                                        </span>
                                    </div>
                                </div>
                                {renderStatusBadge(nb.status)}
                            </div>

                            <div className="mt-4 space-y-2 text-xs text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Gauge size={14} className="text-gray-400" />
                                    <span>Tensão: <strong className="text-gray-800">{getName(mockVoltagens, nb.voltagem_id)}</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Plug size={14} className="text-gray-400" />
                                    <span>Saídas: {getName(mockQtdTomadas, nb.qtd_tomadas_id)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Battery size={14} className="text-gray-400" />
                                    <span>Troca bateria: <strong className="text-gray-800">{nb.data_troca_bateria || "N/A"}</strong></span>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50 text-xs">
                                <span className="flex items-center gap-1 font-semibold text-gray-500 hover:text-gray-900">
                                    <Eye size={14} /> Ficha Notion
                                </span>
                                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => handleOpenEdit(nb)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                                        <Pencil size={15} />
                                    </button>
                                    <button onClick={() => handleOpenDelete(nb)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 3. GAVETA LATERAL DE PROPRIEDADES VERTICAIS (NOTION STYLE) */}
            {detailDrawerItem && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
                    <div className="relative h-full w-full max-w-xl bg-white p-6 shadow-2xl overflow-y-auto transition-all animate-in slide-in-from-right">
                        
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <div>
                                <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
                                    Ficha Técnica {activeTab === "maquinas" ? "da Máquina" : "do Nobreak"}
                                </span>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {activeTab === "maquinas" ? detailDrawerItem.nome : detailDrawerItem.codigo}
                                </h2>
                            </div>
                            <button
                                onClick={() => setDetailDrawerItem(null)}
                                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* FICHA TÉCNICA MÁQUINA */}
                        {activeTab === "maquinas" && (
                            <div className="mt-6 space-y-6">
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Identificação & Posse</h3>
                                    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 divide-y divide-gray-100 text-xs">
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><Cpu size={14}/> S_TAG</span><span className="font-bold text-gray-900">{detailDrawerItem.s_tag}</span></div>
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><User size={14}/> Colaborador</span><span className="font-bold text-gray-900">{getName(mockColaboradores, detailDrawerItem.colaborador_id)}</span></div>
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><ShieldCheck size={14}/> Status</span><span className="font-bold text-green-700 uppercase">{detailDrawerItem.status}</span></div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Processamento & Memória</h3>
                                    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 divide-y divide-gray-100 text-xs">
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><Cpu size={14}/> Processador</span><span className="font-bold text-gray-900">{getName(mockProcessadores, detailDrawerItem.processador_id)}</span></div>
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><Layers size={14}/> Memória RAM Total</span><span className="font-bold text-gray-900">{detailDrawerItem.memoria_ram_total}</span></div>
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><Layers size={14}/> Slots de Memória</span><span className="font-bold text-blue-700">{detailDrawerItem.slots_ram_usados} de {detailDrawerItem.slots_ram_total} slots ocupados</span></div>
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><HardDrive size={14}/> Armazenamento</span><span className="font-bold text-gray-900">{getName(mockArmazenamentos, detailDrawerItem.armazenamento_id)}</span></div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Periféricos Vinculados</h3>
                                    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 divide-y divide-gray-100 text-xs">
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><Monitor size={14}/> Monitor Principal</span><span className="font-bold text-gray-900">{getName(mockMonitores, detailDrawerItem.monitor_id)}</span></div>
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><Monitor size={14}/> Monitor Secundário</span><span className="font-bold text-gray-900">{getName(mockMonitores, detailDrawerItem.monitor_secundario_id, "Não possui")}</span></div>
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><Keyboard size={14}/> Teclado</span><span className="font-bold text-gray-900">{getName(mockTeclados, detailDrawerItem.teclado_id)}</span></div>
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><Mouse size={14}/> Mouse</span><span className="font-bold text-gray-900">{getName(mockMouses, detailDrawerItem.mouse_id)}</span></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* FICHA TÉCNICA NOBREAK */}
                        {activeTab === "nobreaks" && (
                            <div className="mt-6 space-y-6">
                                {detailDrawerItem.foto ? (
                                    <div className="overflow-hidden rounded-2xl border border-gray-200">
                                        <img src={detailDrawerItem.foto} alt="Nobreak" className="h-44 w-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-gray-400 text-xs">
                                        Sem foto cadastrada para este Nobreak
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Identificação & Status</h3>
                                    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 divide-y divide-gray-100 text-xs">
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><Zap size={14}/> Código</span><span className="font-bold text-gray-900">{detailDrawerItem.codigo}</span></div>
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><Activity size={14}/> Status</span><div>{renderStatusBadge(detailDrawerItem.status)}</div></div>
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><Layers size={14}/> Modelo</span><span className="font-bold text-gray-900">{getName(mockModelosNobreak, detailDrawerItem.modelo_nobreak_id)}</span></div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Especificações Elétricas</h3>
                                    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 divide-y divide-gray-100 text-xs">
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><Gauge size={14}/> Voltagem</span><span className="font-bold text-gray-900">{getName(mockVoltagens, detailDrawerItem.voltagem_id)}</span></div>
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><Plug size={14}/> Qtd. Tomadas</span><span className="font-bold text-gray-900">{getName(mockQtdTomadas, detailDrawerItem.qtd_tomadas_id)}</span></div>
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><Plug size={14}/> Tipo Tomada</span><span className="font-bold text-gray-900">{getName(mockTiposTomada, detailDrawerItem.tipo_tomada_id)}</span></div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Manutenção & Vínculos</h3>
                                    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 divide-y divide-gray-100 text-xs">
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><Battery size={14}/> Troca Bateria</span><span className="font-bold text-gray-900">{detailDrawerItem.data_troca_bateria || "Não informada"}</span></div>
                                        <div className="flex py-2.5 px-4"><span className="w-40 font-semibold text-gray-500 flex items-center gap-2"><Cpu size={14}/> Máquinas Vinculadas</span>
                                            <span className="font-bold text-purple-700">
                                                {maquinas.filter(m => m.nobreak_id === detailDrawerItem.id).map(m => m.nome).join(", ") || "Nenhuma máquina vinculada"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => { handleOpenEdit(detailDrawerItem); }}
                                className="flex-1 rounded-xl bg-[#eba882] py-2.5 text-xs font-bold text-gray-900 hover:bg-[#e4976c]"
                            >
                                Editar {activeTab === "maquinas" ? "Máquina" : "Nobreak"}
                            </button>
                            <button
                                onClick={() => setDetailDrawerItem(null)}
                                className="rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-200"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. MODAL DE FORMULÁRIO (CRIAR / EDITAR) */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={
                    selectedItem
                        ? `Editar ${activeTab === "maquinas" ? "Máquina" : "Nobreak"}`
                        : `Nova ${activeTab === "maquinas" ? "Máquina" : "Nobreak"}`
                }
                maxWidth={activeTab === "maquinas" ? "max-w-3xl" : "max-w-xl"}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    {activeTab === "maquinas" ? (
                        /* FORMULARIO MAQUINA */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Nome da Máquina</label>
                                <input
                                    type="text"
                                    value={formMaquina.nome}
                                    onChange={(e) => setFormMaquina({ ...formMaquina, nome: e.target.value })}
                                    placeholder="Ex: PC-TI-01"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Service Tag (S_TAG)</label>
                                <input
                                    type="text"
                                    value={formMaquina.s_tag}
                                    onChange={(e) => setFormMaquina({ ...formMaquina, s_tag: e.target.value })}
                                    placeholder="Ex: STAG-9981A"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Status</label>
                                <select
                                    value={formMaquina.status}
                                    onChange={(e) => setFormMaquina({ ...formMaquina, status: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none bg-white focus:border-gray-400"
                                >
                                    <option value="em_uso">Em Uso</option>
                                    <option value="sobrando">Sobrando</option>
                                    <option value="sucata">Sucata</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Internet (Ramal)</label>
                                <select
                                    value={formMaquina.internet ? "true" : "false"}
                                    onChange={(e) => setFormMaquina({ ...formMaquina, internet: e.target.value === "true" })}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none bg-white focus:border-gray-400"
                                >
                                    <option value="true">Sim (Puxado do Ramal)</option>
                                    <option value="false">Não</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Colaborador Responsável</label>
                                <select
                                    value={formMaquina.colaborador_id}
                                    onChange={(e) => setFormMaquina({ ...formMaquina, colaborador_id: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none bg-white focus:border-gray-400"
                                >
                                    {mockColaboradores.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Processador</label>
                                <select
                                    value={formMaquina.processador_id}
                                    onChange={(e) => setFormMaquina({ ...formMaquina, processador_id: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none bg-white focus:border-gray-400"
                                >
                                    {mockProcessadores.map((p) => (
                                        <option key={p.id} value={p.id}>{p.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Memória RAM Total</label>
                                <input
                                    type="text"
                                    value={formMaquina.memoria_ram_total}
                                    onChange={(e) => setFormMaquina({ ...formMaquina, memoria_ram_total: e.target.value })}
                                    placeholder="Ex: 16 GB"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Slots Totais</label>
                                    <input
                                        type="number"
                                        value={formMaquina.slots_ram_total}
                                        onChange={(e) => setFormMaquina({ ...formMaquina, slots_ram_total: e.target.value })}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Slots Ocupados</label>
                                    <input
                                        type="number"
                                        value={formMaquina.slots_ram_usados}
                                        onChange={(e) => setFormMaquina({ ...formMaquina, slots_ram_usados: e.target.value })}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Armazenamento</label>
                                <select
                                    value={formMaquina.armazenamento_id}
                                    onChange={(e) => setFormMaquina({ ...formMaquina, armazenamento_id: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none bg-white focus:border-gray-400"
                                >
                                    {mockArmazenamentos.map((a) => (
                                        <option key={a.id} value={a.id}>{a.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Nobreak Vinculado</label>
                                <select
                                    value={formMaquina.nobreak_id}
                                    onChange={(e) => setFormMaquina({ ...formMaquina, nobreak_id: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none bg-white focus:border-gray-400"
                                >
                                    <option value="">Nenhum / Não possui</option>
                                    {nobreaks.map((nb) => (
                                        <option key={nb.id} value={nb.id}>{nb.codigo}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Monitor Principal</label>
                                <select
                                    value={formMaquina.monitor_id}
                                    onChange={(e) => setFormMaquina({ ...formMaquina, monitor_id: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none bg-white focus:border-gray-400"
                                >
                                    {mockMonitores.map((mon) => (
                                        <option key={mon.id} value={mon.id}>{mon.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Monitor Secundário</label>
                                <select
                                    value={formMaquina.monitor_secundario_id}
                                    onChange={(e) => setFormMaquina({ ...formMaquina, monitor_secundario_id: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none bg-white focus:border-gray-400"
                                >
                                    <option value="">Nenhum / Não possui</option>
                                    {mockMonitores.map((mon) => (
                                        <option key={mon.id} value={mon.id}>{mon.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Teclado</label>
                                <select
                                    value={formMaquina.teclado_id}
                                    onChange={(e) => setFormMaquina({ ...formMaquina, teclado_id: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none bg-white focus:border-gray-400"
                                >
                                    {mockTeclados.map((tec) => (
                                        <option key={tec.id} value={tec.id}>{tec.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Mouse</label>
                                <select
                                    value={formMaquina.mouse_id}
                                    onChange={(e) => setFormMaquina({ ...formMaquina, mouse_id: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none bg-white focus:border-gray-400"
                                >
                                    {mockMouses.map((m) => (
                                        <option key={m.id} value={m.id}>{m.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        /* FORMULARIO NOBREAK */
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Código do Nobreak</label>
                                <input
                                    type="text"
                                    value={formNobreak.codigo}
                                    onChange={(e) => setFormNobreak({ ...formNobreak, codigo: e.target.value })}
                                    placeholder="Ex: NB-001"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Status</label>
                                <select
                                    value={formNobreak.status}
                                    onChange={(e) => setFormNobreak({ ...formNobreak, status: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none bg-white focus:border-gray-400"
                                >
                                    <option value="em_uso">Em Uso</option>
                                    <option value="para_arrumar">Para Arrumar</option>
                                    <option value="sobrando">Sobrando</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Modelo Nobreak</label>
                                <select
                                    value={formNobreak.modelo_nobreak_id}
                                    onChange={(e) => setFormNobreak({ ...formNobreak, modelo_nobreak_id: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none bg-white focus:border-gray-400"
                                >
                                    {mockModelosNobreak.map((m) => (
                                        <option key={m.id} value={m.id}>{m.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Voltagem</label>
                                    <select
                                        value={formNobreak.voltagem_id}
                                        onChange={(e) => setFormNobreak({ ...formNobreak, voltagem_id: e.target.value })}
                                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none bg-white focus:border-gray-400"
                                    >
                                        {mockVoltagens.map((v) => (
                                            <option key={v.id} value={v.id}>{v.valor}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Qtd Tomadas</label>
                                    <select
                                        value={formNobreak.qtd_tomadas_id}
                                        onChange={(e) => setFormNobreak({ ...formNobreak, qtd_tomadas_id: e.target.value })}
                                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none bg-white focus:border-gray-400"
                                    >
                                        {mockQtdTomadas.map((q) => (
                                            <option key={q.id} value={q.id}>{q.valor}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Tipo Tomada</label>
                                    <select
                                        value={formNobreak.tipo_tomada_id}
                                        onChange={(e) => setFormNobreak({ ...formNobreak, tipo_tomada_id: e.target.value })}
                                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none bg-white focus:border-gray-400"
                                    >
                                        {mockTiposTomada.map((t) => (
                                            <option key={t.id} value={t.id}>{t.valor}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Data da Última Troca de Bateria</label>
                                <input
                                    type="date"
                                    value={formNobreak.data_troca_bateria}
                                    onChange={(e) => setFormNobreak({ ...formNobreak, data_troca_bateria: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Foto do Nobreak</label>
                                {formNobreak.foto ? (
                                    <div className="relative flex items-center gap-4 rounded-xl border border-gray-200 p-2 bg-gray-50">
                                        <img src={formNobreak.foto} alt="Preview" className="h-16 w-16 rounded-lg object-cover border border-gray-200" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-gray-800">Foto carregada</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormNobreak({ ...formNobreak, foto: "" })}
                                            className="rounded-lg p-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-3 text-center hover:bg-gray-50">
                                            <ImageIcon className="text-gray-400" size={20} />
                                            <span className="text-xs font-semibold text-gray-700">Selecionar do computador</span>
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        </label>
                                        <input
                                            type="text"
                                            value={formNobreak.foto}
                                            onChange={(e) => setFormNobreak({ ...formNobreak, foto: e.target.value })}
                                            placeholder="Ou cole a URL da imagem aqui"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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

            {/* 5. MODAL DE EXCLUSÃO */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                message={`Tem certeza que deseja excluir "${selectedItem?.nome || selectedItem?.codigo}"?`}
            />
        </div>
    );
}