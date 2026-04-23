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
    <?php
    // -- SEO cascade: page-level → site-level → defaults
    $siteSeo = $site->seo();

    $seoTitle = $page->title()->esc();
    $seoDescription = "";
    $seoImage = null;

    if (isset($seo)) {
        $seoTitle = $seo->title()->esc();
        $seoDescription = $seo->description()->html();
        $seoImage = $seo->image();
    }

    // Site-level fallbacks
    if (empty($seoDescription) && $siteSeo->description()->isNotEmpty()) {
        $seoDescription = $siteSeo->description()->html();
    }
    if (!$seoImage && $siteSeo->image()) {
        $seoImage = $siteSeo->image();
    }

    $ogImage = $seoImage
        ? $seoImage->thumb([
            "width" => 1200,
            "height" => 630,
            "crop" => true,
        ])
        : null;
    ?>
    <title><?= $site->title()->esc() ?> | <?= $seoTitle ?></title>

    <!--FAVICON START-->
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="Benoit Mounier" />
    <link rel="manifest" href="/site.webmanifest" />
    <!--FAVICON END-->

    <?php if ($seoDescription): ?>
        <meta name="description" content="<?= $seoDescription ?>">
    <?php endif; ?>

    <!-- Open Graph -->
    <meta property="og:url" content="<?= $page->url() ?>">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="<?= $site->title()->esc() ?>">
    <meta property="og:title" content="<?= $seoTitle ?> | <?= $site->title()->esc() ?>">

    <?php if ($seoDescription): ?>
        <meta property="og:description" content="<?= $seoDescription ?>">
    <?php endif; ?>

    <?php if ($ogImage): ?>
        <meta property="og:image" content="<?= $ogImage->url() ?>">
        <meta property="og:image:width" content="<?= $ogImage->width() ?>">
        <meta property="og:image:height" content="<?= $ogImage->height() ?>">
    <?php endif; ?>

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= $seoTitle ?> | <?= $site->title()->esc() ?>">

    <?php if ($seoDescription): ?>
        <meta name="twitter:description" content="<?= $seoDescription ?>">
    <?php endif; ?>

    <?php if ($ogImage): ?>
        <meta name="twitter:image" content="<?= $ogImage->url() ?>">
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

<body class="font-sans antialiased box-border" style="overflow: hidden;">
    <?= snippet("site-loader") ?>

    <svg style="display: none">
        <filter id="noise-filter">
            <!-- Creates the fractal noise pattern -->
            <feTurbulence
                type="fractalNoise"
                baseFrequency="0.15"
                numOctaves="5"
                stitchTiles="stitch" />
            <!-- Converts noise to semi-transparent overlay -->
            <feColorMatrix
                type="matrix"
                values="0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 1 0" />
        </filter>
    </svg>

    <!--<div class="overlay fixed filter-[url(#noise-filter)] top-0 left-0 h-screen w-screen z-1000 pointer-events-none bg-red-600"></div>-->

    <c-header
        id="c-header"
        <?= isset($hide_header) ? 'hide="true"' : false ?>
        class="w-full h-auto block">
        <!-- TODO: handle header height as its currently too big -->
        <header
            data-dom="header"
            string-copy-from="footer"
            class="header py-(--spacing-grid-padding) w-full fixed z-(--z-header) top-0 bg-white">
            <div
                string="proximity[smooth]"
                string-radius="300"
                string-easing="absolute cubic-bezier(0.44,0.07,0.41,1)"
                string-lerp="0.001"
                class="absolute top-0 -z-1 shadow-md-proximity w-full h-full py-(--spacing-grid-padding)">
                <!--created dom-node for shadow as parent is already copying string from footer -->
            </div>
            <div
                class="c-animated-grid leading-none w-full max-w-(--grid-max-width) px-(--spacing-grid-padding) mx-auto group gap-y-2 md:gap-y-0 md:h-(--text-lg) lg:h-(--text-xl) md:px-[var(--spacing-grid-padding)]"
                data-dom="grid">
                <div
                    id="header-menu-project-title"
                    class="md:h-full overflow-hidden grid place-items-center w-full max-md:row-span-1 max-md:col-span-1 md:grid-cols-1"
                    string-copy-id="project-heading">
                    <span
                        data-dom="project-title"
                        class="text-cap text-xl md:text-lg lg:text-xl leading-none font-extrabold block whitespace-nowrap w-fit text-center opacity-0 transition duration-200 delay-0 group-[.project-title]:duration-500 group-[.project-title]:opacity-100 group-[.project-title]:delay-500 cursor-default"></span>
                </div>

                <div
                    id="header-menu-nav"
                    class="nav text-md! text-cap flex justify-center max-md:row-span-1 max-md:row-start-2 md:col-start-3 md:col-span-1" data-dom="project-menu">
                    <?php snippet("navigation", ["classes" => "w-auto gap-4 md:width-col-4 lg:width-col-3"]); ?>
                </div>
            </div>
        </header>
    </c-header>

    <main
        class="main h-auto min-h-screen"
        data-taxi>
        <div
            class="h-auto"
            data-taxi-view="<?= $renderer ?? "default" ?>"
            <?= isset($hide_header) ? "data-hide-header='true'" : false ?>
            data-title="<?= isset($seo) ? $site->title()->esc() . " | " . $seo->title()->esc() : $site->title()->esc() . " | " . $page->title()->esc() ?>"
            data-description="<?= isset($seo) && $seo->description()->isNotEmpty() ? $seo->description()->html() : "" ?>"
            data-image="<?= isset($seo) && $seo->image() ? $seo->image()->url() : "" ?>">
