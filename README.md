## Backend part from application PIX-INTER-BANK

After copy/clone the project, install all dependencies 

Just run inside the folder where your package.json is it

```bash
yarn
```

After that to see if your application is installed properly run script

```bash
yarn start:dev
```


### 1) Docker commands to build de Postgres Database

Execute this command inside docker-compose directory to build and run this project:

```bash
docker-compose up
```

To stop the docker container, execute:

```bash
docker-compose stop
```

To restart the project, execute:

```bash
docker-compose start
```

or to handle some problems to restart (Warning: Remove all info inside containers)

```bash
docker-compose up --force-recreate
```

After start or restart the services to see the logs inside docker, execute:

```bash
docker logs <container-name> -f
```

To remove the container and services related, execute:

```bash
docker-compose down
```

### 2) Migrations TypeORM

To create a new migration use:

```bash
yarn typeorm migration:create -n <migrationName>
```

To run a migration use:

```bash
yarn typeorm migration:run
```

To revert a migration use:

```bash
yarn typeorm migration:revert
```