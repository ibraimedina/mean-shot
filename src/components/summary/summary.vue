<style scoped>
	.text-value {
    font-size: large;
    font-weight: lighter;
	}
	.text-secondary {
		color: gray;
		font-size: smaller;
	}
	.md-accent .text-secondary {
		color: white;
	}
</style>

<template>
	<md-layout>
		<md-layout md-column title="mean">
			<span class="text-value">{{data.mean}}</span>
			<span class="text-secondary">scored {{data.sum}} from {{data.quantity}} shots</span>
		</md-layout>
		
		<md-layout md-column title="mean to bullseye">
			<span class="text-value">{{data.toBullseyeMean}}cm</span>
			<span class="text-secondary">{{data.toBullseyeMin}}cm - {{data.toBullseyeMax}}cm</span>
		</md-layout>
	</md-layout>
</template>

<script src="./summary.js"></script>