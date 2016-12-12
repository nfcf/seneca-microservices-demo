SenecaJS MicroServices Demo Project
==========

Project I've decided to build for fun and as a way to learn about a new technology:
 - SenecaJS ([http://senecajs.org/](http://senecajs.org/))

The project functionality in itself is pretty basic - it's a "Running Log" application, which means 
that when a user goes for a run he can log the distance for that day. However, to keep things interesting, 
there's also user management and different user roles and permissions supported.


The current state of the project has a Microservices architecture implemented using senecaJS and Express - which I will detail below.

## Backend Architecture

There are 3 services in place. For simplicity, they're all here under the same repo. For more complex projects
I would recommend having them as separate repos:
- API
- USERS
- RUNS

The API service is the single point of contact with the frontend world. I'm using seneca-web and the nodeJS express framework
to make a few REST endpoints available. To keep things simple, the API service is also serving the SPA frontend. 
Also, due to lazyness in setting up HTTPS in Express / nodeJS, I'm using HTTP...don't do this in production!

Both the USERS and RUNS services are clients to a AMQP RabbitMQ "internal" queue, configured to listen to messages with specific patterns.
They each have their own database and I've tried to keep them short and simple.

Basically how it works is like this:
- When the user logs in (in the frontend), there's an Ajax REST call to the API service.
The API service then publishes a user login message to the internal queue which the USERS service will pick up and act upon.
If everything is fine it returns success to the API service which in turns logs in the user.
- A similar exchange of messages happens when the user wants to log a run.
The frontend calls the API service - authentication is made in this service using JWT tokens - and forwards the request to the RUNS service through the message queue.
In case user information is required to handle the request, an extra internal message is exchanged between the services to get the user object.

Object permissiosn are handled each on their respective service (USERS and RUNS). Unfortunately I couldn't get the seneca-perm module to work for some reason and I had
to do permissions check the old fashioned way... (will hopefully revisit this in the future).

## How to setup the MicroServices

```bash
npm install # installs the requirements for all services.
cp api/options.example.js api/options.app.js # and modify as needed.
cp users/options.example.js users/options.app.js # and modify as needed.
cp runs/options.example.js runs/options.app.js # and modify as needed.
```

## Setup the frontend

```bash
cd web
npm install # installs the requirements for the frontend.
gulp
```

## Install and run a RabbitMQ server (default configuration)

You'll need this to get the services talking to each other (installation depends on the OS)

## Run

Open 3 consoles on the repo base directory and run the following commands:

```bash
cd api; node app.js
```
```bash
cd users; node app.js
```
```bash
cd runs; node app.js
```

If all goes well, all 3 services start running and you can now access the frontend by opening [localhost:3333](http://localhost:3333).

For logging in, you can use:
- admin@gmail.com | admin
- manager@gmail.com | manager
- user@gmail.com | user

Or you can register a new user.

You'll notice that the other services will start listening on port 3334 and 3335 respectivaly. That's because they make a seneca-admin
UI available under [localhost:3334/admin/](http://localhost:3334/admin/)

