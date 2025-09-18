---
title: Deploy Laravel
description: Panduan deploy Laravel di server VPS Linux.
---

# Deploy Laravel

Panduan deploy Laravel di server VPS Linux.

## Update via Git

### Back End

- down app

```
sudo php artisan down
```

- git pull

```
sudo git pull
```

- run composer install

```
sudo composer install --optimize-autoloader --no-dev
```

- run artisan migrate when needed

```
sudo php artisan migrate
```

### Front End

#### Yarn

- yarn

```
sudo yarn
```

- yarn build

```
sudo yarn build
```

#### PNPM

- pnpm

```
sudo pnpm i
```

- pnpm build

```
sudo pnpm build
```

- remove node_modules (optional)

```
sudo rm -rf node_modules
```

### Optimize

- run

```
sudo php artisan optimize
```

- up app

```
sudo php artisan up
```

ini optional sesuai kebutuhan.

## Supervisor

ini digunakan jika menggunakan fitur job dan queue

- Status

```
sudo supervisorctl status
```

- Restart All

```
sudo supervisorctl restart all
```
