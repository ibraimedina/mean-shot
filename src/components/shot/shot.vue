<template>
	<md-layout md-gutter>
		<md-layout md-flex="45">
			<span>{{shot.score}}</span>
		</md-layout>
		<md-layout md-flex="45">
			<span>({{shot.toBullseye}} cm)</span>
		</md-layout>
	</md-layout>
</template>

<script src="./shot.js"></script>