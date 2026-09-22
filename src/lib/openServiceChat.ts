/** Shared entry points for the fixed @ Service customer-service room. */

export const SERVICE_FRIEND_ID = "service";

export const OPEN_SERVICE_CHAT_EVENT = "wu88:open-service-chat";

/** Switch the TalkingBar to private channel and open the Service thread. */
export function openServiceChat() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_SERVICE_CHAT_EVENT));
}
