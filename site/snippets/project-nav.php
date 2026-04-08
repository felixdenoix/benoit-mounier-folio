<?php
$next = $page->nextListed() ?? $page->templateSiblings(false)->listed()->first();
$previous = $page->prevListed() ?? $page->templateSiblings(false)->listed()->last();
?>
<div class="project-nav flex relative">
    <?php if ($previous): ?>
        <a
            class="grid z-10 place-items-center relative after:content-[''] after:absolute after:-inset-x-2 after:z-10 after:inset-y-0"
            href="<?= $previous->url() ?>">
            <span class="block *:h-6 *:w-auto"><?= svg("assets/icons/chevron.svg") ?></span>
        </a>
    <?php endif; ?>
    <span class="block w-full text-center text-cap text-md uppercase bg-inherit relative z-2 px-10">Projets</span>
    <?php if ($next): ?>
        <a
            class="grid z-10 place-items-center relative after:content-[''] after:absolute after:-inset-x-2 after:z-10 after:inset-y-0"
            href="<?= $next->url() ?>">
            <span class="block *:h-6 *:w-auto rotate-180"><?= svg("assets/icons/chevron.svg") ?></span>
        </a>
    <?php endif; ?>
</div>
