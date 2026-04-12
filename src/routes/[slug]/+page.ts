import { error } from '@sveltejs/kit';
import { lessons } from '$lib/lessons';
import type { PageLoad } from './$types';

// Eagerly import all lesson HTML as raw strings at build time.
const htmlModules = import.meta.glob('/src/lessons/*/index.html', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

// Eagerly import all lesson stylesheet URLs. Using ?url keeps the CSS in a
// separate bundled file that the browser loads via <link>, avoiding inline
// <style> injection (and the accompanying {@html} XSS surface).
const cssUrls = import.meta.glob('/src/lessons/*/styles.css', {
	query: '?url',
	import: 'default',
	eager: true
}) as Record<string, string>;

function byLessonSlug<T>(modules: Record<string, T>): Record<string, T> {
	const out: Record<string, T> = {};
	for (const [path, value] of Object.entries(modules)) {
		const match = path.match(/\/src\/lessons\/([^/]+)\//);
		if (match) out[match[1]] = value;
	}
	return out;
}

const htmlBySlug = byLessonSlug(htmlModules);
const cssUrlBySlug = byLessonSlug(cssUrls);

/**
 * Extract the lesson content from the raw HTML page:
 *   1. Prefer <main>...</main>; fall back to <body>...</body>.
 *   2. Strip the legacy <nav class="course-nav"> and <footer class="lesson-footer">
 *      (replaced by the SvelteKit sidebar + bottom bar).
 *   3. Strip the legacy <script> tag that used to load live-editor.js
 *      (replaced by the LiveEditor attachment in the page component).
 */
function extractContent(rawHtml: string): string {
	let body = rawHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1];
	if (!body) body = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];
	if (!body) body = rawHtml;

	return body
		.replace(/<nav\s+class="course-nav"[\s\S]*?<\/nav>/gi, '')
		.replace(/<footer\s+class="lesson-footer"[\s\S]*?<\/footer>/gi, '')
		.replace(/<script\b[^>]*src=["'][^"']*live-editor\.js["'][^>]*>\s*<\/script>/gi, '');
}

export const entries = () => lessons.map((l) => ({ slug: l.slug }));
export const prerender = true;

export const load: PageLoad = async ({ params }) => {
	const lesson = lessons.find((l) => l.slug === params.slug);
	if (!lesson) throw error(404, `Unknown lesson: ${params.slug}`);

	const rawHtml = htmlBySlug[params.slug];
	const cssUrl = cssUrlBySlug[params.slug] ?? null;
	if (!rawHtml) throw error(404, `Lesson content missing for ${params.slug}`);

	return {
		lesson,
		content: extractContent(rawHtml),
		cssUrl
	};
};
