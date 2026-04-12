/**
 * PE7 Course — Live Code Editor (CodeMirror 6, SvelteKit edition)
 *
 * Scans a root element for <div class="live-editor"> containers, each holding
 * <template class="starter-html"> / <template class="starter-css"> with
 * starter code, and replaces them with a CodeMirror-powered HTML/CSS playground
 * that renders a live preview in a sandboxed iframe.
 */
import {
	EditorView,
	keymap,
	lineNumbers,
	highlightActiveLineGutter,
	highlightSpecialChars,
	drawSelection,
	dropCursor,
	rectangularSelection,
	crosshairCursor,
	highlightActiveLine
} from '@codemirror/view';
import { EditorState, type Extension } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import {
	syntaxHighlighting,
	defaultHighlightStyle,
	indentOnInput,
	bracketMatching,
	foldGutter,
	foldKeymap
} from '@codemirror/language';
import {
	closeBrackets,
	closeBracketsKeymap,
	autocompletion,
	completionKeymap
} from '@codemirror/autocomplete';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';

const pe7Theme = EditorView.theme(
	{
		'&': { fontSize: '14px' },
		'.cm-scroller': {
			fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace"
		},
		'.cm-gutters': { background: '#0d0f17', borderRight: '1px solid #1e2130' },
		'.cm-activeLineGutter': { background: '#1a1d2e' },
		'&.cm-focused .cm-cursor': { borderLeftColor: '#6366f1' },
		'&.cm-focused .cm-selectionBackground, ::selection': { background: '#6366f140' }
	},
	{ dark: true }
);

function basicSetup(): Extension[] {
	return [
		lineNumbers(),
		highlightActiveLineGutter(),
		highlightSpecialChars(),
		history(),
		foldGutter(),
		drawSelection(),
		dropCursor(),
		EditorState.allowMultipleSelections.of(true),
		indentOnInput(),
		syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
		bracketMatching(),
		closeBrackets(),
		autocompletion(),
		rectangularSelection(),
		crosshairCursor(),
		highlightActiveLine(),
		highlightSelectionMatches(),
		keymap.of([
			...closeBracketsKeymap,
			...defaultKeymap,
			...searchKeymap,
			...historyKeymap,
			...foldKeymap,
			...completionKeymap,
			indentWithTab
		])
	];
}

function debounce<A extends unknown[]>(fn: (...args: A) => void, ms: number) {
	let t: ReturnType<typeof setTimeout> | undefined;
	return (...args: A) => {
		clearTimeout(t);
		t = setTimeout(() => fn(...args), ms);
	};
}

type Mode = 'html-css' | 'html' | 'css';

class PE7Editor {
	container: HTMLElement;
	mode: Mode;
	editors: Partial<Record<'html' | 'css', EditorView>> = {};
	wraps: Partial<Record<'html' | 'css', HTMLDivElement>> = {};
	activeTab: 'html' | 'css';
	starterHTML: string;
	starterCSS: string;
	iframe!: HTMLIFrameElement;

	constructor(container: HTMLElement) {
		this.container = container;
		this.mode = ((container.dataset.mode as Mode) || 'html-css') as Mode;
		this.activeTab = this.mode === 'css' ? 'css' : 'html';

		const htmlTpl = container.querySelector<HTMLTemplateElement>('template.starter-html');
		const cssTpl = container.querySelector<HTMLTemplateElement>('template.starter-css');
		this.starterHTML = htmlTpl ? htmlTpl.innerHTML.trim() : '<!-- Write your HTML here -->\n';
		this.starterCSS = cssTpl ? cssTpl.innerHTML.trim() : '/* Write your CSS here */\n';

		this.init();
	}

	init() {
		this.container.innerHTML = '';
		this.buildToolbar();
		this.buildPanes();
		this.updatePreview();
	}

	buildToolbar() {
		const toolbar = document.createElement('div');
		toolbar.className = 'live-editor-toolbar';

		const tabs = document.createElement('div');
		tabs.className = 'live-editor-tabs';
		if (this.mode !== 'css') tabs.appendChild(this.createTab('HTML', 'html'));
		if (this.mode !== 'html') tabs.appendChild(this.createTab('CSS', 'css'));
		toolbar.appendChild(tabs);

		const spacer = document.createElement('div');
		spacer.style.flex = '1';
		toolbar.appendChild(spacer);

		const actions = document.createElement('div');
		actions.className = 'live-editor-actions';
		actions.appendChild(this.createBtn('Reset', () => this.resetCode()));
		actions.appendChild(this.createBtn('Copy', () => this.copyCode()));
		actions.appendChild(this.createBtn('Run', () => this.updatePreview()));
		toolbar.appendChild(actions);

		this.container.appendChild(toolbar);
	}

