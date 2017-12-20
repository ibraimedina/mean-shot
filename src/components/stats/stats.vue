<style scoped>
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
	<md-card class="md-primary">
		<md-card-header>
			<div class="md-title">
				Scenario info
			</div>
		</md-card-header>

		<md-card-content>
			<md-layout md-column md-gutter class="text">
				<md-layout>
					<md-layout md-column v-for="(m, criteria) in means" v-bind:title="criteria">
						<span class="text-value">{{m.mean}}{{m.unit}}</span>
						<span class="text-secondary">{{criteria}} mean</span>
					</md-layout>

					<md-layout md-column title="shots per user each session">
						<span class="text-value">{{userShotsMean}}</span>
						<span class="text-secondary">shots per user</span>
					</md-layout>
				</md-layout>
			</md-layout>

			<md-layout md-gutter md-column class="text" v-for="(highlights, criteria) in bests">
				<div>
					<strong>{{criteria}} record</strong>
				</div>
				
				<div title="user" class="text-user">
					{{highlights.user}}
					({{highlights.date.getDate()}}/{{highlights.date.getMonth() + 1}}/{{highlights.date.getFullYear()}})
				</div>
				
				<!-- bests: { // bests = criterias
					criteria: highlights
				} -->
				<ms-summary v-bind:data="{[criteria]: highlights}"></ms-summary>
			</md-layout>
		</md-card-content>
	</md-card>
</template>

<script src="./stats.js"></script>