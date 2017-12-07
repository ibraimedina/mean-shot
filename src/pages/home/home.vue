<template>
	<div>	
		<ms-header></ms-header>

		<md-layout md-column-xsmall md-align="center" v-if="!user">
			<md-layout md-flex-xsmall="100" md-flex="50" md-align="center">
		  		<ms-login></ms-login>
			</md-layout>
		</md-layout>

		<md-layout md-column-xsmall md-align="center" v-else>
			<md-layout md-column md-flex-xsmall="100" md-flex="50" md-align="center">
				<md-card>
					<md-card-content>
						<div>Logged in</div>
						<div v-if="user.isAnonymous">Anonymous</div>
						<div v-else>{{user.email}}</div>
					</md-card-content>

					<md-card-actions>
						<ms-logout></ms-logout>
						<span style="flex: 1"></span>
						<router-link to="/scenarios">Scenarios</router-link>
					</md-card-actions>
				</md-card>
			</md-layout>
		</md-layout>
	</div>
</template>

<script src="./home.js"></script>