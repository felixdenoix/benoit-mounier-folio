<nav class="flex flex-row justify-between text-md items-center <?= $classes ?? "" ?>">
  <?php
/*
    In the menu, we only fetch listed pages,
    i.e. the pages that have a prepended number
    in their foldername.

    We do not want to display links to unlisted
    `error`, `home`, or `sandbox` pages.

    More about page status:
    https://getkirby.com/docs/reference/panel/blueprints/page#statuses
  */
?>
  <?php foreach ($site->children()->listed() as $item): ?>
  <a
    class="uppercase header-link header-link-hover block text-[1.1rem] leading-none"
    <?php e($item->isActive(), 'data-current aria-current="page"'); ?>
    href="<?= $item->url() ?>"><?= $item->pagelinklabel()->isNotEmpty() ? $item->pagelinklabel()->esc() : $item->title()->esc() ?>
  </a>
  <?php endforeach; ?>
</nav>
