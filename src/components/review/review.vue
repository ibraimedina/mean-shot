<style scoped>
	.md-card {
		width: 100%;
	}

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
		color: gray;
		font-size: smaller;
	}
</style>

<template>
	<md-card>

		<md-card-header>
			<div class="md-title">
				<span>{{date.getDate()}}/{{date.getMonth() + 1}}/{{date.getFullYear()}}</span>
			</div>
			<div class="md-subhead">
				<span>{{date.getHours()}}:{{date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()}}</span>
			</div>
		</md-card-header>

		<md-card-content>
			<md-layout md-gutter md-column v-for="(data, user) in users" class="text">
				<div title="user" class="text-user">{{user}}</div>
				<md-layout>
					<md-layout md-column title="mean">
						<span class="text-value">{{data.mean}}</span>
						<span class="text-secondary">scored {{data.sum}} from {{data.quantity}} shots</span>
					</md-layout>
					<md-layout md-column title="mean to bullseye">
						<span class="text-value">{{data.toBullseyeMean}}cm</span>
						<span class="text-secondary">{{data.toBullseyeMin}}cm - {{data.toBullseyeMax}}cm</span>
					</md-layout>
				</md-layout>
			</md-layout>
		</md-card-content>

	</md-card>
</template>

<script src="./review.js"></script>