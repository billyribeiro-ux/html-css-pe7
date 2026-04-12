import { browser } from '$app/environment';
import { lessons } from './lessons';

const STORAGE_KEY = 'pe7-progress';

function load(): Record<string, boolean> {
	if (!browser) return {};
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
	} catch {
		return {};
	}
}

function createProgress() {
	const completed = $state<Record<string, boolean>>(load());

	function persist() {
		if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
	}

	return {
		get completed() {
			return completed;
		},
		isDone(slug: string): boolean {
			return !!completed[slug];
		},
		toggle(slug: string) {
			completed[slug] = !completed[slug];
			persist();
		},
		set(slug: string, value: boolean) {
			completed[slug] = value;
			persist();
		},
		get doneCount(): number {
			return lessons.filter((l) => completed[l.slug]).length;
		},
		get totalCount(): number {
			return lessons.length;
		},
		get percent(): number {
			return lessons.length === 0 ? 0 : (this.doneCount / lessons.length) * 100;
		}
	};
}

export const progress = createProgress();
