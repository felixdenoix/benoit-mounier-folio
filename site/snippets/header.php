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
<body class="font-sans antialiased grid-base min-h-screen">

  <header class="header p-4 w-full fixed bdr top-0 flex flex-col items-center justify-center bg-white shadow z-1">
    <?php
    /*
      We use `$site->url()` to create a link back to the homepage
      for the logo and `$site->title()` as a temporary logo. You
      probably want to replace this with an SVG.
    */
    ?>

    <a class="logo block" href="<?= $site->url() ?>">
      <?= $site->title()->esc() ?>
    </a>


    <nav class="w-fit bdb flex flex-row gap-x-4">
      <?php
      /*
        In the menu, we only fetch listed pages,
        i.e. the pages that have a prepended number
        in their foldername.

        We do not want to display links to unlisted
        `error`, `home`, or `sandbox` pages.

        More about page status:
        https://getkirby.com/docs/reference/panel/blueprints/page#statuses
      */
      ?>
      <?php foreach ($site->children()->listed() as $item): ?>
      <a <?php e($item->isOpen(), 'aria-current="page"') ?> href="<?= $item->url() ?>"><?= $item->title()->esc() ?></a>
      <?php endforeach ?>
      <!-- <?php snippet('social') ?>-->
    </nav>
  </header>

  <main class="main h-full" data-taxi>
    <div class="h-full" data-taxi-view>
