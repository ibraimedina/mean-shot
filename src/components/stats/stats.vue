<style scoped>
	.text {
		margin-bottom: 10px;
		text-align: center;
	}
	.text-user {
	}
	.text-title {
	}
	.text-value {
    font-size: large;
    font-weight: lighter;
	}
	.text-secondary {
		font-size: smaller;
	}
</style>

<template>
	<md-card class="md-accent">
		<md-card-header>
			<div class="md-title">
				Scenario info
			</div>
		</md-card-header>

		<md-card-content>
			
			<md-layout md-column md-gutter class="text">
				<md-layout>
					<md-layout md-column title="mean">
						<span class="text-value">{{mean}}</span>
						<span class="text-secondary">mean</span>
					</md-layout>

					<md-layout md-column title="mean to bullseye">
						<span class="text-value">{{toBullseyeMean}}cm</span>
						<span class="text-secondary">mean to bullseye</span>
					</md-layout>

					<md-layout md-column title="shots per user each session">
						<span class="text-value">{{userShotsMean}}</span>
						<span class="text-secondary">shots per user</span>
					</md-layout>
				</md-layout>
			</md-layout>

			<md-layout md-gutter md-column class="text">
				<div>Best at {{best.date.getDate()}}/{{best.date.getMonth() + 1}}/{{best.date.getFullYear()}}</div>
				<div title="user" class="text-user">{{best.user}}</div>
				<md-layout>
					<md-layout md-column title="mean">
						<span class="text-value">{{best.mean}}</span>
						<span class="text-secondary">scored {{best.sum}} from {{best.quantity}} shots</span>
					</md-layout>
					<md-layout md-column title="mean to bullseye">
						<span class="text-value">{{best.toBullseyeMean}}cm</span>
						<span class="text-secondary">{{best.toBullseyeMin}}cm - {{best.toBullseyeMax}}cm</span>
					</md-layout>
				</md-layout>
			</md-layout>

		</md-card-content>
	</md-card>
</template>

<script src="./stats.js"></script>