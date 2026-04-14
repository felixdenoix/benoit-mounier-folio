<?php
$next = $page->nextListed() ?? $page->templateSiblings(false)->listed()->first();
$previous = $page->prevListed() ?? $page->templateSiblings(false)->listed()->last();
$compact ??= false;
?>
<div class="project-nav flex items-center relative group whitespace-nowrap transition duration-300 ease-projects group-[&.bottom-reached]:opacity-0 leading-none text-cap! <?= $classes ??
    "" ?>">

    <?php if ($previous): ?>
        <a
            class="peer/prev flex-1/3 flex gap-4 z-10 items-center relative after:content-[''] after:absolute after:-inset-x-2 after:z-10 after:inset-y-0 group/prev"
            href="<?= $previous->url() ?>">
            <span class="block *:h-5 *:w-auto transition-transform duration-500 ease-projects not-pointer-coarse:group-hover/prev:scale-110"><?= svg(
                "assets/icons/chevron.svg",
            ) ?></span>
            <span class="flex flex-col">
                <span class="block text-md font-light text-cap transition-[font-weight] duration-500 ease-projects not-pointer-coarse:group-hover/prev:font-medium  <?= $compact
                    ? "hidden"
                    : "" ?>">Précédent</span>
            </span>
        </a>
    <?php endif; ?>

    <?php if (isset($compact) && $compact === true): ?>
        <span class="flex-1/3 block w-full text-center text-cap uppercase bg-inherit relative z-2 px-5 cursor-default transition-all duration-400 ease-projects peer-hover/prev:font-medium peer-hover/prev:-translate-x-1 group-has-[.peer\/next:hover]:font-medium group-has-[.peer\/next:hover]:translate-x-1">
            Projets
        </span>
    <?php endif; ?>

    <?php if ($next): ?>
        <a
            class="peer/next flex-1/3 flex justify-end gap-4 z-10 items-center relative after:content-[''] after:absolute after:-inset-x-2 after:z-10 after:inset-y-0 group/next"
            href="<?= $next->url() ?>">
                <span class="flex flex-col align-bottom">
                    <span class="block text-md font-light text-cap text-right transition-[font-weight] duration-500 ease-projects not-pointer-coarse:group-hover/next:font-medium <?= $compact
                        ? "hidden"
                        : "" ?>">Suivant</span>
                </span>
            <span class="block *:h-5 *:w-auto rotate-180 transition-transform duration-500 ease-projects not-pointer-coarse:group-hover/next:scale-110"><?= svg(
                "assets/icons/chevron.svg",
            ) ?></span>
        </a>
    <?php endif; ?>
</div>
