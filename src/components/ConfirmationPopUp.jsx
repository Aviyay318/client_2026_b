import "./ConfirmationPopUp.css";

function ConfirmationPopUp({
    isOpen,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    loading = false,
    danger = true,
    onConfirm,
    onCancel,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="confirmation-backdrop" onClick={onCancel}>
            <section className="confirmation-modal" onClick={(event) => event.stopPropagation()}>
                <div>
                    <p className="confirmation-eyebrow">Confirmation required</p>
                    <h2>{title}</h2>
                    <p className="confirmation-message">{message}</p>
                </div>

                <div className="confirmation-actions">
                    <button
                        className="confirmation-cancel-btn"
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className={danger ? "confirmation-confirm-btn danger" : "confirmation-confirm-btn"}
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Working..." : confirmLabel}
                    </button>
                </div>
            </section>
        </div>
    );
}

export default ConfirmationPopUp;
