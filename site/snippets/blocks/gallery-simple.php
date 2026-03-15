<?php
/** @var \Kirby\Cms\Block $block */
?>

<div class="gallery-simple overriden">
  <ul class="h-full flex flex-col justify-stretch *:h-full *:bdb">
    <?php foreach ($block->medias()->toFiles() as $image): ?>
    <li>
      <?php snippet('image', [
        'alt'      => $image->alt(),
        'contain'  => $block->crop()->isTrue(),
        'ratio'    => $block->ratio()->or('auto'),
        'src'      => $image->url(),
        'class'    => 'h-full'
      ]) ?>
    </li>
    <?php endforeach ?>
  </ul>
</div>
