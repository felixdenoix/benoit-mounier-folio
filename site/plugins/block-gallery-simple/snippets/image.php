<?php

$attrs = attr([
  'href'          => $href     ?? $src,
]);

?>

<img
src="<?= esc($src, 'attr') ?>"
alt="<?= esc($alt, 'attr') ?>"
style="
    aspect-ratio: <?= $ratio ?? 'auto' ?>;
    object-fit: <?= ($contain ?? false) ? 'contain' : 'cover' ?>
"
>
