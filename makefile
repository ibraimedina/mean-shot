all: build-watch

build:
	NODE_PATH=./src/ browserify -t vueify -t browserify-css -e src/main.js -o public/dist/build.js

build-watch:
	NODE_PATH=./src/ watchify -t vueify -t browserify-css -e src/main.js -o public/dist/build.js
