<?php
/** @var Kirby\Cms\Page $page */
?>
<?php snippet("header", ["seo" => $page->seo()]); ?>

<?php
$next_project = $page->nextListed() ?? $page->templateSiblings(false)->listed()->first();
$previous_project = $page->prevListed() ?? $page->templateSiblings(false)->listed()->last();
?>

<c-project log>

    <article class="project base-grid pb-10">

        <?php
        $headline = $page->headline() ?: $page->title();
        $sub_headline = $page->subheadline()->isNotEmpty() ? $page->subheadline()->esc() : null;
        $sub_headline_dataset = $page->subheadline()->isNotEmpty() ? "<span class='hidden md:inline!'>{$page->subheadline()->esc()}</span>" : null;
        ?>

        <header
            string="progress"
            string-id="project-heading"
            data-dom="project-heading"
            data-heading="<?= $headline->esc() . ($sub_headline_dataset ? " " . $sub_headline_dataset : "") ?>"
            class="project header col-span-full row-span-1 grid place-items-center text-black pt-(--header-height) pb-8 md:pb-16 lg:pb-20 xl:pb-26">
            <h1
                class="block w-fit text-3xl md:text-4xl font-heavy mt-8 md:mt-16 lg:mt-20 xl:mt-26"><?= $headline ?></h1>
            <?php if ($sub_headline): ?>
                <h2 class="block w-fit text-2xl"><?= $sub_headline ?></h2>
            <?php endif; ?>
        </header>

        <div class="text-content flex flex-col col-span-10 col-start-2 mb-[calc(var(--spacing-grid-padding)*2)] md:mb-0 md:col-span-4 md:col-end-13 lg:col-span-3 lg:col-end-13 relative">
            <div class="text-content-wrapper sticky z-0 top-[calc(var(--header-height)+var(--grid-padding))] md:max-h-[calc(100svh-var(--header-height)-2*var(--grid-padding))] h-full flex flex-col justify-between gap-y-4">
                <div
                    data-dom="text-content-shadow-wrapper"
                    class="text-content-shadow-wrapper h-full shrink min-h-0"
                    style="--css-progress:0;">
                    <div
                        class="relative text-content-scroll-wrapper h-full md:overflow-y-auto hide-scrollbar overflow-x-hidden overflowing"
                        string="scroll-container"
                        data-dom="text-content-scroll-wrapper"
                        string-lerp="0.18">
                        <div
                            data-dom="text-content-scroller"
                            class="text-content-scroller relative flex flex-col gap-4 [&_li:not(:last-of-type)]:mb-2">
                            <?= $page->text()->toBlocks() ?>
                            <div class="dates">
                                <span class="font-extrabold">Date:</span>
                                <?php
                                $index = 0;
                                $entries = $page->dates()->toEntries();
                                $count = count($entries);
                                ?>
                                <?php if ($entries): ?>
                                    <p class="font-normal">
                                        <?php foreach ($entries as $date): ?>
                                            <time><?= $date->date()->esc() ?></time> <?= $index < $count - 1 ? ">" : "" ?>
                                            <?php $index++; ?>
                                        <?php endforeach; ?>
                                    </p>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
                <div data-dom="text-content-project-nav" class="hidden md:block w-full min-h-0 shrink-0 group">
                    <?php snippet("project-nav", ["classes" => "w-fit", "compact" => true]); ?>
                </div>
            </div>
        </div>

        <div
            data-dom="asset-content"
            class="asset-content col-span-full md:col-span-8 md:col-start-1 md:row-start-2 lg:col-span-9 lg:col-start-1 lg:row-start-2">
            <?php foreach ($page->medias()->toLayouts() as $layout): ?>
                <section class="grid auto-cols-fr gap-2.5 not-last:mb-2.5" id="<?= $layout->id() ?>">
                    <?php foreach ($layout->columns() as $column): ?>
                        <div class="col-span-full md:col-span-(--span) md:row-start-1" style="--span:<?= $column->span(12) ?>">
                            <div class="blocks h-full flex flex-col gap-2.5">
                                <?php foreach ($column->blocks() as $block): ?>
                                    <div class="h-full flex flex-col justify-stretch gap-2.5 [&_li:not(:last-of-type)]:mb-2.5 block-type-<?= $block->type() ?> *:h-full">
                                        <?php snippet("blocks/" . $block->type(), ["block" => $block, "layout" => $layout]); ?>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </section>
            <?php endforeach; ?>
        </div>

        <div class="col-span-full flex items-stretch *:w-full mt-10">
            <?php snippet("project-nav", ["classes" => "justify-between"]); ?>
        </div>

    </article>

</c-project>

<?php snippet("footer"); ?>
