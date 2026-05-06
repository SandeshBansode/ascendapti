export function enterFullscreen() {
  const el = document.documentElement as any;
  const req =
    el.requestFullscreen ||
    el.webkitRequestFullscreen ||
    el.msRequestFullscreen;
  if (req) return req.call(el).catch(() => {});
}

export function isFullscreen() {
  return Boolean(
    document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
  );
}

export function blockShortcuts(e: KeyboardEvent) {
  const k = e.key;
  if (k === "F12") {
    e.preventDefault();
    return true;
  }
  if (e.ctrlKey && e.shiftKey && (k === "I" || k === "i" || k === "J" || k === "j" || k === "C" || k === "c")) {
    e.preventDefault();
    return true;
  }
  if (e.ctrlKey && ["u", "U", "c", "C", "v", "V", "t", "T", "w", "W", "s", "S", "p", "P", "a", "A"].includes(k)) {
    e.preventDefault();
    return true;
  }
  return false;
}