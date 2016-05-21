# Remote shell
This is a proof of concept.

The goal is to get a remote shell on a computer (e.g. a raspberry) that has just outgoing http/https access (e.g. in an entreprise network) from the outer internet.

You need:
 - A server in the cloud (hereafter referred to as "the server")
 - A raspberry in the enterprise network
 - Your browser

Clone this git repository on both the raspberry and the server.
You need NodeJS on both of them.
Run `npm install` on both of them at the root of the repo.

Run these steps in order:

On the server

    node server.js

On the raspberry (patch raspberry.js to replace `localhost:8080` by the url & port of this service on the server)

    node raspberry.js

Point your browser to the URL of the server.

Don't use it in your entreprise network if you don't want to be fired.
