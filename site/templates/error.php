<?php
/**
 * @var Kirby\Cms\App $kirby
 * @var Kirby\Cms\Site $site
 * @var Kirby\Cms\Page $page
 * @var Kirby\Cms\Pages $pages
 */
?>

<?php snippet("header", ["seo" => $page->seo()]); ?>

<div class="h-screen w-full grid place-items-center">

    <div class="block">
    <h3
        class="text-4xl">
        <span
             class="inline-block hover:font-ultra duration-500 ease-projects transition-[font-weight]">4</span><span
                string="magnetic" string-strength="0.15" string-radius="500" class="translate-x-[calc(var(--magnetic-x,0)_*_1px)] translate-y-[calc(var(--magnetic-y,0)_*_1px)] inline-block translate- hover:font-black duration-500 ease-projects transition-[font-weight]">0</span><span class="inline-block translate- hover:font-ultra duration-500 ease-projects transition-[font-weight]">4</span></h3>
    <p class="text-md leading-none w-full text-center">retour à <a class="underline underline-offset-2 not-pointer-coarse:hover:underline-offset-4 transition-[text-underline-offset] ease-projects" href="/">l'accueil</a></p>
    <!--TODO: handle other error than 404-->
    </div>

</div>


<?php snippet("footer", ["seo" => $page->seo()]); ?>
