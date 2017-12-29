<template>
	<md-layout md-column>
		<md-card>
			<md-card-header>
				<md-card-header-text>
					<div class="md-title">
						<span>{{session.date.getDate()}}/{{session.date.getMonth() + 1}}/{{session.date.getFullYear()}}</span>
					</div>

					<div class="md-subhead">
						<span>{{session.date.getHours()}}:{{session.date.getMinutes() < 10 ? '0'+session.date.getMinutes() : session.date.getMinutes()}}</span>
					</div>
				</md-card-header-text>

				<router-link v-bind:to="`/scenarios/${id}`">{{id}}</router-link>
			</md-card-header>
		</md-card>

		<md-layout md-gutter md-align="center">
			<md-card v-for="(data, user) in session.userData" v-bind:key="user">
				<md-card-header>
					<span title="user">{{user}}</span>
				</md-card-header>
				
				<md-card-content>
					<ms-summary lighter="true" v-bind:data="data.criterias"></ms-summary>
					
					<div v-for="shot in data.shots">
						<ms-shot v-bind:shot="shot" v-bind:criterias="scenario.criterias"></ms-shot>
					</div>
				</md-card-content>
			</md-card>
		</md-layout>
	</md-layout>
</template>

<script src="./session.js"></script>