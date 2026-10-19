import { useState } from "react";
import { Plus, Pencil, Trash2, Cpu, Zap, Plug, Gauge, ImageIcon, Layers, Link as LinkIcon } from "lucide-react";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";

// --- MOCK DE MARCAS (Vindas de Catálogos) ---
const mockMarcas = [
    { id: 1, nome: "Dell" },
    { id: 2, nome: "HP" },
    { id: 3, nome: "Lenovo" },
    { id: 4, nome: "SMS" },
    { id: 5, nome: "Intelbras" },
    { id: 6, nome: "APC" }
];

// --- MOCK DE MÁQUINAS E NOBREAKS DO SISTEMA (Para calcular o uso em tempo real) ---
const mockMaquinasNoSistema = [
    { id: 1, nome: "PC-TI-01", modelo_id: 1 },
    { id: 2, nome: "PC-DES-02", modelo_id: 1 },
    { id: 3, nome: "PC-FIN-03", modelo_id: 2 }
];

const mockNobreaksNoSistema = [
    { id: 1, codigo: "NB-001", modelo_nobreak_id: 1, voltagem_id: 3, qtd_tomadas_id: 2, tipo_tomada_id: 1 },
    { id: 2, codigo: "NB-002", modelo_nobreak_id: 2, voltagem_id: 1, qtd_tomadas_id: 1, tipo_tomada_id: 1 }
];

// --- DADOS INICIAIS DA PÁGINA ---
const initialModelosMaquina = [
    { id: 1, nome: "OptiPlex 3080", marca_id: 1 },
    { id: 2, nome: "ProDesk 400 G6", marca_id: 2 },
    { id: 3, nome: "ThinkCentre M70q", marca_id: 3 }
];

const initialModelosNobreak = [
    { id: 1, nome: "Lite Black 1200VA", marca_id: 4 },
    { id: 2, nome: "Attiv 600VA", marca_id: 5 },
    { id: 3, nome: "Back-UPS 700VA", marca_id: 6 }
];

const initialQtdTomadas = [
    { id: 1, quantidade: "4 tomadas" },
    { id: 2, quantidade: "6 tomadas" },
    { id: 3, quantidade: "8 tomadas" }
];

const initialTiposTomada = [
    { id: 1, nome: "NBR 14136 (10A)", foto: "" },
    { id: 2, nome: "NBR 14136 (20A)", foto: "" },
    { id: 3, nome: "NEMA 5-15P", foto: "" }
];

const initialVoltagens = [
    { id: 1, quantidade: "110V" },
    { id: 2, quantidade: "220V" },
    { id: 3, quantidade: "Bivolt (110V / 220V)" }
];

