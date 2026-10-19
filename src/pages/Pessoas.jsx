import { useState } from "react";
import { Plus, Pencil, Trash2, ShieldCheck, User } from "lucide-react";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";

// Opções de Roles/Funções para a Equipe de TI
const ROLE_OPTIONS = ["Admin Geral", "Suporte TI", "Analista de Sistemas"];

// Dados de Exemplo
const initialColaboradores = [
    { id: 1, nome: "Carlos Eduardo", cargo: "Desenvolvedor Frontend" },
    { id: 2, nome: "Ana Paula", cargo: "Gerente de Projetos" },
    { id: 3, nome: "Mariana Costa", cargo: "Designer UX/UI" }
];

const initialEquipeTI = [
    { id: 1, email: "admin@cervix.com.br", role: "Admin Geral", ativo: true },
    { id: 2, email: "suporte@cervix.com.br", role: "Suporte TI", ativo: true },
    { id: 3, email: "dev.ti@cervix.com.br", role: "Analista de Sistemas", ativo: false }
];

export default function Pessoas() {
    const [activeTab, setActiveTab] = useState("colaboradores"); // 'colaboradores' ou 'equipe_ti'
    const [colaboradores, setColaboradores] = useState(initialColaboradores);
    const [equipeTI, setEquipeTI] = useState(initialEquipeTI);

    // Modais e Seleções
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Campos do Formulário - Colaborador
    const [nomeColaborador, setNomeColaborador] = useState("");
    const [cargoColaborador, setCargoColaborador] = useState("");

    // Campos do Formulário - Equipe TI
    const [emailTI, setEmailTI] = useState("");
    const [roleTI, setRoleTI] = useState(ROLE_OPTIONS[0]);
    const [ativoTI, setAtivoTI] = useState(true);
    const [senhaTI, setSenhaTI] = useState("");

    // Abrir Modal de Cadastro
    const handleOpenCreate = () => {
        setSelectedItem(null);
        if (activeTab === "colaboradores") {
            setNomeColaborador("");
            setCargoColaborador("");
        } else {
            setEmailTI("");
            setRoleTI(ROLE_OPTIONS[0]);
            setAtivoTI(true);
            setSenhaTI("");
        }
        setIsFormOpen(true);
    };

    // Abrir Modal de Edição
    const handleOpenEdit = (item) => {
        setSelectedItem(item);
        if (activeTab === "colaboradores") {
            setNomeColaborador(item.nome);
            setCargoColaborador(item.cargo);
        } else {
            setEmailTI(item.email);
            setRoleTI(item.role);
            setAtivoTI(item.ativo);
            setSenhaTI(""); // Deixa a senha em branco por segurança
        }
        setIsFormOpen(true);
    };

    // Abrir Modal de Exclusão
    const handleOpenDelete = (item) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    // Salvar (Colaborador ou Equipe TI)
    const handleSave = (e) => {
        e.preventDefault();

        if (activeTab === "colaboradores") {
            if (!nomeColaborador.trim() || !cargoColaborador.trim()) return;

            if (selectedItem) {
                setColaboradores(prev => prev.map(c =>
                    c.id === selectedItem.id
                        ? { ...c, nome: nomeColaborador, cargo: cargoColaborador }
                        : c
                ));
            } else {
                setColaboradores(prev => [
                    ...prev,
                    { id: Date.now(), nome: nomeColaborador, cargo: cargoColaborador }
                ]);
            }
        } else {
            if (!emailTI.trim()) return;

            if (selectedItem) {
                setEquipeTI(prev => prev.map(ti =>
                    ti.id === selectedItem.id
                        ? { ...ti, email: emailTI, role: roleTI, ativo: ativoTI }
                        : ti
                ));
            } else {
                setEquipeTI(prev => [
                    ...prev,
                    { id: Date.now(), email: emailTI, role: roleTI, ativo: ativoTI }
                ]);
            }
        }

        setIsFormOpen(false);
    };

    // Confirmar Exclusão
    const handleDeleteConfirm = () => {
        if (!selectedItem) return;

        if (activeTab === "colaboradores") {
            setColaboradores(prev => prev.filter(c => c.id !== selectedItem.id));
        } else {
            setEquipeTI(prev => prev.filter(ti => ti.id !== selectedItem.id));
        }
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
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Pessoas</h1>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#eba882] px-5 py-2.5 font-bold text-gray-900 transition-all hover:bg-[#e4976c] active:scale-95 shadow-sm"
                >
                    <Plus size={20} />
                    <span>Novo {activeTab === "colaboradores" ? "Colaborador" : "Membro TI"}</span>
                </button>
            </div>

            {/* Abas de Navegação */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab("colaboradores")}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                        activeTab === "colaboradores"
                            ? "bg-[#9bb3a8] text-gray-900 shadow-sm"
                            : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <User size={16} />
                    Colaboradores
                </button>
                <button
                    onClick={() => setActiveTab("equipe_ti")}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                        activeTab === "equipe_ti"
                            ? "bg-[#9bb3a8] text-gray-900 shadow-sm"
                            : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <ShieldCheck size={16} />
                    Equipe TI (Admins)
                </button>
            </div>

            {/* Tabela */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-[#fdebe1] text-xs font-bold uppercase text-gray-800">
                            <tr>
                                <th className="px-6 py-4 w-24">ID</th>
                                {activeTab === "colaboradores" ? (
                                    <>
                                        <th className="px-6 py-4">Nome</th>
                                        <th className="px-6 py-4">Cargo</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-6 py-4">E-mail</th>
                                        <th className="px-6 py-4">Role / Permissão</th>
                                        <th className="px-6 py-4">Status</th>
                                    </>
                                )}
                                <th className="px-6 py-4 text-center w-32">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {activeTab === "colaboradores" ? (
                                colaboradores.map((colab) => (
                                    <tr key={colab.id} className="transition-colors hover:bg-gray-50/80">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{colab.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{colab.nome}</td>
                                        <td className="px-6 py-4 text-gray-600">{colab.cargo}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(colab)}
                                                    className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                                                    title="Editar"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDelete(colab)}
                                                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                equipeTI.map((ti) => (
                                    <tr key={ti.id} className="transition-colors hover:bg-gray-50/80">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{ti.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{ti.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 border border-gray-200">
                                                {ti.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                                                    ti.ativo
                                                        ? "bg-green-100 text-green-700 border-green-200"
                                                        : "bg-red-100 text-red-700 border-red-200"
                                                }`}
                                            >
                                                {ti.ativo ? "Ativo" : "Inativo"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(ti)}
                                                    className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                                                    title="Editar"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDelete(ti)}
                                                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
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
                        ? `Editar ${activeTab === "colaboradores" ? "Colaborador" : "Membro TI"}`
                        : `Novo ${activeTab === "colaboradores" ? "Colaborador" : "Membro TI"}`
                }
            >
                <form onSubmit={handleSave} className="space-y-4">
                    {activeTab === "colaboradores" ? (
                        <>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    value={nomeColaborador}
                                    onChange={(e) => setNomeColaborador(e.target.value)}
                                    placeholder="Ex: Carlos Eduardo"
                                    autoFocus
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    Cargo
                                </label>
                                <input
                                    type="text"
                                    value={cargoColaborador}
                                    onChange={(e) => setCargoColaborador(e.target.value)}
                                    placeholder="Ex: Gerente, Desenvolvedor..."
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    E-mail de Acesso
                                </label>
                                <input
                                    type="email"
                                    value={emailTI}
                                    onChange={(e) => setEmailTI(e.target.value)}
                                    placeholder="exemplo@cervix.com.br"
                                    autoFocus
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    Permissão (Role)
                                </label>
                                <select
                                    value={roleTI}
                                    onChange={(e) => setRoleTI(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                >
                                    {ROLE_OPTIONS.map((r) => (
                                        <option key={r} value={r}>
                                            {r}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    Status da Conta
                                </label>
                                <select
                                    value={ativoTI ? "true" : "false"}
                                    onChange={(e) => setAtivoTI(e.target.value === "true")}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                >
                                    <option value="true">Ativo</option>
                                    <option value="false">Inativo</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                                    {selectedItem ? "Nova Senha (Opcional)" : "Senha de Acesso"}
                                </label>
                                <input
                                    type="password"
                                    value={senhaTI}
                                    onChange={(e) => setSenhaTI(e.target.value)}
                                    placeholder={selectedItem ? "Deixe em branco para não alterar" : "••••••••"}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                />
                            </div>
                        </>
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
                message={`Tem certeza que deseja excluir "${
                    activeTab === "colaboradores" ? selectedItem?.nome : selectedItem?.email
                }"?`}
            />
        </div>
    );
}