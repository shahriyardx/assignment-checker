const PANEL_STYLE_ID = "ac-panel-styles"

const css = `
.ac-panel {
  --ac-bg: #ffffff;
  --ac-bg-2: #f7f8fa;
  --ac-bg-3: #edeff3;
  --ac-line: #e3e6eb;
  --ac-line-strong: #d2d7df;
  --ac-text: #1b1f27;
  --ac-dim: #6b7280;
  --ac-accent: #6807ff;
  --ac-accent-soft: rgba(104, 7, 255, 0.07);
  --ac-marks: #92620a;
  --ac-marks-bg: rgba(245, 158, 11, 0.14);
  --ac-mono: ui-monospace, SFMono-Regular, "JetBrains Mono", "Cascadia Code",
    Menlo, Consolas, monospace;

  box-sizing: border-box;
  font-family: var(--ac-mono);
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--ac-text);
  background: var(--ac-bg);
  border: 1px solid var(--ac-line);
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04),
    0 10px 28px -16px rgba(16, 24, 40, 0.22);
  animation: ac-in 140ms cubic-bezier(0.2, 0.7, 0.3, 1);
}

.ac-panel *,
.ac-panel *::before,
.ac-panel *::after {
  box-sizing: border-box;
}

@keyframes ac-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
}

/* ---------- section label ---------- */

.ac-panel .ac-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 10px;
  font-family: var(--ac-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ac-dim);
}

.ac-panel .ac-label::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--ac-line);
}

.ac-panel .ac-count {
  padding: 1px 6px;
  font-size: 10px;
  color: var(--ac-dim);
  background: var(--ac-bg-3);
  border-radius: 999px;
}

/* ---------- loaded json list ---------- */

.ac-panel .ac-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.ac-panel .ac-empty {
  padding: 14px 12px;
  font-size: 11.5px;
  color: var(--ac-dim);
  text-align: center;
  background: var(--ac-bg-2);
  border: 1px dashed var(--ac-line-strong);
  border-radius: 8px;
}

.ac-panel .ac-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px 6px 10px;
  background: var(--ac-bg-2);
  border: 1px solid var(--ac-line);
  border-radius: 8px;
  transition: background 120ms ease, border-color 120ms ease;
}

.ac-panel .ac-row:hover {
  background: var(--ac-bg-3);
}

.ac-panel .ac-row.is-active {
  background: var(--ac-accent-soft);
  border-color: rgba(104, 7, 255, 0.35);
}

.ac-panel .ac-row__name {
  flex: 1;
  overflow: hidden;
  font-size: 12px;
  color: var(--ac-text);
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- buttons ---------- */

.ac-panel .ac-btn {
  flex-shrink: 0;
  padding: 4px 10px;
  font-family: var(--ac-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4b5563;
  cursor: pointer;
  background: var(--ac-bg);
  border: 1px solid var(--ac-line-strong);
  border-radius: 6px;
  transition: color 120ms ease, background 120ms ease, border-color 120ms ease;
}

.ac-panel .ac-btn:hover {
  color: var(--ac-text);
  background: var(--ac-bg-3);
}

.ac-panel .ac-btn:focus-visible {
  outline: 2px solid var(--ac-accent);
  outline-offset: 2px;
}

.ac-panel .ac-btn--on {
  color: #fff;
  background: var(--ac-accent);
  border-color: var(--ac-accent);
}

.ac-panel .ac-btn--on:hover {
  color: #fff;
  background: #5a06dd;
}

.ac-panel .ac-btn--x {
  width: 24px;
  padding: 4px 0;
  font-size: 13px;
  line-height: 1;
  letter-spacing: 0;
}

.ac-panel .ac-btn--x:hover {
  color: #dc2626;
  background: #fee2e2;
  border-color: #fca5a5;
}

/* ---------- file input ---------- */

.ac-panel .ac-file {
  display: block;
  width: 100%;
  padding: 9px;
  font-family: var(--ac-mono);
  font-size: 11px;
  color: var(--ac-dim);
  cursor: pointer;
  background: var(--ac-bg-2);
  border: 1px dashed var(--ac-line-strong);
  border-radius: 8px;
  transition: border-color 120ms ease, color 120ms ease;
}

.ac-panel .ac-file:hover {
  color: var(--ac-text);
  border-color: var(--ac-accent);
}

.ac-panel .ac-file::file-selector-button {
  margin-right: 10px;
  padding: 4px 10px;
  font-family: var(--ac-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  cursor: pointer;
  background: var(--ac-accent);
  border: 0;
  border-radius: 6px;
}

.ac-panel .ac-hint {
  margin: 8px 0 0;
  font-size: 10.5px;
  color: var(--ac-dim);
}

/* ---------- feedback builder ---------- */

.ac-panel--builder {
  margin: 16px 0;
  padding: 16px;
}

.ac-panel .ac-section {
  margin-bottom: 18px;
}

.ac-panel .ac-section:last-of-type {
  margin-bottom: 14px;
}

.ac-panel .ac-reqs {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ac-panel .ac-req {
  border-radius: 8px;
}

.ac-panel .ac-req__line {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: start;
  padding: 5px 8px;
  border-radius: 8px;
  transition: background 120ms ease;
}

.ac-panel .ac-req__line:hover {
  background: var(--ac-bg-2);
}

.ac-panel .ac-req__label {
  margin: 0;
  font-family: var(--ac-mono);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.55;
  color: var(--ac-text);
  cursor: pointer;
}

.ac-panel .ac-num {
  margin-right: 6px;
  color: var(--ac-dim);
}

.ac-panel .ac-marks {
  margin-left: 6px;
  padding: 0 5px;
  font-size: 10.5px;
  color: var(--ac-marks);
  background: var(--ac-marks-bg);
  border-radius: 4px;
}

.ac-panel .ac-check {
  width: 15px;
  height: 15px;
  margin: 4px 0 0;
  accent-color: var(--ac-accent);
  cursor: pointer;
}

.ac-panel .ac-check:focus-visible {
  outline: 2px solid var(--ac-accent);
  outline-offset: 2px;
}

/* sub-requirements get a real guide rail instead of an ascii prefix */
.ac-panel .ac-subs {
  margin: 2px 0 2px 14px;
  padding-left: 14px;
  border-left: 1px solid var(--ac-line);
}

/* ---------- custom feedback row ---------- */

.ac-panel .ac-cf {
  display: none;
  grid-template-columns: 1fr 110px;
  gap: 6px;
  padding: 2px 8px 8px;
}

.ac-panel .ac-input {
  width: 100%;
  padding: 5px 8px;
  font-family: var(--ac-mono);
  font-size: 11.5px;
  color: var(--ac-text);
  background: var(--ac-bg);
  border: 1px solid var(--ac-line-strong);
  border-radius: 6px;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.ac-panel .ac-input::placeholder {
  color: #9aa1ad;
}

.ac-panel .ac-input:focus {
  border-color: var(--ac-accent);
  box-shadow: 0 0 0 3px var(--ac-accent-soft);
  outline: none;
}

/* ---------- insert button ---------- */

.ac-panel .ac-insert {
  display: block;
  width: 100%;
  padding: 9px;
  font-family: var(--ac-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #fff;
  cursor: pointer;
  background: var(--ac-accent);
  border: 0;
  border-radius: 8px;
  transition: background 120ms ease, transform 80ms ease;
}

.ac-panel .ac-insert:hover {
  color: #fff;
  background: #5a06dd;
}

.ac-panel .ac-insert:active {
  transform: translateY(1px);
}

.ac-panel .ac-insert:focus-visible {
  outline: 2px solid var(--ac-accent);
  outline-offset: 2px;
}
/* ---------- toast ---------- */

.ac-panel.ac-toast {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 2147483000;
  max-width: 340px;
  padding: 10px 14px;
  font-size: 12px;
  line-height: 1.5;
}

.ac-panel.ac-toast--error {
  color: #b91c1c;
  background: #fef2f2;
  border-color: #fca5a5;
}
`

export const injectPanelStyles = () => {
  if (document.getElementById(PANEL_STYLE_ID)) return

  const style = document.createElement("style")
  style.id = PANEL_STYLE_ID
  style.textContent = css

  document.head.appendChild(style)
}
