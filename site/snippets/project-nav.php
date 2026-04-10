<?php
$next = $page->nextListed() ?? $page->templateSiblings(false)->listed()->first();
$previous = $page->prevListed() ?? $page->templateSiblings(false)->listed()->last();
$compact ??= false;
?>
<div class="project-nav flex items-center relative group whitespace-nowrap transition duration-300 ease-projects group-[&.bottom-reached]:opacity-0 leading-none text-cap! <?= $classes ??
    "" ?>">
    <?php if ($previous): ?>
        <a
            class="flex-1/3 flex gap-4 z-10 items-center relative after:content-[''] after:absolute after:-inset-x-2 after:z-10 after:inset-y-0"
            href="<?= $previous->url() ?>">
            <span class="block *:h-5 *:w-auto"><?= svg("assets/icons/chevron.svg") ?></span>
            <span class="flex flex-col">
                <!--<span class="block">prec.</span>-->
                <span class="block text-md text-cap  <?= $compact ? "hidden" : "" ?>"><?= $previous->title() ?></span>
            </span>
        </a>
    <?php endif; ?>
    <?php if (isset($compact) && $compact === true): ?>
        <span class="flex-1/3 block w-full text-center text-cap uppercase bg-inherit relative z-2 px-5 cursor-default">Projets</span>
    <?php endif; ?>
    <?php if ($next): ?>
        <a
            class="flex-1/3 flex justify-end gap-4 z-10 items-center relative after:content-[''] after:absolute after:-inset-x-2 after:z-10 after:inset-y-0"
            href="<?= $next->url() ?>">
                <span class="flex flex-col align-bottom">
                    <!--<span class="block text">suiv.</span>-->
                    <span class="block text-md text-cap text-right <?= $compact ? "hidden" : "" ?>"><?= $next->title() ?></span>
                </span>
            <span class="block *:h-5 *:w-auto rotate-180"><?= svg("assets/icons/chevron.svg") ?></span>
        </a>
    <?php endif; ?>
</div>
