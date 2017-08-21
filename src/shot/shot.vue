<template>
	<md-card>

		<md-card-header>Register series</md-card-header>

		<md-card-content>

			<md-input-container>
				<label>Serie</label>
				<md-input placeholder="Serie name"></md-input>
				<md-input placeholder="Date"></md-input>
			</md-input-container>

			<md-input-container>
				<label>Ambient</label>
				<md-input placeholder="Distance (m)" type="number"></md-input>
				<md-input placeholder="(In|Out)door"></md-input>
			</md-input-container>

			<md-input-container>
				<label>Weapon</label>
				<md-input placeholder="Caliber (mm)"></md-input>
				<md-input placeholder="Maker"></md-input>
				<md-input placeholder="Model"></md-input>
				<md-input placeholder="Mag. charge (g or %)"></md-input>
			</md-input-container>

			<md-input-container>
				<label>Ammunition</label>
				<md-input placeholder="Caliber (mm)"></md-input>
				<md-input placeholder="Weight (g)"></md-input>
				<md-input placeholder="Maker"></md-input>
				<md-input placeholder="Material"></md-input>
			</md-input-container>

			<md-input-container>
				<label>Target</label>
				<md-input placeholder="Size (cm)"></md-input>
				<md-input placeholder="Material"></md-input>
			</md-input-container>

		</md-card-content>

		<md-card-actions>
			<md-button>Clear</md-button>
			<md-button class="md-primary md-raised">Save</md-button>
		</md-card-actions>

	</md-card>
</template>

<script src="./shot.js"></script>