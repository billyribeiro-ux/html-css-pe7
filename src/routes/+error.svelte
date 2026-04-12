<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="error-page">
	<h1>{page.status}</h1>
	<p>{page.error?.message ?? 'Something went wrong.'}</p>
	<a href="/">← Back to course</a>
</div>

<style>
	.error-page {
		min-height: 60vh;
		display: grid;
		place-content: center;
		text-align: center;
		gap: 1rem;
		padding: 2rem;
	}
	.error-page h1 {
		font-size: 4rem;
		margin: 0;
		color: var(--accent-light);
	}
	.error-page a {
		color: var(--accent-light);
	}
</style>
