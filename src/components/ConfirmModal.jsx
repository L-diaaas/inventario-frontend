import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title = "Excluir Item", message = "Tem certeza que deseja excluir este item? Esta ação não poderá ser desfeita." }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
            <div className="space-y-4 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 text-red-600">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle size={22} />
                    </div>
                    <p className="text-sm font-medium text-gray-600">{message}</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="rounded-xl bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </Modal>
    );
}