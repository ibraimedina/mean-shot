<style scoped>
	.md-card {
		width: 100%;
	}
</style>

<template>
	<md-card>
		<md-card-header>Login</md-card-header>

		<form v-on:submit="send" action="javascript:void(0);">
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
				<md-button type="submit" class="md-primary md-raised">Enter</md-button>
			</md-card-actions>
		</form>

	</md-card>
</template>

<script src="./login.js"></script>