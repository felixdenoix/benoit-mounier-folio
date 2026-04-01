<?php
$next = $page->nextProject()->toPage()
  ?? $page->nextListed()
  ?? $page->templateSiblings(false)->listed()->first();
?>
<?php if ($next): ?>
  <a
    class="bg-gray-primary not-pointer-coarse:hover:bg-black transition duration-40 ease-projects px-6 py-4 block text-center text-normal box-border text-white font-bold uppercase leading-none group"
    href="<?= $next->url()?>">
      <span class="mx-auto block relative w-fit">
        <span class="inline-block bg-inherit px-2 relative z-2">Projet suivant</span>
        <span class="inline-block absolute z-1 text-[1.2rem] not-pointer-fine:r-2 not-pointer-coarse:opacity-0 not-pointer-coarse:-translate-[100%_0_0] not-pointer-coarse:group-hover:translate-[0_0_0] transition
         not-pointer-coarse:group-hover:opacity-100 duration-400 ease-projects">&#x2192;</span>
      </span>
      </a>
<?php endif ?>
