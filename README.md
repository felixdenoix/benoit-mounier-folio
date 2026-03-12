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
- [ ] 



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
