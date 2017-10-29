<template>
	<md-card>
		<md-card-header>
			<span>Shots in this session for user {{user}}</span>
		</md-card-header>

		<md-card-content>

			<md-input-container v-for="s in shots">
				<md-input disabled v-model="s.score"></md-input>
				<md-input disabled v-model="s.toBullseye"></md-input>
			</md-input-container>

			<md-layout md-gutter="true">

				<md-layout>
					<md-input-container>
						<label>Score</label>
						<md-input type="number" min="0" v-model.number="shot.score"></md-input>
					</md-input-container>
				</md-layout>

				<md-layout>
					<md-input-container>
						<label>To bullseye (.05 cm)</label>
						<md-input type="number" min="0" v-model.number="shot.toBullseye"></md-input>
					</md-input-container>
				</md-layout>

				<md-button class="md-icon-button md-accent" v-on:click="save">
					<md-icon>add_box</md-icon>
				</md-button>

			</md-layout>

		</md-card-content>
		
	</md-card>
</template>

<script src="./shots.js"></script>
