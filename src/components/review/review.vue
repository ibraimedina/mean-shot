<style scoped>
	/*.md-card {
		width: 100%;
	}*/

	.text {
		margin-bottom: 10px;
		text-align: center;
	}
	.text-user {
	}
	.text-title {
	}
</style>

<template>
	<md-card>

		<md-card-header>
			<router-link v-bind:to="`/scenarios/${session.scenario}/${session.date}`" v-bind:key="session.date">
				<div class="md-title">
					<span>{{date.getDate()}}/{{date.getMonth() + 1}}/{{date.getFullYear()}}</span>
				</div>
				<div class="md-subhead">
					<span>{{date.getHours()}}:{{date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()}}</span>
				</div>
			</router-link>
		</md-card-header>

		<md-card-content>
			<md-layout md-gutter md-column v-for="(data, user) in users" class="text">
				<div title="user" class="text-user">{{user}}</div>

				<ms-summary lighter="true" v-bind:data="data.criterias"></ms-summary>
			</md-layout>
		</md-card-content>

	</md-card>
</template>

<script src="./review.js"></script>