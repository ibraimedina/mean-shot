<template>
	<md-card>

		<md-card-header>
			<span>Scenario</span>
		</md-card-header>

		<form v-on:submit="save" action="javascript:void(0);">

			<md-card-content>

				<md-input-container>
					<label>Name</label>
					<md-input v-model="scenario.id"></md-input>
				</md-input-container>

				<md-input-container>
					<label>Terrain</label>
					<md-input placeholder="Distance (m)" type="number" min="0" v-model.number="scenario.distance"></md-input>
					<md-select placeholder="Environment" v-model="scenario.environment">
						<md-option value="indoor">Indoor</md-option>
						<md-option value="outdoor">Outdoor</md-option>
					</md-select>
				</md-input-container>

				<md-input-container>
					<label>Weapon</label>
					<md-input placeholder="Caliber (mm)" type="number" min="0" v-model.number="scenario.weapon.caliber"></md-input>
					<md-input placeholder="Maker" v-model="scenario.weapon.maker"></md-input>
					<md-input placeholder="Model" v-model="scenario.weapon.model"></md-input>
				</md-input-container>
				
				<md-input-container>
					<label>Ammunition</label>
					<md-select placeholder="Material" v-model="scenario.ammunition.material">
						<md-option value="plastic">Plastic</md-option>
						<md-option value="aluminium">Aluminium</md-option>
						<md-option value="steel">Steel</md-option>
					</md-select>
				</md-input-container>

				<md-input-container>
					<label>Ammunition</label>
					<md-input placeholder="Caliber (mm)" type="number" min="0" v-model.number="scenario.ammunition.caliber"></md-input>
					<md-input placeholder="Weight (g)" type="number" min="0" step="0.01" v-model.number="scenario.ammunition.weight"></md-input>
					<md-input placeholder="Maker" v-model="scenario.ammunition.maker"></md-input>
					<label for="ammunition-material">Ammunition</label>
				</md-input-container>
			
				<md-input-container>
					<label>Target</label>
					<md-input placeholder="Size (cm)" type="number" min="0" step="0.1" v-model.number="scenario.target.size"></md-input>
					<md-input placeholder="Material" v-model="scenario.target.material"></md-input>
				</md-input-container>

			</md-card-content>

			<md-card-actions>
				<md-button v-on:click="clear">Clear</md-button>
				<md-button type="submit" class="md-primary md-raised">Start</md-button>
			</md-card-actions>
		
		</form>

	</md-card>
</template>

<script src="./scenario.js"></script>