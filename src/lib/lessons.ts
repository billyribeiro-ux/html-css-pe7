export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

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
		desc: 'Build a complete production portfolio combining every technique from the entire PE7 course.',
		level: 5,
		tags: ['capstone', 'portfolio', 'all features']
	},
	{
		slug: '16-css-mixins',
		num: '16',
		title: 'Module 16: CSS Mixins & @apply',
		short: 'CSS Mixins & @apply',
		desc: 'Reusable style blocks with @mixin and @apply — design system primitives, responsive mixins, and composable patterns.',
		level: 6,
		tags: ['@mixin', '@apply', 'design systems']
	},
	{
		slug: '17-masonry-layout',
		num: '17',
		title: 'Module 17: Masonry Layout',
		short: 'Masonry Layout',
		desc: 'Pinterest-style layouts with display: masonry, masonry-template-tracks, spanning, and responsive auto-flow.',
		level: 6,
		tags: ['masonry', 'layout', 'gallery']
	},
	{
		slug: '18-popover-commands',
		num: '18',
		title: 'Module 18: Popover & Invoker Commands',
		short: 'Popover & Invokers',
		desc: 'Native popovers, commandfor/command attributes, interest invokers, anchor-positioned dropdowns — zero JS.',
		level: 6,
		tags: ['popover', 'commandfor', 'invoker']
	},
	{
		slug: '19-relative-colors',
		num: '19',
		title: 'Module 19: Relative Colors & contrast-color()',
		short: 'Relative Colors',
		desc: 'Generate palettes, tints, shades, and accessible text from a single base color with relative color syntax.',
		level: 6,
		tags: ['oklch(from)', 'contrast-color()', 'palette']
	},
	{
		slug: '20-property-houdini',
		num: '20',
		title: 'Module 20: @property & Houdini Animations',
		short: '@property & Houdini',
		desc: 'Typed custom properties that unlock gradient animations, number tickers, and complex choreography.',
		level: 7,
		tags: ['@property', 'Houdini', 'animation']
	},
	{
		slug: '21-css-math',
		num: '21',
		title: 'Module 21: CSS Math Functions',
		short: 'CSS Math Functions',
		desc: 'The full math suite: round(), mod(), sin(), cos(), pow(), sqrt() — circular layouts, wave patterns, and more.',
		level: 7,
		tags: ['sin()', 'round()', 'pow()']
	},
	{
		slug: '22-details-accordions',
		num: '22',
		title: 'Module 22: Exclusive Accordions & Details',
		short: 'Accordions & Details',
		desc: 'Exclusive accordion groups with <details name>, ::details-content animations, and styled disclosure widgets.',
		level: 7,
		tags: ['details', 'accordion', '::details-content']
	},
	{
		slug: '23-logical-a11y',
		num: '23',
		title: 'Module 23: Logical Properties & Accessibility CSS',
		short: 'Logical Props & A11y',
		desc: 'Internationalization-ready logical properties, prefers-* media queries, focus-visible, and accessibility-first CSS.',
		level: 7,
		tags: ['logical', 'a11y', 'prefers-*']
	},
	{
		slug: '24-shapes-clipping',
		num: '24',
		title: 'Module 24: Shapes, Clipping & Masking',
		short: 'Shapes & Clipping',
		desc: 'Clip elements into geometric forms with clip-path, wrap text around shapes, and create fade effects with mask-image.',
		level: 8,
		tags: ['clip-path', 'shape-outside', 'mask-image']
	},
	{
		slug: '25-advanced-typography',
		num: '25',
		title: 'Module 25: Advanced Typography & Variable Fonts',
		short: 'Typography & Fonts',
		desc: 'Variable fonts, text-wrap: balance/pretty, initial-letter drop caps, font-palette, and fluid type scales.',
		level: 8,
		tags: ['variable fonts', 'text-wrap', 'initial-letter']
	},
	{
		slug: '26-filters-blend',
		num: '26',
		title: 'Module 26: Filters, Blend Modes & Glassmorphism',
		short: 'Filters & Glass',
		desc: 'CSS filters, backdrop-filter, glassmorphism recipes, mix-blend-mode, and creative image effects.',
		level: 8,
		tags: ['filter', 'backdrop-filter', 'blend-mode']
	},
	{
		slug: '27-performance-containment',
		num: '27',
		title: 'Module 27: CSS Performance & Containment',
		short: 'Performance & Contain',
		desc: 'The rendering pipeline, contain, content-visibility, will-change, and production CSS optimization.',
		level: 8,
		tags: ['contain', 'content-visibility', 'will-change']
	},
	{
		slug: '28-counters-generated',
		num: '28',
		title: 'Module 28: Generated Content & CSS Counters',
		short: 'Counters & Content',
		desc: 'The content property, CSS counters, @counter-style, ::marker styling, and auto-numbered patterns.',
		level: 9,
		tags: ['counter()', '@counter-style', '::marker']
	},
	{
		slug: '29-svg-css',
		num: '29',
		title: 'Module 29: SVG & CSS Integration',
		short: 'SVG & CSS',
		desc: 'Inline SVG styling, currentColor icon systems, CSS-animated SVG, line-drawing effects, and SVG theming.',
		level: 9,
		tags: ['SVG', 'currentColor', 'stroke-dasharray']
	},
	{
		slug: '30-grand-capstone',
		num: '30',
		title: 'Module 30: PE7 Grand Capstone',
		short: 'Grand Capstone',
		desc: 'Build a production agency landing page using every CSS technique from all 29 modules. The final PE7 challenge.',
		level: 9,
		tags: ['capstone', 'all features', 'production']
	}
];

export const levelTitles: Record<Level, string> = {
	1: 'Foundations',
	2: 'Layout Mastery',
	3: 'Modern CSS',
	4: 'Advanced Techniques',
	5: 'PE7 Mastery',
	6: '2026 Deep Dives',
	7: 'Expert Systems',
	8: 'Production Polish',
	9: 'PE7 Grand Mastery'
};

export const levelSubtitles: Record<Level, string> = {
	1: 'Level 1 — Foundations',
	2: 'Level 2 — Layout Mastery',
	3: 'Level 3 — Modern CSS',
	4: 'Level 4 — Advanced',
	5: 'Level 5 — PE7 Mastery',
	6: 'Level 6 — 2026 Deep Dives',
	7: 'Level 7 — Expert Systems',
	8: 'Level 8 — Production Polish',
	9: 'Level 9 — PE7 Grand Mastery'
};

export function lessonIndex(slug: string): number {
	return lessons.findIndex((l) => l.slug === slug);
}

export function getLesson(slug: string): LessonMeta | undefined {
	return lessons.find((l) => l.slug === slug);
}
