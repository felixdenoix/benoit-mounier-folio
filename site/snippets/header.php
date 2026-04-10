<?php
/*
  Snippets are a great way to store code snippets for reuse
  or to keep your templates clean.

  This header snippet is reused in all templates.
  It fetches information from the `site.txt` content file
  and contains the site navigation.

  More about snippets:
  https://getkirby.com/docs/guide/templates/snippets
*/
?>
<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">

  <?php
/*
    In the title tag we show the title of our
    site and the title of the current page
  */
?>
  <?php if (isset($seo)): ?>
  <title><?= $site->title()->esc() ?> | <?= $seo->title()->esc() ?></title>
  <?php else: ?>
  <title><?= $site->title()->esc() ?> | <?= $page->title()->esc() ?></title>
  <?php endif; ?>

  <!-- Open Graph Basic Tags -->
  <meta property="og:url" content="<?= $page->url() ?>">
  <meta property="og:type" content="website">
  <?php if (isset($seo)): ?>
  <meta property="og:title" content="<?= $seo->title()->esc() ?> | <?= $site->title()->esc() ?>">
  <?php else: ?>
  <meta property="og:title" content="<?= $page->title()->esc() ?> | <?= $site->title()->esc() ?>">
  <?php endif; ?>

  <!-- SEO Description -->
  <?php if (isset($seo) && $seo->description()->isNotEmpty()): ?>
  <meta name="description" content="<?= $seo->description()->html() ?>">
  <meta property="og:description" content="<?= $seo->description()->html() ?>">
  <?php endif; ?>

  <!-- SEO Image (Open Graph) -->
  <?php if (isset($seo) && $seo->image()): ?>
  <meta property="og:image" content="<?= $seo->image()->url() ?>">
  <?php endif; ?>

  <?php
/*
    Stylesheets can be included using the `css()` helper.
    Kirby also provides the `js()` helper to include script file.
    More Kirby helpers: https://getkirby.com/docs/reference/templates/helpers
  */
?>
  <?= css([
      // 'assets/css/prism.css',
      // 'assets/css/lightbox.css',
      // 'assets/css/index.css',
      "@auto",
  ]) ?>

  <?php
/*
    The `url()` helper is a great way to create reliable
    absolute URLs in Kirby that always start with the
    base URL of your site.
  */
?>
  <link rel="shortcut icon" type="image/x-icon" href="<?= url("favicon.ico") ?>">
  <?= vite()->css("styles/index.css", try: true) ?>
   <?= vite()->css("styles/templates/" . $page->template() . ".css", try: true) ?>
</head>
<body class="font-sans antialiased box-border">

  <c-header
    <?= isset($hide_header) ? 'hide="true"' : false ?>
    class="w-full h-auto block"
    string-copy-from="footer">
    <!-- TODO: handle header height as its currently too big -->
    <header
      data-dom="header"
      class="header py-(--spacing-grid-padding) w-full fixed z-(--z-header) top-0 bg-white shadow-md">
        <div
          class="c-animated-grid leading-none w-full max-w-(--grid-max-width) px-(--spacing-grid-padding) mx-auto group gap-y-2 md:gap-y-0 md:h-(--text-lg) lg:h-(--text-xl) md:px-[var(--spacing-grid-padding)]"
          data-dom="grid"
        >
          <div
            id="header-menu-project-title"
            class="md:h-full overflow-hidden grid place-items-center w-full max-md:row-span-1 max-md:col-span-1 md:grid-cols-1"
            string-copy-id="project-heading">
              <span
                data-dom="project-title"
                class="text-cap text-xl md:text-lg lg:text-xl leading-none font-extrabold block whitespace-nowrap w-fit text-center opacity-0 transition duration-200 delay-0 group-[.project-title]:duration-500 group-[.project-title]:opacity-100 group-[.project-title]:delay-500"
              ></span>
          </div>

          <div
            id="header-menu-nav"
            class="nav text-md! text-cap flex justify-center max-md:row-span-1 max-md:row-start-2 md:col-start-3 md:col-span-1" data-dom="project-menu">
              <?php snippet("navigation", ["classes" => "w-auto gap-3 md:width-col-4 lg:width-col-3"]); ?>
          </div>
        </div>
    </header>
  </c-header>

  <main
    class="main h-auto min-h-screen"
    data-taxi>
    <div
      class="h-auto"
      data-taxi-view
      <?= isset($hide_header) ? "data-hide-header='true'" : false ?>
      data-title="<?= isset($seo) ? $site->title()->esc() . " | " . $seo->title()->esc() : $site->title()->esc() . " | " . $page->title()->esc() ?>"
      data-description="<?= isset($seo) && $seo->description()->isNotEmpty() ? $seo->description()->html() : "" ?>"
      data-image="<?= isset($seo) && $seo->image() ? $seo->image()->url() : "" ?>">
