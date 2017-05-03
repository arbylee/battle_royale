Dependencies
------------

This application uses
[node-canvas](https://github.com/Automattic/node-canvas), which depends on
[Cairo](http://cairographics.org/)

Installing Cairo via brew:

brew install pkg-config cairo libpng jpeg giflib

To run via docker:
docker build -t battle .
docker run -p 3001:3001 -d battle
