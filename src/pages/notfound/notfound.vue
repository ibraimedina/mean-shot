<style>
</style>

<template>
	<div>
		<ms-header prefix="Wrong way!"></ms-header>

		<md-layout md-align="center">
			<md-layout md-flex-xsmall="70" md-flex-small="40" md-flex-medium="30" md-flex-large="25" md-align="center">
				<md-card>
					<md-card-header>
						<div class="md-title">Wrong way!</div>
						<div class="md-subtitle">Where do you wanna shoot?</div>
					</md-card-header>

					<md-card-actions>
						<router-link to="/scenarios">
							<md-button>Scenarios</md-button>
						</router-link>
					</md-card-actions>

					<md-card-media>
						<md-image md-src="/img/badposition.jpg" alt="Wrong way!"></md-image>
					</md-card-media>
				</md-card>
			</md-layout>
		</md-layout>
	</div>
</template>