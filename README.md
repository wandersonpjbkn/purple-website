# Purple Comunicação Website

## Install

Run docker

```bash
docker-compose up -d
```

Install dependencies

```bash
yarn
```

Run Gulp for build theme

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
