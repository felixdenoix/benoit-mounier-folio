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
<?php snippet('header', ['seo' => $page->seo()]) ?>

<div class="intro pb-40 bdr">

  <?php
  // using the `toStructure()` method, we create a structure collection
  $items = $page->intro()->toStructure();
  // we can then loop through the entries and render the individual fields
  foreach ($items as $item): ?>
  <div class="bdo bg-(--bgc)" style="--bgc:<?= $item->background() ?>">
    <pre>
      mode: <?= $item->mode() ?>
    </pre>

    <?php foreach ($item->images()->toFiles() as $image): ?>
      <img src="<?= $image->crop(400)->url() ?>">
    <?php endforeach ?>
  </div>
  <?php endforeach ?>
</div>

<div class="hiatus mt-40 grid place-items-center bdr min-h-screen p-grid-padding">
  <?= $page->hiatus()->kirbyText() ?>
</div>

<div class="bdg min-h-screen call-to-action mt-40 flex flex-col items-center justify-center gap-4">

  <?php
  // using the `toStructure()` method, we create a structure collection
  $items = $page->callToAction()->toStructure();
  // we can then loop through the entries and render the individual fields
  foreach ($items as $item): ?>
    <a class="bdb block p-4" href="<?= $item->projects()->random()->toPage()->url() ?>">
      <?= $item->label() ?>
    </a>
  <?php endforeach ?>
</div>


  <?php
  /*
    We always use an if-statement to check if a page exists to
    prevent errors in case the page was deleted or renamed before
    we call a method like `children()` in this case
  */
  ?>
  <?php if ($photographyPage = page('photography')): ?>
  <?php endif ?>
<?php snippet('footer') ?>
