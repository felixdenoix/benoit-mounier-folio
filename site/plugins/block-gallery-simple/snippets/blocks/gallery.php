<?php
/** @var \Kirby\Cms\Block $block */
?>
<figure class="gallery">
  <ul>
    <?php foreach ($block->images()->toFiles() as $image): ?>
    <li>
      <?php snippet('image', [
        'alt'      => $image->alt(),
        'contain'  => $block->crop()->isTrue(),
        'lightbox' => true,
        'ratio'    => $block->ratio()->or('auto'),
        'src'      => $image->url(),
      ]) ?>
    </li>
    <?php endforeach ?>
  </ul>
</figure>
