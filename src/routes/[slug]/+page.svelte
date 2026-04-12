<script lang="ts">
	import { initEditors } from '$lib/liveEditor';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Attachment mounts CodeMirror live editors on the lesson container and
	// returns the teardown function. The {#key} wrapper below forces a fresh
	// element on every navigation, so teardown runs for the old lesson and
	// attach runs for the new one.
	function liveEditors(node: HTMLElement) {
		return initEditors(node);
	}
</script>

<svelte:head>
	{#if data.cssUrl}
		<link rel="stylesheet" href={data.cssUrl} />
	{/if}
</svelte:head>

{#key data.lesson.slug}
	<article class="lesson-wrapper" {@attach liveEditors}>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html data.content}
	</article>
{/key}

<style>
	.lesson-wrapper {
		display: block;
		background: var(--bg);
		min-height: 100%;
	}

	/* The lesson HTML was designed for a standalone page.
	   These overrides keep it fitting inside the SPA shell. */
	.lesson-wrapper :global(.course-nav),
	.lesson-wrapper :global(.lesson-footer) {
		display: none;
	}
</style>
