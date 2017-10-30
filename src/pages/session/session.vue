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
	  transform: translateY(-50px);
	  opacity: 0;
	}
</style>

<template>
	<div>	
		
		<ms-header v-bind:prefix="'Session' + (session.scenario ? ' on ' + session.scenario : '')"></ms-header>

		<transition name="fade">
			<ms-scenario v-show="!onSession" v-bind:on-success="start" v-bind:on-error="reset"></ms-scenario>
		</transition>
				
		<md-layout md-gutter v-show="onSession">

			<md-layout md-column v-bind:key="left">
				<ms-weapon v-bind:session="session"></ms-weapon>
				<ms-guests v-bind:guests="sessionUsers"></ms-guests>
				<ms-shots v-for="user in sessionUsers" v-bind:user="user" v-bind:key="user" v-bind:on-save="saveShots"></ms-shots>
			</md-layout>

			<md-layout md-column v-bind:key="right">
				<ms-stats v-bind:sessions="scenarioSessions"></ms-stats>
				<transition-group name="slide-fade">
					<ms-review v-for="ss in scenarioSessions" v-bind:session="ss" v-bind:key="ss.date"></ms-review>
				</transition-group>
			</md-layout>
			
		</md-layout>
		

	</div>
</template>

<script src="./session.js"></script>
