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
foreach ($items as $item): ?>
<div
  class="bdo bg-(--bgc) sticky top-0 w-screen h-[calc(100vh+(var(--scenes,1)*100svh))] object-center object-contain"
  string="progress"
  style="--bgc:<?= $item->background_color()?>;--scenes:<?= count($item->scenes()->toStructure())?>;">

    <?php if($item->background_image()->isNotEmpty()): ?>
    <div class="sticky top-0 h-svh w-full bg-amber-200">
      <img
        class="absolute top-0 w-full h-full object-center object-contain"
        src="<?= $item->background_image()->toFile()->url() ?>">
    </div>
    <?php endif ?>

    <!--<div class="bdbscenes h-screen w-screen relative bdg">-->
      <?php foreach ($item->scenes()->toStructure() as $scene): ?>
      <div class="scene sticky top-0 bdg w-full h-svh aspect-16/9">
        <?php foreach ($scene->images_ft()->toFiles() as $imageFt): ?>
          <img
            class="bdo absolute top-0 left-0 object-center object-contain h-full w-full"
            height="<?= $imageFt->height()?>"
            width="<?= $imageFt->width()?>"
            src="<?= $imageFt->url()?>">
        <?php endforeach ?>
        <?php foreach ($scene->images_fb()->toFiles() as $imageFb): ?>
          <img
            class="absolute top-0 left-0 object-center object-contain h-full w-full"
            height="<?= $imageFb->height()?>"
            width="<?= $imageFb->width()?>"
            src="<?= $imageFb->url()?>">
        <?php endforeach ?>
        <?php foreach ($scene->images_fade()->toFiles() as $imageFade): ?>
          <img
            class="absolute top-0 left-0 object-center object-contain h-full w-full"
            height="<?= $imageFade->height()?>"
            width="<?= $imageFade->width()?>"
            src="<?= $imageFade->url()?>">
        <?php endforeach ?>
      </div>
      <?php endforeach ?>
    <!--</div>-->


</div>
<?php endforeach ?>
