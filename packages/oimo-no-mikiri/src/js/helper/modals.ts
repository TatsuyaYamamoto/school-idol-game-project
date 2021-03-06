import { t, copyTextToClipboard, tweetByWebIntent } from "@sokontokoro/mikan";

import SweetAlert, { SweetAlertResult } from "sweetalert2";
import * as tippy from "tippy.js";

import { Ids as StringIds } from "../resources/string";

export function closeModal(): void {
  SweetAlert.close();
}

export function openCreateRoomModal(gameId: string): Promise<string> {
  const { protocol, host, pathname } = window.location;
  const url = `${protocol}//${host}${pathname}?gameId=${gameId}`;

  SweetAlert({
    title: t(StringIds[StringIds.MODAL_CREATE_ROOM_TITLE]),
    text: t(StringIds[StringIds.MODAL_CREATE_ROOM_TEXT]),
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });

  const baseButton = document.createElement("button");
  baseButton.classList.add("swal2-styled");
  baseButton.style.cssText = "padding: 0.4em;";

  const copyButton = <HTMLButtonElement>baseButton.cloneNode();
  copyButton.textContent = t(
    StringIds[StringIds.MODAL_CREATE_ROOM_BUTTON_COPY]
  );
  copyButton.id = "button-create-room-copy-url";
  copyButton.classList.add("swal2-confirm");
  copyButton.setAttribute(
    "title",
    t(StringIds[StringIds.MODAL_CREATE_ROOM_BUTTON_COPY_SUCCESS])
  );

  const tweetButton = <HTMLButtonElement>baseButton.cloneNode();
  tweetButton.textContent = t(
    StringIds[StringIds.MODAL_CREATE_ROOM_BUTTON_TWEET]
  );
  tweetButton.classList.add("swal2-confirm");

  const cancelButton = <HTMLButtonElement>baseButton.cloneNode();
  cancelButton.textContent = t(StringIds[StringIds.MODAL_CANCEL]);
  cancelButton.classList.add("swal2-cancel");

  const alertActions = document.querySelectorAll(".swal2-actions")[0];
  alertActions.setAttribute("style", "display: flex;");
  alertActions.appendChild(copyButton);
  alertActions.appendChild(tweetButton);
  alertActions.appendChild(cancelButton);

  tippy("#button-create-room-copy-url", {
    trigger: "click",
    arrow: true,
    onShow(instance) {
      setTimeout(() => instance.hide(), 1500);
    },
  });

  return new Promise((resolve) => {
    copyButton.addEventListener("click", () => {
      copyTextToClipboard(url);
    });
    tweetButton.addEventListener("click", () => {
      tweetByWebIntent({
        text: t(StringIds[StringIds.INVITE_MULTI_PLAY_MESSAGE]),
        url,
        hashtags: ["おいものみきり", "そこんところ工房"],
      });
    });
    cancelButton.addEventListener("click", () => {
      resolve("cancel");
    });
  });
}

export function openJoinRoomModal(roomId: string): Promise<SweetAlertResult> {
  return SweetAlert({
    title: t(StringIds[StringIds.MODAL_JOIN_ROOM_TITLE]),
    text: t(StringIds[StringIds.MODAL_JOIN_ROOM_TEXT], { roomId }),
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}

export function openReadyRoomModal(): Promise<SweetAlertResult> {
  return SweetAlert({
    title: t(StringIds[StringIds.MODAL_GAME_READY_TITLE]),
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}

export function openRejectJoinRoomModal(
  type: string
): Promise<SweetAlertResult> {
  let text = t(StringIds[StringIds.MODAL_ERROR_UNEXPECTED]);

  switch (type) {
    case "already_fulfilled":
      text = t(StringIds[StringIds.MODAL_REJECT_JOIN_FULFILLED_TEXT]);
      break;
    case "no_game":
      text = t(StringIds[StringIds.MODAL_REJECT_JOIN_NO_GAME_TEXT]);
      break;
    default:
    // do nothing
  }

  return SweetAlert({
    text,
    showConfirmButton: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}

export function openWaitingRestartModal(): Promise<SweetAlertResult> {
  return SweetAlert({
    text: t(StringIds[StringIds.MODAL_WAIT_RESTART_TEXT]),
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}

export function openRestartConfirmModal(): Promise<SweetAlertResult> {
  return SweetAlert({
    text: t(StringIds[StringIds.MODAL_CONFIRM_RESTART_TEXT]),
    showConfirmButton: true,
    showCancelButton: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}

export function openMemberLeftModal(): Promise<SweetAlertResult> {
  return SweetAlert({
    text: t(StringIds[StringIds.MODAL_MEMBER_LEFT_TEXT]),
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}

export function openConfirmCloseGameModal(): Promise<SweetAlertResult> {
  return SweetAlert({
    title: t(StringIds[StringIds.MODAL_CONFIRM_CLOSE_GAME_TITLE]),
    text: t(StringIds[StringIds.MODAL_CONFIRM_CLOSE_GAME_TEXT]),
    showConfirmButton: true,
    confirmButtonColor: "#3085d6",
    confirmButtonText: t(
      StringIds[StringIds.MODAL_CONFIRM_CLOSE_GAME_BUTTON_CONFIRM]
    ),
    showCancelButton: true,
    cancelButtonColor: "#d33",
    cancelButtonText: t(
      StringIds[StringIds.MODAL_CONFIRM_CLOSE_GAME_BUTTON_CANCEL]
    ),
    reverseButtons: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}
