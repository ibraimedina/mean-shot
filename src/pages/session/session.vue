<template>
	<div>
		<ms-header prefix="Session" v-bind:postfix="user ? user.email : ''"></ms-header>
		
		<ms-session v-bind:id="$route.params.id" v-bind:date="$route.params.date">
		</ms-session>
	</div>
</template>

<script src="./session.js"></script>