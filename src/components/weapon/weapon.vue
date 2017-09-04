<template>
	<md-card>
		<md-card-content>
			<md-input-container>
				<label>Initial charge</label>
				<md-input v-model.number="session.weapon.initialCharge"></md-input>
			</md-input-container>
		</md-card-content>
	</md-card>
</template>

<script src="./weapon.js"></script>
