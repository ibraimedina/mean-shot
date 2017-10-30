<template>
	<md-card>
		<md-card-header>
			Add user to session
		</md-card-header>
		<md-card-content>
			<md-input-container>
				<label>Guest</label>
				<md-input v-model="guest"></md-input>
			</md-input-container>
		</md-card-content>
		<md-card-actions>
			<md-button v-bind:click="add">Add</md-button>
		</md-card-actions>
	</md-card>
</template>

<script src="./guests.js"></script>
