<?php
/** @var Kirby\Cms\Page $page */
?>
<?php snippet('header') ?>

<article class="project base-grid mt-40 mb-24">
  <header class="project header block col-span-full row-span-1 grid place-items-center text-black mb-26">
    <h1 class="block w-fit text-4xl font-heavy"><?= $page->headline()->esc() ?: $page->title()->esc() ?></h1>
    <?php if ($page->subheadline()->isNotEmpty()): ?>
    <h2 class="block w-fit text-2xl"><?= $page->subheadline()->esc() ?></h2>
    <?php endif ?>
  </header>
  <div class="text-content flex flex-col col-span-full md:col-span-4 md:col-end-13">
    <div class="text-content-wrapper sticky z-0 top-[calc(var(--header-height)+var(--grid-padding))] max-h-[calc(100dvh-var(--header-height))] md:overflow-y-auto flex flex-col gap-y-4 [&_li:not(:last-of-type)]:mb-2">
      <?= $page->text()->toBlocks() ?>
      <div class="dates">
        <span class="font-extrabold">Date:</strong>
        <?php $index = 0; $entries= $page->dates()->toEntries(); $count = count($entries) ?>
        <?php if ($entries): ?>
        <p class="font-normal">
          <?php foreach ($entries as $date): ?>
          <time><?= $date->date()->esc() ?></time> <?= $index < $count - 1 ? '>' : '' ?>
          <?php $index++ ?>
          <?php endforeach ?>
        </p>
        <?php endif ?>
      </div>
      <div class="next hidden md:block w-full" >
        <?php snippet('nextproject') ?>
      </div>
    </div>
  </div>
  <div class="asset-content col-span-full md:col-span-8 md:col-start-1 md:row-start-2">
    <?php if ($cover = $page->cover()): ?>
    <!--<div class="cover mb-24">
      <img src="<?= $cover->crop(1200, 600)->url() ?>" alt="<?= $cover->alt()->esc() ?>">
    </div>-->
    <?php endif ?>
    <?php foreach ($page->medias()->toLayouts() as $layout): ?>
    <section class="grid auto-cols-fr gap-2.5 not-last:mb-2.5" id="<?= $layout->id() ?>">
      <?php foreach ($layout->columns() as $column): ?>
        <div class="col-span-full md:col-span-(--span) md:row-start-1" style="--span:<?= $column->span(12) ?>">
          <div class="blocks h-full flex flex-col gap-2.5">
            <?php foreach ($column->blocks() as $block): ?>
            <div class="h-full flex flex-col justify-stretch gap-2.5 [&_li:not(:last-of-type)]:mb-2.5 block-type-<?= $block->type() ?> *:h-full">
              <!--<?= $block ?>-->
              <?php snippet('blocks/' . $block->type(), ['block' => $block, 'layout' => $layout]) ?>
            </div>
            <?php endforeach ?>
          </div>
        </div>
        <?php endforeach ?>
    </section>
    <?php endforeach ?>
  </div>
  <div class="next md:hidden flex items-stretch *:w-full w-full">
    <?php snippet('nextproject') ?>
  </div>

</article>

<?php snippet('footer') ?>