	createTab(label: string, lang: 'html' | 'css') {
		const btn = document.createElement('button');
		btn.className = 'live-editor-tab';
		btn.textContent = label;
		btn.dataset.lang = lang;
		if (lang === this.activeTab) btn.classList.add('active');
		btn.addEventListener('click', () => this.switchTab(lang));
		return btn;
	}

	createBtn(label: string, handler: () => void) {
		const btn = document.createElement('button');
		btn.className = 'live-editor-btn';
		btn.textContent = label;
		btn.addEventListener('click', handler);
		return btn;
	}

	buildPanes() {
		const panes = document.createElement('div');
		panes.className = 'live-editor-panes';

		const codePane = document.createElement('div');
		codePane.className = 'live-editor-code';

		const debouncedUpdate = debounce(() => this.updatePreview(), 300);
		const updateListener = EditorView.updateListener.of((update) => {
			if (update.docChanged) debouncedUpdate();
		});

		if (this.mode !== 'css') {
			const htmlWrap = document.createElement('div');
			htmlWrap.className = 'live-editor-cm-wrap';
			if (this.activeTab !== 'html') htmlWrap.style.display = 'none';
			this.editors.html = new EditorView({
				state: EditorState.create({
					doc: this.starterHTML,
					extensions: [...basicSetup(), html(), oneDark, pe7Theme, updateListener]
				}),
				parent: htmlWrap
			});
			codePane.appendChild(htmlWrap);
			this.wraps.html = htmlWrap;
		}

		if (this.mode !== 'html') {
			const cssWrap = document.createElement('div');
			cssWrap.className = 'live-editor-cm-wrap';
			if (this.activeTab !== 'css') cssWrap.style.display = 'none';
			this.editors.css = new EditorView({
				state: EditorState.create({
					doc: this.starterCSS,
					extensions: [...basicSetup(), css(), oneDark, pe7Theme, updateListener]
				}),
				parent: cssWrap
			});
			codePane.appendChild(cssWrap);
			this.wraps.css = cssWrap;
		}

		panes.appendChild(codePane);

		const previewPane = document.createElement('div');
		previewPane.className = 'live-editor-preview';
		const iframe = document.createElement('iframe');
		iframe.sandbox.add('allow-scripts', 'allow-same-origin');
		iframe.title = 'Live Preview';
		this.iframe = iframe;
		previewPane.appendChild(iframe);
		panes.appendChild(previewPane);

		this.container.appendChild(panes);
	}

	switchTab(lang: 'html' | 'css') {
		this.activeTab = lang;
		for (const t of this.container.querySelectorAll<HTMLButtonElement>('.live-editor-tab')) {
			t.classList.toggle('active', t.dataset.lang === lang);
		}
		for (const [key, wrap] of Object.entries(this.wraps) as ['html' | 'css', HTMLDivElement][]) {
			wrap.style.display = key === lang ? '' : 'none';
		}
	}

	getCode(lang: 'html' | 'css') {
		return this.editors[lang]?.state.doc.toString() ?? '';
	}

	updatePreview() {
		const htmlCode = this.getCode('html');
		const cssCode = this.getCode('css');
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
				changes: {
					from: 0,
					to: this.editors.html.state.doc.length,
					insert: this.starterHTML
				}
			});
		}
		if (this.editors.css) {
			this.editors.css.dispatch({
				changes: {
					from: 0,
					to: this.editors.css.state.doc.length,
					insert: this.starterCSS
				}
			});
		}
		this.updatePreview();
	}

	async copyCode() {
		const code = this.getCode(this.activeTab);
		try {
			await navigator.clipboard.writeText(code);
			const btn = this.container.querySelector<HTMLButtonElement>(
				'.live-editor-actions .live-editor-btn:nth-child(2)'
			);
			if (btn) {
				const orig = btn.textContent;
				btn.textContent = 'Copied!';
				setTimeout(() => {
					btn.textContent = orig;
				}, 1500);
			}
		} catch {
			/* ignore clipboard failure */
		}
	}

	destroy() {
		for (const editor of Object.values(this.editors)) editor?.destroy();
		this.editors = {};
		this.wraps = {};
	}
}

export function initEditors(root: HTMLElement): () => void {
	const instances: PE7Editor[] = [];
	for (const el of root.querySelectorAll<HTMLElement>('.live-editor')) {
		instances.push(new PE7Editor(el));
	}
	return () => {
		for (const e of instances) e.destroy();
	};
}
