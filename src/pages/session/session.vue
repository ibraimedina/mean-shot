<style>
	.fade-enter-active {
	  transition: opacity .5s
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	  opacity: 0
	}

	/* Enter and leave animations can use different */
	/* durations and timing functions.              */
	.slide-fade-enter-active {
	  transition: all 1s ease;
	}
	.slide-fade-leave-active {
	  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-fade-enter, .slide-fade-leave-to
	/* .slide-fade-leave-active below version 2.1.8 */ {
	  transform: translateY(-100px);
	  opacity: 0;
	}
</style>

<template>
	<div>	
		
		<ms-header v-bind:prefix="'Session' + (session.scenario ? ' on ' + session.scenario : '')"></ms-header>

		<transition name="fade">
			<ms-scenario v-show="!onSession" v-bind:on-success="start" v-bind:on-error="reset"></ms-scenario>
		</transition>
				
		<transition name="fade">
			<ms-weapon v-bind:session="session"></ms-weapon>
			<ms-shots v-show="onSession" v-bind:on-save="saveShots"></ms-shots>
		</transition>
		
			<transition-group name="slide-fade">
				<ms-review v-show="scenarioSessions" v-for="ss in scenarioSessions" v-bind:session="ss" v-bind:key="ss.date"></ms-review>
			</transition-group>

	</div>
</template>

<script src="./session.js"></script>
