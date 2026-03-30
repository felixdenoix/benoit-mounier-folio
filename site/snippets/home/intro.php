<?php
/*
  Snippets are a great way to store code snippets for reuse
  or to keep your templates clean.

  This intro snippet is reused in multiple templates.
  While it does not contain much code, it helps to keep your
  code DRY and thus facilitate maintenance when you have
  to make changes.

  More about snippets:
  https://getkirby.com/docs/guide/templates/snippets
*/
?>

<?php
// using the `toStructure()` method, we create a structure collection
$items = $page->intro()->toStructure();
// we can then loop through the entries and render the individual fields
foreach ($items as $index => $item):
  $intro_block_id = "into-block-progress" . $index;
  $scenes_count = count($item->scenes()->toStructure());
?>

<c-home-intro
  class="block bg-(--bgc) sticky top-0 w-full h-(--scenes-height) <?= count($item->scenes()->toStructure()) > 0 ? 'min-h-[200vh]' : '' ?> object-center object-contain px-[5%] lg:px-[10%] z-(--section-index)"
  string="progress"
  string-key="--home-intro-progress"
  string-id="<?=$intro_block_id?>"
  <?php if($index === 0):?>
  string-offset-bottom="-25%"
  <?php endif ?>
  <?php if ($item->background_image()->isNotEmpty()) : ?>
  string-enter-el="top"
  string-enter-vp="top"
  string-offset-bottom="0%"
  <?php endif ?>
  string-exit-el="bottom"
  string-exit-vp="bottom"
  style="--bgc:<?= $item->background_color()->or("white") ?>; --scenes-count:<?= $scenes_count ?>; --scenes-height: calc(<?= $scenes_count ?: 1 ?> * 100vh); --section-index:<?= $index * 10?>;">

    <?php if ($item->background_image()->isNotEmpty() || $item->title()->isNotEmpty()) : ?>

    <div class="background-wrapper absolute h-(--scenes-height) w-9/10 lg:w-8/10 ">
      <div
        data-background
        class="sticky grid place-items-center z-1 top-0 h-screen w-full left-[5%] lg:left-[10%]"
      >
        <?php if($item->background_image()->isNotEmpty()) : ?>
        <img
          class="absolute top-0 w-full h-full object-center object-contain"
          decoding="async"
          src="<?= $item->background_image()->toFile()->url() ?>">
        <?php endif ?>
        <div class="headings text-center w-full">
          <?php if($item->title()->isNotEmpty()): ?>
          <h1 string="split" string-split="char|fit" class="font-extrabold text-[calc(var(--fit-font-size)*1px)]" style=><?= $item->title()->escape() ?></h1>
          <?php endif ?>
          <?php if($item->subtitle()->isNotEmpty()) : ?>
          <h2 class="text-md font-bold"><?= $item->subtitle()->escape() ?></h2>
          <?php endif ?>
          <h1></h1>
        </div>

      </div>

    </div>

    <?php endif ?>

    <?php
    $scenes = $item->scenes()->toStructure();
    $scenes_count = count($scenes);
    foreach ($scenes as $scene_index => $scene):
      $step = 1 / $scenes_count;
      $part_start = $scene_index * $step;
      $part_end = $scene_index === $scenes_count - 1 ? 1 : ($scene_index + 1) * $step;
    ?>
    <div
      string="progress-part"
      string-part-of="<?= "{$intro_block_id}[{$part_start}-{$part_end}]"?>"
      class="z-10 scene h-screen top-0 aspect-16/9 <?= "animation-mode-".$scene->animation_mode() ?> <?= $scene->scroll_mode() == 'normal' ? 'sticky w-full' : 'fixed w-9/10 lg:w-8/10' ?>">

      <?php
        $ftFiles = $scene->images_ft()->toFiles();
        $fileIndexes = range(1, count($ftFiles));
        if ($scene->animation_mode() == 'random') {
          shuffle($fileIndexes);
        }
        foreach ($ftFiles as $imageFt): ?>
        <img
          class="z-1 from-top absolute top-0 left-0 object-center object-contain h-full w-full"
          decoding="async"
          style="--animation-index:<?= $fileIndexes[$ftFiles->indexOf($imageFt)] ?>; --animation-count:<?= count($ftFiles) ?>"
          height="<?= $imageFt->height()?>"
          width="<?= $imageFt->width()?>"
          src="<?= $imageFt->url()?>">
      <?php endforeach ?>

      <?php
        $fbFiles = $scene->images_fb()->toFiles();
        $fileIndexes = range(1, count($fbFiles));
        if ($scene->animation_mode() === 'random') {
          shuffle($fileIndexes);
        }
        foreach ($fbFiles as $imageFb): ?>
        <img
          class="z-2 from-bottom absolute top-0 left-0 object-center object-contain h-full w-full"
          decoding="async"
          style="--animation-index:<?= $fileIndexes[$fbFiles->indexOf($imageFb)] ?>; --animation-count: <?= count($fbFiles) ?>"
          height="<?= $imageFb->height()?>"
          width="<?= $imageFb->width()?>"
          src="<?= $imageFb->url()?>">
      <?php endforeach ?>

      <?php
        $imagesFade = $scene->images_fade()->toFiles();
        $fileIndexes = range(1, count($imagesFade));
        if ($scene->animation_mode() === 'random') {
          shuffle($fileIndexes);
        }
        foreach ($imagesFade as $imageFade): ?>
        <img
          class="z-3 from-fade absolute top-0 left-0 object-center object-contain h-full w-full"
          decoding="async"
          style="--animation-index:<?= $fileIndexes[$imagesFade->indexOf($imageFade)] ?>; --animation-count: <?= count($imagesFade) ?>"
          height="<?= $imageFade->height()?>"
          width="<?= $imageFade->width()?>"
          src="<?= $imageFade->url()?>">
      <?php endforeach ?>

    </div>
    <?php endforeach ?>

  </c-home-intro>
<?php endforeach ?>
