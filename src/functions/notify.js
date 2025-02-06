import { Notify } from "quasar";

export function onSuccess(message, time) {
  showNotification({
    progress: true,
    color: "positive",
    position: "top",
    message: message,
    icon: "check_circle",
    time,
  });
}
export function onError(message) {
  showNotification({
    progress: true,
    color: "negative",
    position: "top",
    message: message,
    icon: "error",
  });
}
export function showNotification(notify) {
  const { color, textColor, icon, message, avatar, progress, position, time } =
    notify;
  Notify.create({
    color,
    progress,
    textColor,
    icon,
    message,
    position,
    avatar,
    actions: null,
    // actions: Math.random() * 100 > 50
    //   ? [ { label: 'Cerrar', handler: () =>
    //   : null,
    timeout: time,
  });
}
