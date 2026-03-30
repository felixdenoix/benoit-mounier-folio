<?php
/*
  Snippets are a great way to store code snippets for reuse
  or to keep your templates clean.

  This footer snippet is reused in all templates.

  More about snippets:
  https://getkirby.com/docs/guide/templates/snippets
*/
?>
    </div>
  </main>

  <c-footer>
    <footer
      string="progress"
      string-repeat
      string-id="footer"
      string-exit-el="bottom"
      string-exit-vp="bottom"
      string-offset-top="-40sh"
      class="footer box-border block pt-8 px-grid-padding pb-grid-padding base-grid">
      <div class="col-span-full flex justify-center mb-4">
        <?php snippet('navigation'); ?>
      </div>

      <div class="col-span-full flex justify-center mb-8 text-lg font-extrabold">
        <a
          class="logo block uppercase"
          href="<?= $site->url() ?>">
          <h2><?= $site->title()->esc() ?></h2>
        </a>
      </div>

      <div class="col-span-full flex justify-between">
        <a class="bloc link [text-box-trim:trim-both]" href="<?= page('mentions-legales')?->url()?>">mentions légales</a>
        <a class="bloc link [text-box-trim:trim-both]" href="https://felixdenoix.fr">site par</a>
      </div>
    </footer>
  </c-footer>

  <!--TODO: clean useless libs-->
  <?= js([
    // 'assets/js/prism.js',
    // 'assets/js/lightbox.js',
    // 'assets/js/index.js',
    '@auto'
  ]) ?>
  <!--https://getkirby.com/docs/reference/templates/helpers/js#examples__autoloading-template-specific-script-files-->

  <?= vite()->js("index.ts", ['async' => true], try: true) ?>
</body>
</html>
