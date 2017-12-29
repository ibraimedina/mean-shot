<style scoped>
	.text-value {
    font-size: large;
    font-weight: lighter;
	}
	.text-secondary {
		color: gray;
		font-size: smaller;
	}
	.md-accent .text-secondary,
	.md-primary .text-secondary {
		color: white;
	}
</style>

<template>
	<md-layout md-gutter>
		<md-layout md-column v-for="(highlights, criteria) in data" v-bind:title="criteria">
			<span class="text-value">{{roundUp(highlights.mean, 100)}}{{highlights.unit}}</span>
			<span class="text-secondary">{{highlights.summary}}</span>
		</md-layout>
	</md-layout>
</template>

<script src="./summary.js"></script>