export default function Especificacoes() {
    // Abas: 'modelo_maquina', 'modelo_nobreak', 'qtd_tomadas', 'tipo_tomada', 'voltagem'
    const [activeTab, setActiveTab] = useState("modelo_maquina");

    // Estados dos Dados
    const [modelosMaquina, setModelosMaquina] = useState(initialModelosMaquina);
    const [modelosNobreak, setModelosNobreak] = useState(initialModelosNobreak);
    const [qtdTomadas, setQtdTomadas] = useState(initialQtdTomadas);
    const [tiposTomada, setTiposTomada] = useState(initialTiposTomada);
    const [voltagens, setVoltagens] = useState(initialVoltagens);

    // Modais e Seleções
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Campos do Formulário
    const [nome, setNome] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [marcaId, setMarcaId] = useState(mockMarcas[0].id);
    const [foto, setFoto] = useState("");

    // Helper para mapear os equipamentos usando cada especificação em tempo real
    const getUsoEspecificacao = (specId, type) => {
        if (type === "modelo_maquina") {
            const maquinasUsando = mockMaquinasNoSistema.filter(m => m.modelo_id === specId);
            if (maquinasUsando.length === 0) {
                return <span className="text-xs text-gray-400 italic">Nenhuma máquina cadastrada</span>;
            }
            return (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 border border-green-200">
                    <LinkIcon size={12} />
                    {maquinasUsando.length} {maquinasUsando.length === 1 ? "máquina" : "máquinas"} ({maquinasUsando.map(m => m.nome).join(", ")})
                </span>
            );
        }

        let key = "";
        if (type === "modelo_nobreak") key = "modelo_nobreak_id";
        if (type === "qtd_tomadas") key = "qtd_tomadas_id";
        if (type === "tipo_tomada") key = "tipo_tomada_id";
        if (type === "voltagem") key = "voltagem_id";

        const nobreaksUsando = mockNobreaksNoSistema.filter(n => n[key] === specId);
        if (nobreaksUsando.length === 0) {
            return <span className="text-xs text-gray-400 italic">Nenhum nobreak cadastrado</span>;
        }

        return (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                <LinkIcon size={12} />
                {nobreaksUsando.length} {nobreaksUsando.length === 1 ? "nobreak" : "nobreaks"} ({nobreaksUsando.map(n => n.codigo).join(", ")})
            </span>
        );
    };

    // Upload de Imagem do Computador (Tipo de Tomada)
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Por favor, selecione um arquivo de imagem válido.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => setFoto(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Abrir Modal de Cadastro
    const handleOpenCreate = () => {
        setSelectedItem(null);
        setNome("");
        setQuantidade("");
        setFoto("");
        setMarcaId(mockMarcas[0].id);
        setIsFormOpen(true);
    };

    // Abrir Modal de Edição
    const handleOpenEdit = (item) => {
        setSelectedItem(item);
        if (activeTab === "modelo_maquina" || activeTab === "modelo_nobreak") {
            setNome(item.nome);
            setMarcaId(item.marca_id);
        } else if (activeTab === "qtd_tomadas" || activeTab === "voltagem") {
            setQuantidade(item.quantidade);
        } else if (activeTab === "tipo_tomada") {
            setNome(item.nome);
            setFoto(item.foto || "");
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

        if (activeTab === "modelo_maquina") {
            if (!nome.trim()) return;
            const payload = { nome, marca_id: Number(marcaId) };
            if (selectedItem) {
                setModelosMaquina(prev => prev.map(m => m.id === selectedItem.id ? { ...payload, id: m.id } : m));
            } else {
                setModelosMaquina(prev => [...prev, { ...payload, id: Date.now() }]);
            }
        } else if (activeTab === "modelo_nobreak") {
            if (!nome.trim()) return;
            const payload = { nome, marca_id: Number(marcaId) };
            if (selectedItem) {
                setModelosNobreak(prev => prev.map(m => m.id === selectedItem.id ? { ...payload, id: m.id } : m));
            } else {
                setModelosNobreak(prev => [...prev, { ...payload, id: Date.now() }]);
            }
        } else if (activeTab === "qtd_tomadas") {
            if (!quantidade.trim()) return;
            const payload = { quantidade };
            if (selectedItem) {
                setQtdTomadas(prev => prev.map(q => q.id === selectedItem.id ? { ...payload, id: q.id } : q));
            } else {
                setQtdTomadas(prev => [...prev, { ...payload, id: Date.now() }]);
            }
        } else if (activeTab === "tipo_tomada") {
            if (!nome.trim()) return;
            const payload = { nome, foto };
            if (selectedItem) {
                setTiposTomada(prev => prev.map(t => t.id === selectedItem.id ? { ...payload, id: t.id } : t));
            } else {
                setTiposTomada(prev => [...prev, { ...payload, id: Date.now() }]);
            }
        } else if (activeTab === "voltagem") {
            if (!quantidade.trim()) return;
            const payload = { quantidade };
            if (selectedItem) {
                setVoltagens(prev => prev.map(v => v.id === selectedItem.id ? { ...payload, id: v.id } : v));
            } else {
                setVoltagens(prev => [...prev, { ...payload, id: Date.now() }]);
            }
        }

        setIsFormOpen(false);
    };

    // Confirmar Exclusão
    const handleDeleteConfirm = () => {
        if (!selectedItem) return;

        if (activeTab === "modelo_maquina") {
            setModelosMaquina(prev => prev.filter(m => m.id !== selectedItem.id));
        } else if (activeTab === "modelo_nobreak") {
            setModelosNobreak(prev => prev.filter(m => m.id !== selectedItem.id));
        } else if (activeTab === "qtd_tomadas") {
            setQtdTomadas(prev => prev.filter(q => q.id !== selectedItem.id));
        } else if (activeTab === "tipo_tomada") {
            setTiposTomada(prev => prev.filter(t => t.id !== selectedItem.id));
        } else if (activeTab === "voltagem") {
            setVoltagens(prev => prev.filter(v => v.id !== selectedItem.id));
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
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Especificações</h1>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#eba882] px-5 py-2.5 font-bold text-gray-900 transition-all hover:bg-[#e4976c] active:scale-95 shadow-sm"
                >
                    <Plus size={20} />
                    <span>Novo Registro</span>
                </button>
            </div>

            {/* Abas de Navegação */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveTab("modelo_maquina")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                        activeTab === "modelo_maquina"
                            ? "bg-[#9bb3a8] text-gray-900 shadow-sm"
                            : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <Cpu size={16} />
                    Modelo Máquina
                </button>

                <button
                    onClick={() => setActiveTab("modelo_nobreak")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                        activeTab === "modelo_nobreak"
                            ? "bg-[#9bb3a8] text-gray-900 shadow-sm"
                            : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <Zap size={16} />
                    Modelo Nobreak
                </button>

                <button
                    onClick={() => setActiveTab("qtd_tomadas")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                        activeTab === "qtd_tomadas"
                            ? "bg-[#9bb3a8] text-gray-900 shadow-sm"
                            : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <Layers size={16} />
                    Qtd. Tomadas
                </button>

                <button
                    onClick={() => setActiveTab("tipo_tomada")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                        activeTab === "tipo_tomada"
                            ? "bg-[#9bb3a8] text-gray-900 shadow-sm"
                            : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <Plug size={16} />
                    Tipo Tomada
                </button>

                <button
                    onClick={() => setActiveTab("voltagem")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                        activeTab === "voltagem"
                            ? "bg-[#9bb3a8] text-gray-900 shadow-sm"
                            : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <Gauge size={16} />
                    Voltagem
                </button>
            </div>

            {/* Tabela de Dados */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-[#fdebe1] text-xs font-bold uppercase text-gray-800">
                            <tr>
                                <th className="px-6 py-4 w-24">ID</th>
                                {activeTab === "modelo_maquina" && (
                                    <>
                                        <th className="px-6 py-4">Nome do Modelo</th>
                                        <th className="px-6 py-4">Marca</th>
                                    </>
                                )}
                                {activeTab === "modelo_nobreak" && (
                                    <>
                                        <th className="px-6 py-4">Nome do Modelo</th>
                                        <th className="px-6 py-4">Marca</th>
                                    </>
                                )}
                                {activeTab === "qtd_tomadas" && <th className="px-6 py-4">Quantidade de Tomadas</th>}
                                {activeTab === "tipo_tomada" && (
                                    <>
                                        <th className="px-6 py-4">Tipo / Padrão</th>
                                        <th className="px-6 py-4">Foto / Ilustração</th>
                                    </>
                                )}
                                {activeTab === "voltagem" && <th className="px-6 py-4">Voltagem / Tensão</th>}
                                <th className="px-6 py-4">Uso no Sistema (Equipamentos Vinculados)</th>
                                <th className="px-6 py-4 text-center w-32">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* 1. Modelo Máquina */}
                            {activeTab === "modelo_maquina" &&
                                modelosMaquina.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-gray-50/80">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{item.nome}</td>
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            {getMarcaNome(item.marca_id)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getUsoEspecificacao(item.id, "modelo_maquina")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleOpenEdit(item)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
                                                    <Pencil size={18} />
                                                </button>
                                                <button onClick={() => handleOpenDelete(item)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            {/* 2. Modelo Nobreak */}
                            {activeTab === "modelo_nobreak" &&
                                modelosNobreak.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-gray-50/80">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{item.nome}</td>
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            {getMarcaNome(item.marca_id)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getUsoEspecificacao(item.id, "modelo_nobreak")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleOpenEdit(item)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
                                                    <Pencil size={18} />
                                                </button>
                                                <button onClick={() => handleOpenDelete(item)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            {/* 3. Qtd Tomadas */}
                            {activeTab === "qtd_tomadas" &&
                                qtdTomadas.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-gray-50/80">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{item.quantidade}</td>
                                        <td className="px-6 py-4">
                                            {getUsoEspecificacao(item.id, "qtd_tomadas")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleOpenEdit(item)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
                                                    <Pencil size={18} />
                                                </button>
                                                <button onClick={() => handleOpenDelete(item)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            {/* 4. Tipo Tomada */}
                            {activeTab === "tipo_tomada" &&
                                tiposTomada.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-gray-50/80">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{item.nome}</td>
                                        <td className="px-6 py-4">
                                            {item.foto ? (
                                                <img
                                                    src={item.foto}
                                                    alt={item.nome}
                                                    className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Sem foto</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getUsoEspecificacao(item.id, "tipo_tomada")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleOpenEdit(item)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
                                                    <Pencil size={18} />
                                                </button>
                                                <button onClick={() => handleOpenDelete(item)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            {/* 5. Voltagem */}
                            {activeTab === "voltagem" &&
                                voltagens.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-gray-50/80">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{item.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{item.quantidade}</td>
                                        <td className="px-6 py-4">
                                            {getUsoEspecificacao(item.id, "voltagem")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleOpenEdit(item)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
                                                    <Pencil size={18} />
                                                </button>
                                                <button onClick={() => handleOpenDelete(item)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
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
                              activeTab === "modelo_maquina"
                                  ? "Modelo de Máquina"
                                  : activeTab === "modelo_nobreak"
                                  ? "Modelo de Nobreak"
                                  : activeTab === "qtd_tomadas"
                                  ? "Qtd. de Tomadas"
                                  : activeTab === "tipo_tomada"
                                  ? "Tipo de Tomada"
                                  : "Voltagem"
                          }`
                        : `Novo Registro`
                }
            >
                <form onSubmit={handleSave} className="space-y-4">
                    {/* Campo Nome (para modelo_maquina, modelo_nobreak e tipo_tomada) */}
                    {(activeTab === "modelo_maquina" || activeTab === "modelo_nobreak" || activeTab === "tipo_tomada") && (
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                Nome
                            </label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Ex: OptiPlex 3080, NBR 14136..."
                                autoFocus
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                            />
                        </div>
                    )}

                    {/* Campo Marca (para modelo_maquina e modelo_nobreak) */}
                    {(activeTab === "modelo_maquina" || activeTab === "modelo_nobreak") && (
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
                    )}

                    {/* Campo Quantidade (para qtd_tomadas e voltagem) */}
                    {(activeTab === "qtd_tomadas" || activeTab === "voltagem") && (
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                {activeTab === "qtd_tomadas" ? "Quantidade" : "Voltagem / Tensão"}
                            </label>
                            <input
                                type="text"
                                value={quantidade}
                                onChange={(e) => setQuantidade(e.target.value)}
                                placeholder={activeTab === "qtd_tomadas" ? "Ex: 4 tomadas, 8 tomadas..." : "Ex: 110V, 220V, Bivolt..."}
                                autoFocus
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                            />
                        </div>
                    )}

                    {/* Campo Foto / Upload (exclusivo para tipo_tomada) */}
                    {activeTab === "tipo_tomada" && (
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                Foto / Ilustração da Tomada
                            </label>

                            {foto ? (
                                <div className="relative flex items-center gap-4 rounded-xl border border-gray-200 p-2 bg-gray-50">
                                    <img src={foto} alt="Preview" className="h-14 w-14 rounded-lg object-cover border border-gray-200" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-gray-800">Foto carregada</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFoto("")}
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
                                        value={foto}
                                        onChange={(e) => setFoto(e.target.value)}
                                        placeholder="Ou cole a URL da imagem aqui"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400"
                                    />
                                </div>
                            )}
                        </div>
                    )}

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
                message={`Tem certeza que deseja excluir este registro?`}
            />
        </div>
    );
}