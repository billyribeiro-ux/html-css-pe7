<script lang="ts">
	import { goto } from '$app/navigation';
	import { lessons, levelTitles, type Level } from '$lib/lessons';
	import { progress } from '$lib/progress.svelte';

	const grouped = $derived.by(() => {
		const map = new Map<Level, typeof lessons>();
		for (const l of lessons) {
			const arr = map.get(l.level) ?? [];
			arr.push(l);
			map.set(l.level, arr);
		}
		return [...map.entries()].sort(([a], [b]) => a - b);
	});

	function navigate(slug: string) {
		goto(`/${slug}`);
	}
</script>

<div class="home-view">
	<header class="hero">
		<div class="hero-badge">Principal Engineer 7 Mastery</div>
		<h1>HTML / CSS PE7</h1>
		<p>
			From absolute beginner to cutting-edge 2026 CSS mastery. Learn by building real components
			with the PE7 methodology.
		</p>
		<div class="hero-stats">
			<div class="hero-stat">
				<span class="number">{lessons.length}</span>
				<span class="label">Modules</span>
			</div>
			<div class="hero-stat">
				<span class="number">5</span>
				<span class="label">Levels</span>
			</div>
			<div class="hero-stat">
				<span class="number">2026</span>
				<span class="label">CSS Features</span>
			</div>
		</div>
	</header>

	<div class="course-content">
		{#each grouped as [level, items] (level)}
			<section class="level-section l{level}">
				<div class="level-title">
					<span class="badge">Level {level}</span>
					<h2>{levelTitles[level]}</h2>
				</div>
				<div class="modules-grid">
					{#each items as lesson (lesson.slug)}
						<a
							class="module-card"
							class:completed={progress.isDone(lesson.slug)}
							href="/{lesson.slug}"
							onclick={(e) => {
								e.preventDefault();
								navigate(lesson.slug);
							}}
						>
							<span class="card-check">✓</span>
							<div class="module-number">Module {lesson.num}</div>
							<h3>{lesson.short}</h3>
							<p>{lesson.desc}</p>
							<div class="tags">
								{#each lesson.tags as tag (tag)}
									<span class="tag">{tag}</span>
								{/each}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/each}
	</div>

	<footer class="site-footer">
		HTML/CSS PE7 Course — From Beginner to Principal Engineer Mastery — 2026 Edition
	</footer>
</div>
