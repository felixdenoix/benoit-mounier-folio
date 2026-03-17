<?php snippet('header', ['seo' => $page->seo()]) ?>

<article class="editorial py-[calc(var(--header-height)+var(--spacing-grid-padding))] base-grid">
  <!--TODO: sub pages menu-->
  <?php foreach($page->content()->content()->toLayouts() as $layout): ?>
  <section class="sub-grid col-span-full first:mt-10">
    <?php foreach ($layout->columns() as $column): ?>
      <div class="col-span-full md:col-span-(--span) md:row-start-1" style="--span:<?= $column->span(12) ?>">
        <div class="blocks h-full flex flex-col gap-2.5">
          <?php foreach ($column->blocks() as $block): ?>
          <div class="h-full flex flex-col justify-stretch gap-2.5 [&_li:not(:last-of-type)]:mb-2.5 block-type-<?= $block->type() ?> *:h-full">
            <?php snippet('blocks/' . $block->type(), ['block' => $block, 'layout' => $layout]) ?>
          </div>
          <?php endforeach ?>
        </div>
      </div>
      <?php endforeach ?>
  </section>
  <?php endforeach?>

</article>


<?php snippet('footer') ?>
