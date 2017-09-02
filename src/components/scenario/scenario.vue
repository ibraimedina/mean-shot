<template>
	<md-card>

		<md-card-header>Scenario</md-card-header>

		<md-card-content>

			<md-input-container>
				<label>Name</label>
				<md-input v-model="scenario.id"></md-input>
			</md-input-container>

			<md-input-container>
				<label>Terrain</label>
				<md-input placeholder="Distance (m)" type="number" v-model="scenario.distance"></md-input>
				<md-input placeholder="Environment" v-model="scenario.environment"></md-input>
			</md-input-container>

			<md-input-container>
				<label>Weapon</label>
				<md-input placeholder="Caliber (mm)" type="number" v-model="scenario.weapon.caliber"></md-input>
				<md-input placeholder="Maker" v-model="scenario.weapon.maker"></md-input>
				<md-input placeholder="Model" v-model="scenario.weapon.model"></md-input>
			</md-input-container>

			<md-input-container>
				<label>Ammunition</label>
				<md-input placeholder="Caliber (mm)" type="number" v-model="scenario.ammunition.caliber"></md-input>
				<md-input placeholder="Weight (g)" type="number" v-model="scenario.ammunition.weight"></md-input>
				<md-input placeholder="Maker" v-model="scenario.ammunition.maker"></md-input>
				<md-input placeholder="Material" v-model="scenario.ammunition.material"></md-input>
			</md-input-container>

			<md-input-container>
				<label>Target</label>
				<md-input placeholder="Size (cm)" type="number" v-model="scenario.target.size"></md-input>
				<md-input placeholder="Material" v-model="scenario.target.material"></md-input>
			</md-input-container>

		</md-card-content>

		<md-card-actions>
			<md-button>Clear</md-button>
			<md-button class="md-primary md-raised" v-on:click="save">Start</md-button>
		</md-card-actions>

	</md-card>
</template>

<script src="./scenario.js"></script>