<template>
	<md-toolbar>
		<h1 class="md-title">
			<span v-if="prefix">{{prefix}} - </span>
			<span>{{title || "Mean Shot"}}</span>
		</h1>
	</md-toolbar>
</template>

<script src="./header.js"></script>