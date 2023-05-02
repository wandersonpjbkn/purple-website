# Purple Comunicação Website

Website build with WordPress

- [Purple Comunicação (website)](purplecomunicacao.com.br/)
- [Figma template](https://www.figma.com/file/lVxGEFWcKj7iIk8aFgXlx2/purple-website?node-id=0%3A1&t=IuHTtF6p057IxQUe-1)

## What's new

[Go to CHANGELOG](CHANGELOG.md)

## Install

Run docker

```bash
docker-compose up -d
```

### Website access

Docker will build the localhost on: <http://localhost:8081/>

### Dependencies

Install dependencies with [yarn](https://yarnpkg.com/)

```bash
yarn
```

### Theme builder

Run Gulp for build the theme into `./www/wp-content/themes/{theme_name}`

> Current `theme_name` is `purple_wp`

```bash
yarn build
```

Watch build changes

```bash
yarn watch
```

## Fix folder permissions

- Change `fix_permissions.sh` permission to allow file to run as a program;
- From a terminal, run:

```bash
./fix_permissions.sh
```

## Requirements

- [Yarn](https://yarnpkg.com/)
- [Gulp](https://gulpjs.com/)
- [Docker (WordPress + MySQL)](https://hub.docker.com/_/wordpress)
