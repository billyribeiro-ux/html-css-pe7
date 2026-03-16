/**
 * PE7 Course — Live Code Editor Component
 * Powered by CodeMirror 6 (loaded from CDN)
 *
 * Usage: Add a <div class="live-editor" data-mode="html-css"> with
 * <template class="starter-html"> and <template class="starter-css">
 * children. The editor auto-initialises on DOMContentLoaded.
 */

const CDN = 'https://esm.sh';

let cmModules = null;

async function loadCodeMirror() {
  if (cmModules) return cmModules;
  const [
    { EditorView, keymap, lineNumbers, highlightActiveLineGutter,
      highlightSpecialChars, drawSelection, dropCursor,
      rectangularSelection, crosshairCursor, highlightActiveLine },
    { EditorState },
    { defaultKeymap, history, historyKeymap, indentWithTab },
    { syntaxHighlighting, defaultHighlightStyle, indentOnInput,
      bracketMatching, foldGutter, foldKeymap },
    { closeBrackets, closeBracketsKeymap, autocompletion, completionKeymap },
    { highlightSelectionMatches, searchKeymap },
    { html },
    { css },
    { oneDark }
  ] = await Promise.all([
    import(`${CDN}/@codemirror/view@6?bundle-deps`),
    import(`${CDN}/@codemirror/state@6?bundle-deps`),
    import(`${CDN}/@codemirror/commands@6?bundle-deps`),
    import(`${CDN}/@codemirror/language@6?bundle-deps`),
    import(`${CDN}/@codemirror/autocomplete@6?bundle-deps`),
    import(`${CDN}/@codemirror/search@6?bundle-deps`),
    import(`${CDN}/@codemirror/lang-html@6?bundle-deps`),
    import(`${CDN}/@codemirror/lang-css@6?bundle-deps`),
    import(`${CDN}/@codemirror/theme-one-dark@6?bundle-deps`),
  ]);

  cmModules = {
    EditorView, EditorState, keymap, lineNumbers, highlightActiveLineGutter,
    highlightSpecialChars, drawSelection, dropCursor, rectangularSelection,
    crosshairCursor, highlightActiveLine, defaultKeymap, history,
    historyKeymap, indentWithTab, syntaxHighlighting, defaultHighlightStyle,
    indentOnInput, bracketMatching, foldGutter, foldKeymap, closeBrackets,
    closeBracketsKeymap, autocompletion, completionKeymap,
    highlightSelectionMatches, searchKeymap, html, css, oneDark
  };
  return cmModules;
}

