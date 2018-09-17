/**
 * @fileOverview Handle modal based on SweetAlert2.
 */
import Swal, { SweetAlertOptions } from "sweetalert2";
const tippy = require("tippy.js");

interface Action {
  text: string;
  tooltipText?: string;
  type?: "confirm" | "cancel";
  autoClose?: boolean;
  onClick?: () => void;
}

interface ModalProps {
  actions: Action[];
}

/**
 * Base element of modal action.
 */
const baseAction = document.createElement("button");
baseAction.classList.add("swal2-styled");
baseAction.style.cssText = "padding: 0.4em;";

/**
 * Open modal
 *
 * @param props
 */
export function openModal(props: ModalProps & SweetAlertOptions): void {
  if (Swal.isVisible()) {
    closeModal();
  }

  const { actions, ...sweetAlertOptions } = props;

  // Show a modal.
  Swal({
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    ...sweetAlertOptions
  });

  // Get action area element of modal.
  const actionsElement = document.querySelectorAll(".swal2-actions")[0];
  actionsElement.setAttribute("style", "display: flex;");

  actions.forEach(
    (
      {
        text,
        tooltipText,
        type = "confirm",
        autoClose = true,
        onClick
      }: Action,
      index: number
    ) => {
      const id = `sweetalert-action-${index}`;

      const button = <HTMLButtonElement>baseAction.cloneNode();
      button.id = id;
      button.textContent = text;
      button.classList.add(`swal2-${type}`);

      actionsElement.appendChild(button);

      // Setup tooltip if needed.
      if (tooltipText) {
        button.setAttribute("title", tooltipText);
        tippy(`#${id}`, {
          trigger: "click",
          arrow: true,
          onShow(instance: any) {
            setTimeout(() => instance.hide(), 1500);
          }
        });
      }

      // Setup click event.
      button.addEventListener("click", () => {
        if (autoClose) {
          closeModal();
        }

        if (onClick) {
          onClick();
        }
      });
    }
  );
}

/**
 * Close modal
 */
export function closeModal(): void {
  Swal.close();
}
