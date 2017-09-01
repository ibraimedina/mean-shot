<style>
	.fade-enter-active {
	  transition: opacity .5s
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	  opacity: 0
	}
</style>

<template>
	<div>	
		<ms-header v-bind:prefix="'Session' + (session.scenario ? ' on ' + session.scenario : '')"></ms-header>

		<transition name="fade">
			<ms-scenario v-show="!onSession" v-bind:on-success="start" v-bind:on-error="reset"></ms-scenario>
		</transition>
		<transition name="fade">
			<ms-shots v-show="onSession" v-bind:on-save="saveShots"></ms-shots>
		</transition>
	</div>
</template>

<script src="./session.js"></script>