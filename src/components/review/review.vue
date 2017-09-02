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
			<md-layout md-gutter>
				<md-layout>Mean: {{mean}}</md-layout>
				<md-layout>Mean to bullseye: {{toBullseyeMean}}cm ({{toBullseyeMin}}cm - {{toBullseyeMax}}cm)</md-layout>
			</md-layout>
		</md-card-content>

	</md-card>
</template>

<script src="./review.js"></script>