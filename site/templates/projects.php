<?php
/*
  Templates render the content of your pages.

  They contain the markup together with some control structures
  like loops or if-statements. The `$page` variable always
  refers to the currently active page.

  To fetch the content from each field we call the field name as a
  method on the `$page` object, e.g. `$page->title()`.

  This template lists all the subpages of the `notes` page with
  their title date sorted by date and links to each subpage.

  This template receives additional variables like $tag and $notes
  from the `notes.php` controller in `/site/controllers/notes.php`

  Snippets like the header and footer contain markup used in
  multiple templates. They also help to keep templates clean.

  More about templates: https://getkirby.com/docs/guide/templates/basics
*/
?>
<?php snippet('header', ['seo' => $page->seo()]) ?>

<header class="heading mt-20 p-20 grid place-items-center">
  <h1 class="text-3xl font-bold">PROJETS</h1>
</header>

<ul
  style="--row-height: calc(100%/3);"
  class="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-(--spacing-grid-padding) group">

  <?php foreach($entries as $project):?>
    <li class="col-span-1 grid place-content-center aspect-3/2 relative place-items-stretch group-has-[:hover]:*:blur-xs hover:*:blur-none hover:*:scale-101 overflow-hidden transition duration-750 ease-projects relative">

      <img
        class="absolute h-full w-full inset-0 -z-1 object-cover object-center scale-102 duration-400 ease-projects transition"
        src="<?= $project->cover()->url();?>" alt="">

      <a
        href="<?= $project->url()?>"
        class="inset-0 block font-bold text-white text-xl z-10 absolute">
        <span class="sr-only"><?= $project->title()?></span>
      </a>

    </li>
  <?php endforeach ?>

</ul>

<?php snippet('footer') ?>
