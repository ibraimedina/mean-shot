build:
	watchify -t vueify -t browserify-css -e src/main.js -o public/dist/build.js

all: build
