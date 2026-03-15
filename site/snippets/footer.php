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

  <footer class="footer pt-16 px-grid-padding pb-grid-padding base-grid">
    <div class="col-span-full flex justify-between">
      <a class="bloc link [text-box-trim:trim-both]" href="">mentions légales</a>
      <a class="bloc link [text-box-trim:trim-both]" href="https://felixdenoix.fr">site par</a>
    </div>
  </footer>

  <!--TODO: clean useless libs-->
  <?= js([
    // 'assets/js/prism.js',
    // 'assets/js/lightbox.js',
    // 'assets/js/index.js',
    '@auto'
  ]) ?>
  <!--https://getkirby.com/docs/reference/templates/helpers/js#examples__autoloading-template-specific-script-files-->

  <?= vite()->js("index.ts", ['async' => true, 'defer' => true], try: true) ?>
</body>
</html>
