# Folio Benoit Mounier

---

Par [Félix Denoix](https://felixdenoix.fr)


## Stack

### Env
- `php@8.3`
- `ddev@1.24` development environment (using plugin `ddev/ddev-pnpm`)

### Project
- `kirby@5` cms
- `vite@7` front end asset processing pipeline
- `tailwind@4` styles

## Development setup

Use `ddev` for local developpement.

The ddev config file has recieved the followong updates:
```yaml
# .ddev/config.yaml

# ...
# Update doc root to allow the "public" directory 
docroot: ./public
# ...
# Ensure vite can run freely
web_extra_exposed_ports:
  - name: vite
    container_port: 5173
    http_port: 5172
    https_port: 5173
# ...
```

[Public directory setup](setup to work https://getkirby.com/docs/guide/configuration/custom-folder-setup#public-and-private-folder-setup)

```bash
# start ddev instance
$> ddev start
# install composer dependencies
$> ddev composer install
# install node dependencies
$> ddev pnpm install
# create local user to access Panel
$> ddev exec kirby make:user
``` 

## Development running

All pnpm commands **must** be prefixed by `ddev`.

```bash
# to run asset pipeline
$> ddev pnpm dev

# to run Kirby/Cli commands
$> dev exec kirby
```

## Readlist

## Tasks

### Production checklist

- [ ] debug off
- [ ] font subsetting
- [ ] remove sourcemap from build

## Learnings


<details>
<summary> #### Expose ddev app locally: </summary> 

```bash
$> ddev config --host-webserver-port=6060 --bind-all-interfaces && ddev poweroff && ddev start 
```

```nginx
# nginx-site.conf
# ddev php edited for local availlability
# See https://docs.ddev.com/en/stable/users/extend/customization-extendibility/#custom-nginx-configuration

server {
    listen 80 default_server;
    listen 443 ssl default_server;

    root /var/www/html/public;

    ssl_certificate /etc/ssl/certs/master.crt;
    ssl_certificate_key /etc/ssl/certs/master.key;

    include /etc/nginx/monitoring.conf;

    index index.php index.htm index.html;

    # Disable sendfile as per https://docs.vagrantup.com/v2/synced-folders/virtualbox.html
    sendfile off;
    error_log /dev/stdout info;
    access_log /var/log/nginx/access.log;


    # ==========================================
    # GLOBAL CORS HEADERS
    # ==========================================
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS, PATCH' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;


    # ==========================================
    # 1. EXPLICIT BLOCK FOR STATIC FILES (Fixes JS/CSS/Assets)
    # ==========================================
    location ~* \.(?:css|js|mjs|jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc|woff2|woff|ttf|eot|json|map|wasm)$ {

        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS, PATCH' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;

        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS, PATCH' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        try_files $uri $uri/ /index.php?$query_string;
    }


    # ==========================================
    # 2. STANDARD ROUTING
    # ==========================================
    location / {
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS, PATCH' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        absolute_redirect off;
        try_files $uri $uri/ /index.php?$query_string;
    }

    location @rewrite {
        rewrite ^ /index.php;
    }


    # ==========================================
    # 3. PHP HANDLING (WITH PORT PRESERVATION)
    # ==========================================
    location ~ \.php$ {

        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS, PATCH' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/run/php-fpm.sock;
        fastcgi_buffers 16 16k;
        fastcgi_buffer_size 32k;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param SCRIPT_NAME $fastcgi_script_name;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_intercept_errors off;
        fastcgi_read_timeout 10m;

        # ---------------------------------------------------------
        # PORT PRESERVATION FIXES
        # ---------------------------------------------------------
        # Use $http_host instead of $host so the port (e.g. :6060) isn't stripped
        fastcgi_param SERVER_NAME $http_host;
        fastcgi_param HTTPS $fcgi_https;

        # Pass DDEV Router's X-Forwarded headers to PHP so frameworks map the port correctly
        fastcgi_param HTTP_X_FORWARDED_HOST $http_x_forwarded_host if_not_empty;
        fastcgi_param HTTP_X_FORWARDED_PORT $http_x_forwarded_port if_not_empty;
        fastcgi_param HTTP_X_FORWARDED_PROTO $http_x_forwarded_proto if_not_empty;
        # ---------------------------------------------------------

        fastcgi_pass_header "X-Accel-Buffering";
        fastcgi_pass_header "X-Accel-Charset";
        fastcgi_pass_header "X-Accel-Expires";
        fastcgi_pass_header "X-Accel-Limit-Rate";
        fastcgi_pass_header "X-Accel-Redirect";
    }

    # Prevent clients from accessing hidden files
    location ~* /\.(?!well-known\/) {
        deny all;
    }

    # Prevent clients from accessing to backup/config/source files
    location ~* (?:\.(?:bak|conf|dist|fla|in[ci]|log|psd|sh|sql|sw[op])|~)$ {
        deny all;
    }

    include /etc/nginx/common.d/*.conf;
    include /mnt/ddev_config/nginx/*.conf;
}

```

</details>

<details>
<summary> 
    
    #### Access `src` assets from template 
    
</summary>

created symlink between `public/assets` and `src/assets`
assets from src can now be called everywhere.

</details>

---
<img src="http://getkirby.com/assets/images/github/starterkit.jpg" width="300">

**Kirby: the CMS that adapts to any project, loved by developers and editors alike.**
The Starterkit is a full-blown Kirby installation with a lot of example content, blueprints, templates and more.
It is ideal for new users to explore many of Kirby's options and get to know the Panel.

You can learn more about Kirby at [getkirby.com](https://getkirby.com).

<img src="http://getkirby.com/assets/images/github/starterkit-screen.png" />

### Try Kirby for free

You can try Kirby and the Starterkit on your local machine or on a test server as long as you need to make sure it is the right tool for your next project. … and when you’re convinced, [buy your license](https://getkirby.com/buy).

The Starterkit is a demo of basic Kirby features. It's not recommended to be used "as is" in production. Please, follow our documentation closely for more features and guides on how to build secure, high-quality websites with Kirby.

While Kirby as the CMS software itself requires you to purchase a license, we consider the files primarily connected to this Starterkit (assets, templates, snippets...) free to use under the MIT license. Feel free to start building your own project with them.

### Get going

Read our guide on [how to get started with Kirby](https://getkirby.com/docs/guide/quickstart).

You can download the latest version of the Starterkit from https://download.getkirby.com/.
If you are familiar with Git, you can clone Kirby's Starterkit repository from Github.

    git clone https://github.com/getkirby/starterkit.git

## What's Kirby?

-   **[getkirby.com](https://getkirby.com)** – Get to know the CMS.
-   **[Try it](https://getkirby.com/try)** – Take a test ride with our online demo. Or download one of our kits to get started.
-   **[Documentation](https://getkirby.com/docs/guide)** – Read the official guide, reference and cookbook recipes.
-   **[Issues](https://github.com/getkirby/kirby/issues)** – Report bugs and other problems.
-   **[Feedback](https://feedback.getkirby.com)** – You have an idea for Kirby? Share it.
-   **[Forum](https://forum.getkirby.com)** – Whenever you get stuck, don't hesitate to reach out for questions and support.
-   **[Discord](https://chat.getkirby.com)** – Hang out and meet the community.
-   **[YouTube](https://youtube.com/kirbyCasts)** - Watch the latest video tutorials visually with Bastian.
-   **[Mastodon](https://mastodon.social/@getkirby)** – Spread the word.
-   **[Bluesky](https://bsky.app/profile/getkirby.com)** – Tell a friend.
---

© 2009 Bastian Allgeier
[getkirby.com](https://getkirby.com) · [License agreement](https://getkirby.com/license)
