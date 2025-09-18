---
title: Helper Generate Code
description: Helper Generate Code
---

# Helper Generate Code

ini adalah helper custom yang saya buat untuk mengenerate kode secara otomatis. tentu dengan helper ini kita bisa memanggilnya tanpa import file yang terlalu banyak.

## Cata Install

1. Buat file `Helper.php` pada path `app/Helpers.php`
2. Tambahkan file helpers pada file composer.json

```json
    "autoload-dev": {
        "psr-4": {
            "Tests\\": "tests/"
        },
        "files": [
            "app/Helpers.php"
        ]
    },
```

3. Buka terminal dan run `composer dump-autoload`

## Cara penggunaan

1. funsgi pada helper bisa langsung dipanggil dari controller
2. secara default bentuk code akan seperti ` 20230901``xxxx `
3. struktur kode yang diberikan `current_date` `random_string` yang di uppercase
4. bisa menggunakan prefix awalan

## Contoh Penggunaan

Dengan prefix tambahan

```php
$code = generateRandomCode("DO");
// return `DO20230901MJSA`
```

Dengan prefix tambahan dan panjang karakter

```php
$code = generateRandomCode("DO", 8);
// return `DO20230901MJSA1MJSA`
```

Tanpa Prefix

```php
$code = generateRandomCode();
// return `20230901MJSA`
```

---

## Code

```php
<?php

use Illuminate\Support\Str;

if (!function_exists('generateRandomCode')) {
    /**
     * Generates a random code by combining the current date and a random string.
     *
     * @return string The generated random code.
     */
    function generateRandomCode($prefix = null, $length = 4): string
    {
        // Get the current date in the format 'Ymd'
        $currentDate = date('Ymd');

        // Generate a random string of length 4
        $randomString = strtoupper(Str::random($length));

        // Combine the current date and the random string
        $randomCode = $currentDate . $randomString;
        if (!is_null($prefix)) {
            $randomCode = $prefix . $randomCode;
        }
        return $randomCode;
    }
}
```
