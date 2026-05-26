<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { lessons, levelSubtitles, lessonIndex, getLesson, type Level } from '$lib/lessons';
	import { progress } from '$lib/progress.svelte';

	let { children } = $props();

	let sidebarOpen = $state(false);

	const currentSlug = $derived(page.params.slug ?? null);
	const currentLesson = $derived(currentSlug ? getLesson(currentSlug) : null);
	const currentIdx = $derived(currentSlug ? lessonIndex(currentSlug) : -1);
	const hasPrev = $derived(currentIdx > 0);
	const hasNext = $derived(currentIdx >= 0 && currentIdx < lessons.length - 1);

	// Group lessons by level for the sidebar
	const grouped = $derived.by(() => {
		const map = new Map<number, typeof lessons>();
		for (const l of lessons) {
			const arr = map.get(l.level) ?? [];
			arr.push(l);
			map.set(l.level, arr);
		}
		return [...map.entries()].sort(([a], [b]) => a - b);
	});

	function goHome() {
		sidebarOpen = false;
		goto('/');
	}

	function navigate(slug: string) {
		sidebarOpen = false;
		goto(`/${slug}`);
	}

	function goPrev() {
		if (currentIdx > 0) navigate(lessons[currentIdx - 1].slug);
	}

	function goNext() {
		if (currentIdx >= 0 && currentIdx < lessons.length - 1) {
			navigate(lessons[currentIdx + 1].slug);
		}
	}

	function toggleComplete() {
		if (currentSlug) progress.toggle(currentSlug);
	}

	// Legacy hash redirect: #01-html-foundations -> /01-html-foundations
	$effect(() => {
		if (typeof window === 'undefined') return;
		const hash = window.location.hash.slice(1);
		if (hash && lessons.some((l) => l.slug === hash) && page.url.pathname === '/') {
			goto(`/${hash}`, { replaceState: true });
		}
	});

	// Keyboard shortcuts
	$effect(() => {
		function onKey(e: KeyboardEvent) {
			if (!currentSlug) return;
			const t = e.target as HTMLElement | null;
			if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
			if (e.key === 'ArrowLeft' && hasPrev) goPrev();
			else if (e.key === 'ArrowRight' && hasNext) goNext();
			else if (e.key === 'Escape') goHome();
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	const pageTitle = $derived(
		currentLesson ? `${currentLesson.title} | PE7` : 'HTML/CSS PE7 — Master Course'
	);
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<header class="topbar">
	<button
		class="topbar-burger"
		aria-label="Toggle menu"
		onclick={() => (sidebarOpen = !sidebarOpen)}
	>
		☰
	</button>
	<button class="topbar-brand" onclick={goHome}>HTML/CSS PE7</button>
	<span class="topbar-title">
		{currentLesson ? currentLesson.title : 'Master Course'}
	</span>
	<div class="topbar-progress-wrap">
		<span>{progress.doneCount} / {progress.totalCount}</span>
		<div class="topbar-progress-bar">
			<div class="topbar-progress-fill" style:width="{progress.percent}%"></div>
		</div>
	</div>
</header>

<div
	class="sidebar-overlay"
	class:open={sidebarOpen}
	onclick={() => (sidebarOpen = false)}
	role="presentation"
></div>

<nav class="sidebar" class:open={sidebarOpen}>
	{#each grouped as [level, items] (level)}
		<div class="sidebar-group g{level}">
			<div class="sidebar-group-title">{levelSubtitles[level as Level]}</div>
			{#each items as lesson (lesson.slug)}
				<a
					class="sidebar-link"
					class:active={currentSlug === lesson.slug}
					class:completed={progress.isDone(lesson.slug)}
					href="/{lesson.slug}"
					onclick={(e) => {
						e.preventDefault();
						navigate(lesson.slug);
					}}
				>
					<span class="num">{lesson.num}</span>
					{lesson.short}
					<span class="check">✓</span>
				</a>
			{/each}
		</div>
	{/each}
</nav>

<main class="main-area" class:has-bottombar={!!currentSlug}>
	{@render children()}
</main>

{#if currentSlug}
	<div class="module-bottombar">
		<button disabled={!hasPrev} onclick={goPrev}>← Previous</button>
		<button
			class="btn-complete"
			class:is-completed={progress.isDone(currentSlug)}
			onclick={toggleComplete}
		>
			{progress.isDone(currentSlug) ? '✓ Completed' : 'Mark Complete'}
		</button>
		<button disabled={!hasNext} onclick={goNext}>Next →</button>
	</div>
{/if}
