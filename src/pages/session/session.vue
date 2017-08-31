<template>
	<div>	
		<ms-header prefix="Session"></ms-header>

		<ms-scenario v-bind:on-success="start" v-bind:on-error="reset"></ms-scenario>
	</div>
</template>

<script src="./session.js"></script>