/* ── Custom PE7 theme overrides ── */
function pe7Theme(EV) {
  return EV.theme({
    '&': { fontSize: '14px' },
    '.cm-scroller': { fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace" },
    '.cm-gutters': { background: '#0d0f17', borderRight: '1px solid #1e2130' },
    '.cm-activeLineGutter': { background: '#1a1d2e' },
    '&.cm-focused .cm-cursor': { borderLeftColor: '#6366f1' },
    '&.cm-focused .cm-selectionBackground, ::selection': { background: '#6366f140' },
  }, { dark: true });
}

/* ── Helper: build basic-setup extensions ── */
function basicSetup(cm) {
  return [
    cm.lineNumbers(),
    cm.highlightActiveLineGutter(),
    cm.highlightSpecialChars(),
    cm.history(),
    cm.foldGutter(),
    cm.drawSelection(),
    cm.dropCursor(),
    cm.EditorState.allowMultipleSelections.of(true),
    cm.indentOnInput(),
    cm.syntaxHighlighting(cm.defaultHighlightStyle, { fallback: true }),
    cm.bracketMatching(),
    cm.closeBrackets(),
    cm.autocompletion(),
    cm.rectangularSelection(),
    cm.crosshairCursor(),
    cm.highlightActiveLine(),
    cm.highlightSelectionMatches(),
    cm.keymap.of([
      ...cm.closeBracketsKeymap,
      ...cm.defaultKeymap,
      ...cm.searchKeymap,
      ...cm.historyKeymap,
      ...cm.foldKeymap,
      ...cm.completionKeymap,
      cm.indentWithTab,
    ]),
  ];
}

/* ── Debounce utility ── */
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ── PE7 Live Editor Class ── */
class PE7Editor {
  constructor(container) {
    this.container = container;
    this.mode = container.dataset.mode || 'html-css';
    this.editors = {};
    this.activeTab = this.mode === 'css' ? 'css' : 'html';

    // Extract starter code from <template> elements
    const htmlTpl = container.querySelector('template.starter-html');
    const cssTpl = container.querySelector('template.starter-css');
    this.starterHTML = htmlTpl ? htmlTpl.innerHTML.trim() : '<!-- Write your HTML here -->\n';
    this.starterCSS = cssTpl ? cssTpl.innerHTML.trim() : '/* Write your CSS here */\n';

    this.init();
  }

  async init() {
    const cm = await loadCodeMirror();
    this.cm = cm;

    // Clear container (remove templates)
    this.container.innerHTML = '';

    // Build UI
    this.buildToolbar();
    this.buildPanes();
    this.updatePreview();
  }

  buildToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'live-editor-toolbar';

    // Tabs
    const tabs = document.createElement('div');
    tabs.className = 'live-editor-tabs';

    if (this.mode !== 'css') {
      const htmlTab = this.createTab('HTML', 'html');
      tabs.appendChild(htmlTab);
    }
    if (this.mode !== 'html') {
      const cssTab = this.createTab('CSS', 'css');
      tabs.appendChild(cssTab);
    }
    toolbar.appendChild(tabs);

    // Spacer
    const spacer = document.createElement('div');
    spacer.style.flex = '1';
    toolbar.appendChild(spacer);

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'live-editor-actions';

    actions.appendChild(this.createBtn('Reset', () => this.resetCode()));
    actions.appendChild(this.createBtn('Copy', () => this.copyCode()));
    actions.appendChild(this.createBtn('Run', () => this.updatePreview()));

    toolbar.appendChild(actions);
    this.container.appendChild(toolbar);
  }

  createTab(label, lang) {
    const btn = document.createElement('button');
    btn.className = 'live-editor-tab';
    btn.textContent = label;
    btn.dataset.lang = lang;
    if (lang === this.activeTab) btn.classList.add('active');
    btn.addEventListener('click', () => this.switchTab(lang));
    return btn;
  }

  createBtn(label, handler) {
    const btn = document.createElement('button');
    btn.className = 'live-editor-btn';
    btn.textContent = label;
    btn.addEventListener('click', handler);
    return btn;
  }

  buildPanes() {
    const panes = document.createElement('div');
    panes.className = 'live-editor-panes';

    // Code pane
    const codePane = document.createElement('div');
    codePane.className = 'live-editor-code';

    const debouncedUpdate = debounce(() => this.updatePreview(), 300);
    const updateListener = this.cm.EditorView.updateListener.of(update => {
      if (update.docChanged) debouncedUpdate();
    });

    // Create editors
    if (this.mode !== 'css') {
      const htmlWrap = document.createElement('div');
      htmlWrap.className = 'live-editor-cm-wrap';
      if (this.activeTab !== 'html') htmlWrap.style.display = 'none';
      this.editors.html = new this.cm.EditorView({
        state: this.cm.EditorState.create({
          doc: this.starterHTML,
          extensions: [
            basicSetup(this.cm),
            this.cm.html(),
            this.cm.oneDark,
            pe7Theme(this.cm.EditorView),
            updateListener,
          ],
        }),
        parent: htmlWrap,
      });
      codePane.appendChild(htmlWrap);
      this.editors.html._wrap = htmlWrap;
    }

    if (this.mode !== 'html') {
      const cssWrap = document.createElement('div');
      cssWrap.className = 'live-editor-cm-wrap';
      if (this.activeTab !== 'css') cssWrap.style.display = 'none';
      this.editors.css = new this.cm.EditorView({
        state: this.cm.EditorState.create({
          doc: this.starterCSS,
          extensions: [
            basicSetup(this.cm),
            this.cm.css(),
            this.cm.oneDark,
            pe7Theme(this.cm.EditorView),
            updateListener,
          ],
        }),
        parent: cssWrap,
      });
      codePane.appendChild(cssWrap);
      this.editors.css._wrap = cssWrap;
    }

    panes.appendChild(codePane);

    // Preview pane
    const previewPane = document.createElement('div');
    previewPane.className = 'live-editor-preview';
    const iframe = document.createElement('iframe');
    iframe.sandbox = 'allow-scripts allow-same-origin';
    iframe.title = 'Live Preview';
    this.iframe = iframe;
    previewPane.appendChild(iframe);
    panes.appendChild(previewPane);

    this.container.appendChild(panes);
  }

  switchTab(lang) {
    this.activeTab = lang;
    // Update tab buttons
    this.container.querySelectorAll('.live-editor-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.lang === lang);
    });
    // Show/hide editors
    Object.entries(this.editors).forEach(([key, editor]) => {
      editor._wrap.style.display = key === lang ? '' : 'none';
    });
  }

  getCode(lang) {
    return this.editors[lang]?.state.doc.toString() || '';
  }

  updatePreview() {
    const htmlCode = this.getCode('html') || '';
    const cssCode = this.getCode('css') || '';
    const doc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
*,*::before,*::after{box-sizing:border-box}
body{margin:1rem;font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#1e293b}
img{max-width:100%;display:block}
${cssCode}
</style>
</head>
<body>
${htmlCode}
</body>
</html>`;
    this.iframe.srcdoc = doc;
  }

  resetCode() {
    if (this.editors.html) {
      this.editors.html.dispatch({
        changes: { from: 0, to: this.editors.html.state.doc.length, insert: this.starterHTML }
      });
    }
    if (this.editors.css) {
      this.editors.css.dispatch({
        changes: { from: 0, to: this.editors.css.state.doc.length, insert: this.starterCSS }
      });
    }
    this.updatePreview();
  }

  async copyCode() {
    const code = this.getCode(this.activeTab);
    try {
      await navigator.clipboard.writeText(code);
      const btn = this.container.querySelector('.live-editor-actions .live-editor-btn:nth-child(2)');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = orig; }, 1500);
      }
    } catch {
      // Fallback: select text in editor
    }
  }
}

/* ── Initialise all editors on page ── */
function initAllEditors() {
  document.querySelectorAll('.live-editor').forEach(el => new PE7Editor(el));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllEditors);
} else {
  initAllEditors();
}
