<template>
	<md-card>
		<md-card-header>
			<span>Shots in this session for user {{user}}</span>
		</md-card-header>

		<md-card-content>

			<md-input-container v-for="s in shots">
				<md-input disabled v-for="c in criterias" v-model="s[c]"></md-input>
			</md-input-container>

			<form v-on:submit="save" action="javascript:void(0);">
				<md-layout md-gutter>
					<md-layout v-for="(config, name) in criterias">
						<md-input-container>
							<label>{{name}}{{config.unit ? ` (${config.unit})` : ``}}</label>
							<md-input type="number" min="0" v-bind:step="config.step" v-model.number="shot[name]"></md-input>
						</md-input-container>
					</md-layout>

					<md-button type="submit" class="md-icon-button md-accent">
						<md-icon>add_box</md-icon>
					</md-button>
				</md-layout>
			</form>

		</md-card-content>
	</md-card>
</template>

<script src="./shots.js"></script>
