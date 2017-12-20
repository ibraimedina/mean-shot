<style scoped>
	.md-card {
		width: 100%;
	}
</style>

<template>
	<md-card>
		
		<md-card-header>
			<span>Add user to session</span>
		</md-card-header>
		
		<form v-on:submit="add" action="javascript:void(0);">
			<md-card-content>
				<md-input-container>
					<label>Guest</label>
					<md-input v-model="guest"></md-input>
				</md-input-container>
			</md-card-content>
			
			<md-card-actions>
				<md-button type="submit" class="md-accent">Add</md-button>
			</md-card-actions>
		</form>

	</md-card>
</template>

<script src="./guests.js"></script>
