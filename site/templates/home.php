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

<c-homepage>

  <div class="intro relative">
    <?php snippet("home/intro", ["introItems" => $introItems]); ?>
  </div>

  <div
    data-dom="hiatus"
    class="content-visibility-auto z-1 hiatus pt-[50svh] pb-[25vh] grid place-items-center min-h-screen p-grid-padding bg-black relative">
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
      string-easing="cubic-bezier(.19,.6,.4,.85)"
    >
      <!--
        ajusting scroll height and offset
          -50% - 1/2*(100%/paragraph-repeat-count)
      -->
      <p
        class="sticky *:inline-block top-[calc(50vh-var(--paragraph-height)/2)] text-white"
        string="split"
        string-split="word"><?= $page->hiatus()->sp()->kirbytextinline()->splitsubelements("strong", 'class="text-gray-text-light font-bold"') ?></p>
    </c-text-reveal>
  </div>

  <div
    string
    string-offset-bottom="-25%"
    class="content-visibility-auto expertise z-1 bg-black flex flex-col items-center p-grid-padding">
        <?php snippet("home/expertise"); ?>
  </div>

</c-homepage>

<?php snippet("footer"); ?>
