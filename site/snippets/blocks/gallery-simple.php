<?php
/** @var \Kirby\Cms\Block $block */
?>

<div class="gallery-simple overriden">
  <ul class="h-full flex flex-col justify-stretch ">
    <?php foreach ($block->medias()->toFiles() as $image): ?>
    <li class="h-full">
      <?php
      snippet('imagex-picture', [
        'image' => $image,
        'pictureAttributes' => [
          'shared' => [
            'class' => ['h-full w-full'],
          ],
        ],
        'imgAttributes' => [
          'shared' => [
          'class' => ["object-cover h-full w-full bg-cover bg-center bg-[var(--bg-image)]"],
          'style' => ["--bg-image: url(data:{$image->mime()};base64,{$image->thumb(['width' => 30, 'blur' => true, 'quality' => 50])->base64()});"],
          'sizes' => '(40em <= width) 50vw, (width < 40rem) 100vw',
          ],
        ],
        'sourcesAttributes' => [
          'sizes' =>'(40em <= width) 50vw, (width < 40rem) 100vw'
        ],
        'srcsetName' => 'ben-srcset',
      ]);
      ?>
    </li>
    <?php endforeach ?>
  </ul>
</div>
