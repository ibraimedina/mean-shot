<style scoped>
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
		<ms-header v-bind:prefix="'Scenario' + (session.scenario ? ': ' + session.scenario : '')" v-bind:postfix="user ? user.email : ''"></ms-header>

		<transition-group name="fade">
			<md-layout md-column-xsmall md-align="center" v-if="!onSession && !session.date" key="new">
				<md-layout md-flex-xsmall="100" md-flex="75" md-align="center">
					<ms-scenarios v-bind:scenarios="scenarios" v-bind:start="start"></ms-scenarios>
					<ms-scenario v-bind:on-success="start" v-bind:on-error="reset"></ms-scenario>
				</md-layout>
			</md-layout>

			<md-layout md-column-xsmall md-align="center" v-if="!onSession && session.date" key="review">
				<md-layout md-flex-xsmall="100" md-flex="75" md-align="center">
					<ms-session v-bind:session="session"></ms-session>
				</md-layout>
			</md-layout>
		</transition-group>
				
		<md-layout md-gutter md-column-xsmall md-vertical-align="start" v-if="onSession">
			<md-layout md-column>
				<md-layout md-column-xsmall md-column-small>
					<md-layout md-flex="50"><ms-weapon v-bind:session="session"></ms-weapon></md-layout>
					<md-layout md-flex="50"><ms-guests v-bind:guests="sessionUsers"></ms-guests></md-layout>
				</md-layout>

				<ms-shots v-for="user in sessionUsers" v-bind:user="user" v-bind:key="user" v-bind:on-save="saveShots"></ms-shots>
			</md-layout>

			<md-layout md-column>
				<ms-stats v-bind:sessions="scenarioSessions"></ms-stats>
				
				<transition-group name="slide-fade">
					<ms-review v-for="ss in scenarioSessions" v-bind:session="ss" v-bind:key="ss.date"></ms-review>
				</transition-group>
			</md-layout>
		</md-layout>
	</div>
</template>

<script src="./scenarios.js"></script>
