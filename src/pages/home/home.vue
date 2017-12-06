<template>
	<div>	
		<ms-header></ms-header>

		<md-layout md-column-xsmall md-align="center" v-if="!user">
			<md-layout md-flex-xsmall="100" md-flex="50" md-align="center">
		  		<ms-login></ms-login>
			</md-layout>
		</md-layout>

		<md-layout md-column-xsmall md-align="center" v-else>
			<md-layout md-flex-xsmall="100" md-flex="50" md-align="center">
				<md-card>
					<md-card-content>
						<span>Logged in: {{user.email}}</span>
					</md-card-content>
				</md-card>
			</md-layout>
		</md-layout>
	</div>
</template>

<script src="./home.js"></script>