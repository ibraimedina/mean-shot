<template>
	<md-card class="md-accent">
		<md-card-header>
			<div class="md-title">
				Scenario info
			</div>
		</md-card-header>

		<md-card-content>
			
			<md-layout md-gutter>
				<md-layout md-column title="mean">
					<span>Mean</span>
					<span>{{mean}}</span>
				</md-layout>
				
				<md-layout md-column title="mean to bullseye">
					<span>Mean to bullseye</span>
					<span>{{toBullseyeMean}}cm</span>
				</md-layout>
			</md-layout>

			<md-layout md-gutter md-column>
				<span>Best: {{best.user}} at {{best.date.getDate()}}/{{best.date.getMonth() + 1}}/{{best.date.getFullYear()}}</span>
				<span>Mean: {{best.mean}}, scored {{best.sum}} from {{best.quantity}} shots</span>
				<span>ToBullseyeMean: {{best.toBullseyeMean}}cm</span>
			</md-layout>

		</md-card-content>
	</md-card>
</template>

<script src="./stats.js"></script>