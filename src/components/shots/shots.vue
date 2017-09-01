<template>
	<md-card>
		<md-card-header>
			<span>Register shots</span>
		</md-card-header>

		<md-card-content>
			<md-input-container v-for="shot in shots">
				<md-input disabled v-model="shot.value"></md-input>
			</md-input-container>
			<md-input-container>
				<label>Shot</label>
				<md-input type="number" v-model="shot.value"></md-input>
				<md-button class="md-icon-button" v-on:click="save">
					<md-icon>check_circle</md-icon>
				</md-button>
			</md-input-container>
		</md-card-content>

		<md-card-actions>
			<md-button class="md-primary" href="/session">Finish</md-button>
		</md-card-actions>
	</md-card>
</template>

<script src="./shots.js"></script>
