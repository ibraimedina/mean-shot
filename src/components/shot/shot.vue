<template>
	<md-layout md-gutter>
		<md-layout md-flex="45" v-for="(data, crit) in shot">
			<span>{{data}} {{criterias[crit].unit}}</span>
		</md-layout>
	</md-layout>
</template>

<script src="./shot.js"></script>