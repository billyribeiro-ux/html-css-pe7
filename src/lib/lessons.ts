export type Level = 1 | 2 | 3 | 4 | 5;

export interface LessonMeta {
	slug: string;
	num: string;
	title: string;
	short: string;
	desc: string;
	level: Level;
	tags: string[];
}

export const lessons: LessonMeta[] = [
	{
		slug: '01-html-foundations',
		num: '01',
		title: 'Module 01: The Building Blocks',
		short: 'The Building Blocks',
		desc: 'Document structure, semantic HTML5 elements, forms, and tables. Build a personal profile page.',
		level: 1,
		tags: ['semantic HTML', 'forms', 'structure']
	},
	{
		slug: '02-css-fundamentals',
		num: '02',
		title: 'Module 02: Painting the Web',
		short: 'Painting the Web',
		desc: 'Cascade, specificity, selectors, colors, units, typography, and backgrounds.',
		level: 1,
		tags: ['selectors', 'cascade', 'typography']
	},
	{
		slug: '03-box-model-layout',
		num: '03',
		title: 'Module 03: Understanding Space',
		short: 'Understanding Space',
		desc: 'Box model, display types, positioning, overflow, and z-index. Build a fixed nav + sticky sidebar.',
		level: 1,
		tags: ['box model', 'positioning', 'z-index']
	},
	{
		slug: '04-flexbox',
		num: '04',
		title: 'Module 04: One-Dimensional Flow',
		short: 'One-Dimensional Flow',
		desc: 'Flex container and item properties, axis control, alignment, wrapping, and gap.',
		level: 2,
		tags: ['flexbox', 'alignment', 'gap']
	},
	{
		slug: '05-grid',
		num: '05',
		title: 'Module 05: Two-Dimensional Power',
		short: 'Two-Dimensional Power',
		desc: 'Grid template, fr units, repeat(), minmax(), auto-fill, grid areas, and named lines.',
		level: 2,
		tags: ['grid', 'areas', 'fr unit']
	},
	{
		slug: '06-responsive-design',
		num: '06',
		title: 'Module 06: Every Screen Matters',
		short: 'Every Screen Matters',
		desc: 'Media queries, mobile-first, fluid typography with clamp(), viewport units, and aspect-ratio.',
		level: 2,
		tags: ['responsive', 'clamp()', 'media queries']
	},
	{
		slug: '07-custom-properties-cascade',
		num: '07',
		title: 'Module 07: Variables & Layers',
		short: 'Variables & Layers',
		desc: 'Custom properties, @property, cascade layers (@layer), @scope, and theming systems.',
		level: 3,
		tags: ['--custom', '@layer', '@scope']
	},
	{
		slug: '08-transitions-animations',
		num: '08',
		title: 'Module 08: Motion & Interaction',
		short: 'Motion & Interaction',
		desc: 'Transitions, @keyframes, @starting-style, interpolate-size, and display:none animations.',
		level: 3,
		tags: ['@keyframes', '@starting-style', 'motion']
	},
	{
		slug: '09-nesting-selectors',
		num: '09',
		title: 'Module 09: Nesting & :has()',
		short: 'Nesting & :has()',
		desc: 'Native CSS nesting, the & selector, :has() parent selector, :is(), :where(), :not().',
		level: 3,
		tags: ['nesting', ':has()', ':is()']
	},
	{
		slug: '10-container-queries-subgrid',
		num: '10',
		title: 'Module 10: Component-Aware Design',
		short: 'Component-Aware Design',
		desc: 'Container queries, container units (cqw, cqi), style queries, and CSS Subgrid.',
		level: 4,
		tags: ['@container', 'subgrid', 'cqw']
	},
	{
		slug: '11-modern-colors',
		num: '11',
		title: 'Module 11: Color Science',
		short: 'Color Science',
		desc: 'OKLCH, color-mix(), relative colors, light-dark(), wide-gamut colors, and theming.',
		level: 4,
		tags: ['oklch()', 'color-mix()', 'light-dark()']
	},
	{
		slug: '12-scroll-animations',
		num: '12',
		title: 'Module 12: Scroll-Powered',
		short: 'Scroll-Powered',
		desc: 'Scroll-driven animations, view timelines, scroll-snap, ::scroll-button, ::scroll-marker.',
		level: 4,
		tags: ['scroll()', 'view()', '::scroll-marker']
	},
	{
		slug: '13-view-transitions-anchor',
		num: '13',
		title: 'Module 13: Transitions & Anchoring',
		short: 'Transitions & Anchoring',
		desc: 'View Transitions API, CSS Anchor Positioning, Popover API styling, floating UI.',
		level: 5,
		tags: ['view-transition', 'anchor()', 'popover']
	},
	{
		slug: '14-cutting-edge-2026',
		num: '14',
		title: 'Module 14: The Bleeding Edge',
		short: 'The Bleeding Edge',
		desc: 'CSS if(), sibling-count(), sibling-index(), enhanced attr(), custom select, field-sizing.',
		level: 5,
		tags: ['if()', 'sibling-index()', 'base-select']
	},
	{
		slug: '15-capstone-project',
		num: '15',
		title: 'Module 15: PE7 Portfolio',
		short: 'PE7 Portfolio',
		desc: 'Build a complete production portfolio combining every technique from all 14 modules.',
		level: 5,
		tags: ['capstone', 'portfolio', 'all features']
	}
];

export const levelTitles: Record<Level, string> = {
	1: 'Foundations',
	2: 'Layout Mastery',
	3: 'Modern CSS',
	4: 'Advanced Techniques',
	5: 'PE7 Mastery'
};

export const levelSubtitles: Record<Level, string> = {
	1: 'Level 1 — Foundations',
	2: 'Level 2 — Layout Mastery',
	3: 'Level 3 — Modern CSS',
	4: 'Level 4 — Advanced',
	5: 'Level 5 — PE7 Mastery'
};

export function lessonIndex(slug: string): number {
	return lessons.findIndex((l) => l.slug === slug);
}

export function getLesson(slug: string): LessonMeta | undefined {
	return lessons.find((l) => l.slug === slug);
}
