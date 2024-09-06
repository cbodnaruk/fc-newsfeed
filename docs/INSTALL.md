# Installing the application

This gives the essential information to install and run Megagame Dashboard.

## Pre-requisites

You will need to already have:

* A [web server](#web-server) that can serve user requests.

* [NodeJS](https://nodejs.org/) version 20 or later.

* [NPM package manager](
      https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  version 9 or later.

* Permission to install and run a [NodeJS](https://nodejs.org/)
  [web application](#web-application), along with its package dependencies.

* A running [database server](#database).


## Web server

* Configure your web server to serve requests at the domain you choose.

* Pick a top-level path (maybe "/") to route to the Megagame Dashboard web
  app. Direct that path to run the NodeJS [web
  application](#web-application) described below.


## Database

The only supported database system currently, is
[PostgreSQL](https://www.postgresql.org/).

### Create a user to own the database

```shell
$ sudo -u postgres createuser --pwprompt megagame
Enter password for new role:
Enter it again:
```

Test the user can use the database server:

```shell
$ psql --host localhost --username megagame postgres \
    --command 'SELECT current_user'
Password for user megagame:
 current_user
--------------
 megagame
(1 row)
```

### Create the dashboard database

```shell
sudo -u postgres createdb --owner megagame megagame_dashboard_demo
```

Test the user can connect to the database:

```shell
$ psql --host localhost --username megagame megagame_dashboard_demo \
    --command 'SELECT current_database()'
Password for user mmg:
    current_database
-------------------------
 megagame_dashboard_demo
(1 row)
```

### Create the database schema

```shell
$ psql --host localhost --username megagame megagame_dashboard_demo \
    < database/migrations/*.forward.pgsql.sql
CREATE TABLE
COMMENT
CREATE TABLE
COMMENT
CREATE TABLE
COMMENT
CREATE TABLE
COMMENT
```

### Populate the database with a ‘demo’ dashboard

```shell
$ psql --host localhost --username megagame megagame_dashboard_demo \
    < database/test-data/demo.populate.pgsql.sql
INSERT 0 2
INSERT 0 5
INSERT 0 6
INSERT 0 13
```

With this data populated into the database, the web app will now be able to
display an existing ‘demo’ dashboard.


## Web application

### Unpack application files

Get the source code of this project. Install it in a directory that can run
applications for the [web server](#web-server).

```shell
$ pwd
/srv/megagame-dashboard

$ ls -1
config
config.js
database
docs
LICENSES
module_routes
new_dash.js
node_modules
package.json
package-lock.json
prefs.json
public
README.md
routes
server.js
views
```

### Install dependency packages

```shell
$ pwd
/srv/megagame-dashboard

$ npm install
[…]
installed 137 packages in 832ms
[…]
```

### Configuration file

The application configuration can be set in a file in the 'config/'
directory. The file is named 'config/*NODE_ENV*.toml', where *NODE_ENV* is
the deployment environment as declared to NodeJS.

By default, NodeJS will assume a deployment environment named
'development'.

You should create a separate configuration file for each deployment
environment you use (e.g. 'development.toml', 'test.toml',
'production.toml', etc.) with accordingly different values for the options.

#### Create configuration file for development environment

```shell
$ cp config/development.toml.EXAMPLE config/development.toml

$ sensible-editor config/development.toml
```

Remove the comment block declaring an `# EXAMPLE FILE`, because you have
now made a copy for use.

Modify the `url` option (in the `database` section) to have the correct
username, passphrase, and database name.

```toml
# config/development.toml
# Application configuration for Development environment.

[database]

url = "postgres://megagame:s3cr1t@localhost:5432/megagame_dashboard_demo"
```

The `database.url` defined above, specifies how to establish the database
connection when the application runs.

### Run the web application

```shell
$ npm start

> megagame-dashboard@1.0.0 start
> node server.js

megagame_dashboard_demo
Port 8080 Open
```



[comment]: <> (This document is formatted as Markdown.)
[comment]: <> (You can follow https://www.markdownguide.org/ for syntax.)
[comment]: <> (This can be read as plain text or rendered to other formats.)

[comment]: <> (Local variables:)
[comment]: <> (coding: utf-8)
[comment]: <> (mode: text)
[comment]: <> (mode: markdown)
[comment]: <> (End:)
[comment]: <> (vim: fileencoding=utf-8 filetype=markdown )
