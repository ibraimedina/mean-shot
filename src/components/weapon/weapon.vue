<style scoped>
	.md-card {
		width: 100%;
	}
</style>

<template>
	<md-card>

		<md-card-header>
			<span>Weapon preset</span>
		</md-card-header>

		<md-card-content>
			<md-input-container>
				<label for="initial-charge">Charge</label>

				<md-input id="initial-charge" placeholder="g or %(0-1.00)" type="number" min="0" step="0.1" v-model.number="session.weapon.initialCharge"></md-input>

				<md-select id="charge-type" placeholder="type" type="text" v-model="session.weapon.chargeType">
					<md-option value="gas">Gas</md-option>
					<md-option value="electricity">Electricity</md-option>
				</md-select>
			</md-input-container>
		</md-card-content>

	</md-card>
</template>

<script src="./weapon.js"></script>
