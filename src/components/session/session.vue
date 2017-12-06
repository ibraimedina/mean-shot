<template>
	<md-layout md-column>
		<md-card>
			<md-card-header>
				<md-card-header-text>
					<div class="md-title">
						<span>{{xexom.date.getDate()}}/{{xexom.date.getMonth() + 1}}/{{xexom.date.getFullYear()}}</span>
					</div>
					<div class="md-subhead">
						<span>{{xexom.date.getHours()}}:{{xexom.date.getMinutes() < 10 ? '0'+xexom.date.getMinutes() : xexom.date.getMinutes()}}</span>
					</div>
				</md-card-header-text>

				<router-link v-bind:to="`/scenarios/${xexom.scenario}`">{{xexom.scenario}}</router-link>
			</md-card-header>
		</md-card>

		<md-layout>
			<md-card md-flex="50" v-for="(data, user) in xexom.userData">
				<md-card-content>
					<md-layout md-gutter md-column>
						<div title="user">{{user}}</div>
						<ms-summary lighter="true" v-bind:data="data"></ms-summary>
						<div v-for="shot in data.shots">
							<ms-shot v-bind:shot="shot"></ms-shot>
						</div>
					</md-layout>
				</md-card-content>
			</md-card>
		</md-layout>
	</md-layout>
</template>

<script src="./session.js"></script>