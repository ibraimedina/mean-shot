<template>
	<md-card>
		<md-card-header>Login</md-card-header>

		<md-card-content>

			<md-input-container>
				<label>User email</label>
				<md-input v-model="username"></md-input>
			</md-input-container>

			<md-input-container>
				<label>Password</label>
				<md-input type="password" v-model="password"></md-input>
			</md-input-container>
		
		</md-card-content>

		<md-card-actions>
			<md-button class="md-primary md-raised" v-on:click="send()">Enter</md-button>
		</md-card-actions>

	</md-card>
</template>

<script src="./login.js"></script>