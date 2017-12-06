<template>
	<md-layout md-column md-gutter v-if="scenarios">
		<md-card>
			<md-card-header>
				<span>Select a scenario</span>
			</md-card-header>

			<md-card-content>
				<md-list>
					<md-list-item v-for="sc in scenarios">
						<span>{{sc.id}}</span>
						
						<md-button title="start" v-on:click="start(sc)" class="md-icon-button md-list-action">
							<md-icon class="md-primary">play_arrow</md-icon>
						</md-button>
					</md-list-item>
				</md-list>
			</md-card-content>
		</md-card>
	</md-layout>
</template> 

<script src="./scenarios.js"></script>