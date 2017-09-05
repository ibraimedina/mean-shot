<template>
	<md-card>

		<md-card-header>
			<span>Weapon preset</span>
		</md-card-header>

		<md-card-content>
			
			<md-input-container>
				<label>Charge</label>
				<md-input placeholder="g or %(0-1.00)" type="number" min="0" v-model.number="session.weapon.initialCharge"></md-input>
			</md-input-container>

		</md-card-content>

	</md-card>
</template>

<script src="./weapon.js"></script>
