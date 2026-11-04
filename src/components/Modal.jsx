import { XCircleIcon } from "@heroicons/react/24/outline";
import { createPortal } from "react-dom";

function Modal({ title, children, onOpen, open }) {
  if (!open) return null;
  // portal: the navbar's backdrop-filter would otherwise trap position:fixed inside it
  return createPortal(
    <div>
      <div className="backdrop" onClick={() => onOpen(false)}></div>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal__header">
          <h2 className="title">{title}</h2>
          <button className="icon-btn" onClick={() => onOpen(false)} aria-label="Close">
            <XCircleIcon className="icon close" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
