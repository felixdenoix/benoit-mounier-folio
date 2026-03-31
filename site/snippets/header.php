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
  <?php endif ?>

  <!-- Open Graph Basic Tags -->
  <meta property="og:url" content="<?= $page->url() ?>">
  <meta property="og:type" content="website">
  <?php if (isset($seo)): ?>
  <meta property="og:title" content="<?= $seo->title()->esc() ?> | <?= $site->title()->esc() ?>">
  <?php else: ?>
  <meta property="og:title" content="<?= $page->title()->esc() ?> | <?= $site->title()->esc() ?>">
  <?php endif ?>

  <!-- SEO Description -->
  <?php if (isset($seo) && $seo->description()->isNotEmpty()): ?>
  <meta name="description" content="<?= $seo->description()->html() ?>">
  <meta property="og:description" content="<?= $seo->description()->html() ?>">
  <?php endif ?>

  <!-- SEO Image (Open Graph) -->
  <?php if (isset($seo) && $seo->image()): ?>
  <meta property="og:image" content="<?= $seo->image()->url() ?>">
  <?php endif ?>

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
    '@auto'
  ]) ?>

  <?php
  /*
    The `url()` helper is a great way to create reliable
    absolute URLs in Kirby that always start with the
    base URL of your site.
  */
  ?>
  <link rel="shortcut icon" type="image/x-icon" href="<?= url('favicon.ico') ?>">
  <?= vite()->css("styles/index.css", try: true) ?>
   <?= vite()->css("styles/templates/" . $page->template() . ".css", try: true) ?>
</head>
<body class="font-sans antialiased box-border">

  <c-header
    <?= isset($hide_header) ? 'hide="true"': false?>
    class="w-full h-auto"
    string-copy-from="footer">
    <header
      data-dom="header"
      class="header p-4 w-screen fixed z-(--z-header) top-0 bg-white shadow">
        <div class="c-animated-grid w-full project-title" data-dom="grid">
          <div id="header-menu-project-title" class="bg-red-500 h-full overflow-hidden" data-dom="project-title">
          </div>

          <div id="header-menu-nav" class="nav flex justify-center col-start-3 col-span-1" data-dom="project-menu">
            <?php snippet("navigation") ?>
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
      data-title="<?= isset($seo) ? $site->title()->esc() . ' | ' . $seo->title()->esc() : $site->title()->esc() . ' | ' . $page->title()->esc() ?>"
      data-description="<?= (isset($seo) && $seo->description()->isNotEmpty()) ? $seo->description()->html() : '' ?>"
      data-image="<?= (isset($seo) && $seo->image()) ? $seo->image()->url() : '' ?>">
