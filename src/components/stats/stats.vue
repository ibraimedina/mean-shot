<template>
	<md-card class="md-accent">
		<md-card-content>
			<md-layout md-gutter>
				
				<md-layout md-column>
					<span>Scenario mean</span>
					<span>{{mean}}</span>
				</md-layout>
				
				<md-layout md-column>
					<span>Scenario mean to bullseye</span>
					<span>{{toBullseyeMean}}cm</span>
				</md-layout>

			</md-layout>
		</md-card-content>
	</md-card>
</template>

<script src="./stats.js"></script>