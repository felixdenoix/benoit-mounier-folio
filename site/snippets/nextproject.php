<?php
$next = $page->nextProject()->toPage()
  ?? $page->nextListed()
  ?? $page->templateSiblings(false)->listed()->first();
?>
<?php if ($next): ?>
  <a class="bg-gray-primary px-6 py-4 block text-center box-border text-white font-bold uppercase" href="<?= $next->url()?>">Projet suivant</a>
<?php endif ?>
