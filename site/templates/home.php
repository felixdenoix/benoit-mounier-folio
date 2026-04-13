<?php
/*
  Templates render the content of your pages.

  They contain the markup together with some control structures
  like loops or if-statements. The `$page` variable always
  refers to the currently active page.

  To fetch the content from each field we call the field name as a
  method on the `$page` object, e.g. `$page->title()`.

  This home template renders content from others pages, the children of
  the `photography` page to display a nice gallery grid.

  Snippets like the header and footer contain markup used in
  multiple templates. They also help to keep templates clean.

  More about templates: https://getkirby.com/docs/guide/templates/basics
*/
?>
<?php snippet("header", ["seo" => $page->seo(), "hide_header" => true, "renderer" => "home"]); ?>

<c-homepage log>

  <div class="intro relative">
    <?php snippet("home/intro", ["introItems" => $introItems]); ?>
  </div>

  <div
    data-dom="hiatus"
    class="z-1 hiatus pt-[50svh] pb-[25vh] grid place-items-center min-h-screen p-grid-padding bg-black relative">
    <c-text-reveal
      class="w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 max-w-200 text-xl text-white leading-none h-[calc(10*var(--paragraph-height))]"
      style="--paragraph-height:auto;"
      string="progress"
      string-key="--text-reveal-progress"
      string-enter-el="top"
      string-enter-vp="bottom"
      string-offset-bottom="-60%"
      string-exit-el="bottom"
      string-exit-vp="bottom"
      string-easing="cubic-bezier(.19,.6,.4,1)"
    >
      <!--
        ajusting scroll height and offset
          -50% - 1/2*(100%/paragraph-repeat-count)
      -->
      <p
        class="sticky *:inline-block top-[calc(50vh-var(--paragraph-height)/2)] text-white"
        string="split"
        string-split="word"><?= $page->hiatus()->sp()->kirbytextinline()->splitsubelements("strong", 'class="text-gray-400"') ?></p>
    </c-text-reveal>
  </div>

  <div
    string
    string-offset-bottom="-25%"
    class="expertise z-1 bg-black overflow-hidden call-to-action flex flex-col items-center gap-4 p-grid-padding">
    <div class="wrapper w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12">
      <div class="flex text-white text-lg w-full items-center gap-grid-padding mb-10 md:mb-16">
        <hr class="bg-white w-full block from-left">
        <span class="animate-opacity">EXPERTISE</span>
        <hr class="text-white w-full block from-right">
      </div>

      <!--TODO: extact to snipet et tout-->
      <div class="animate-opacity delay-750! flex flex-col lg:flex-row gap-4 lg:gap-unset justify-between items-center w-full mb-10 md:mb-26 text-white group">
        <?php foreach ($ctaItems as $item): ?>
          <a
            class="text cap block uppercase text-[1.3rem] text-bold decoration-1 underline transition-[text-decoration-color] ease-projects underline-offset-4 duration-500 not-pointer-coarse:group-has-[:hover]:decoration-transparent not-pointer-coarse:hover:decoration-inherit"
            href="<?= $item["url"] ?>">
            <?= $item["label"] ?>
          </a>
          <hr
            aria-hidden
            class="w-6 lg:hidden block m-3 last-of-type:hidden">
          <span
            aria-hidden
            class="hidden lg:block last:hidden">|</span>
        <?php endforeach; ?>
      </div>

      <div class="animate-opacity delay-1250! contact mb-10 md:mb-20 lg:mb-30 flex justify-center">

        <?php if ($site->email()->isNotEmpty()): ?>
        <c-mailto
          class="cta cta-light grid place-items-center w-fit">
          <a
            data-events-click="handleClick"
            href="mailto:<?= $site->email() ?>"
            class="block"><span class=" pointer-events-none">contact</span>
          </a>
        </c-mailto>
        <?php endif; ?>

      </div>
    </div>
  </div>

</c-homepage>

<?php snippet("footer"); ?>
