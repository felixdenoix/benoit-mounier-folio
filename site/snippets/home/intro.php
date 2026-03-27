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
  $intro_block_id="into-block-progress" . $index;
?>

<c-home-intro
  class="block bdo bg-(--bgc) sticky top-0 w-screen h-[calc(100vh+(var(--scenes,1)*100svh))] object-center object-contain pt-screen"
  string="progress"
  string-key="--home-intro-progress"
  string-id="<?=$intro_block_id?>"
  <?php if ($index == 0) : ?>
  <?php endif ?>
  string-enter-el="top"
  string-enter-vp="top"
  string-offset-bottom="0%"
  string-exit-el="bottom"
  string-exit-vp="bottom"
  style="--bgc:<?= $item->background_color()->or("transparent") ?>;--scenes:<?= count($item->scenes()->toStructure()) ?>;--intro-section-height:calc(100vh + (<?= count($item->scenes()->toStructure()) ?> * 100vh));">

    <?php if($item->background_image()->isNotEmpty()): ?>

    <div class="absolute top-0 h-svh w-full transform-gpu translate-y-[calc(var(--home-intro-progress)*(var(--scenes,1)*100svh))]">
      <img
        class="absolute top-0 w-full h-full object-center object-contain "
        src="<?= $item->background_image()->toFile()->url() ?>">
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
      class="scene sticky top-0 w-full h-svh aspect-16/9 <?= "animation-mode-".$scene->animation_mode() ?>">

      <?php
        $ftFiles = $scene->images_ft()->toFiles();
        $fileIndexes = range(1, count($ftFiles));
        if ($scene->animation_mode() === 'random') {
          shuffle($fileIndexes);
        }
        foreach ($ftFiles as $imageFt): ?>
        <img
          class="from-top bdo absolute top-0 left-0 object-center object-contain h-full w-full"
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
          class="from-bottom absolute top-0 left-0 object-center object-contain h-full w-full"
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
          class="from-fade absolute top-0 left-0 object-center object-contain h-full w-full"
          style="--animation-index:<?= $fileIndexes[$imagesFade->indexOf($imageFade)] ?>; --animation-count: <?= count($imagesFade) ?>"
          height="<?= $imageFade->height()?>"
          width="<?= $imageFade->width()?>"
          src="<?= $imageFade->url()?>">
      <?php endforeach ?>

    </div>
    <?php endforeach ?>

  </c-home-intro>
<?php endforeach ?>
