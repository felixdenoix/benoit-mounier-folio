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
        class="footer box-border block shadow-md-upwards">
        <div class="base-grid w-full py-8 mb:py-grid-padding px-grid-padding">
            <div class="col-span-full flex justify-center">
                <?php snippet("navigation", ["classes" => "text-md font-extrabold width-auto gap-5 md:gap-0 md:width-col-4 lg:width-col-3"]); ?>
            </div>
        </div>
        <div class="bg-black w-full">
            <div class="base-grid p-grid-padding w-full  text-white">
                <div class="col-span-full flex justify-between items-end">
                    <div class="flex flex-col">
                        <a
                            class="logo block font-extrabold flex-1 text-center uppercase"
                            href="<?= $site->url() ?>">
                            <h2><?= $site->title()->esc() ?></h2>
                        </a>
                        <a class="block link [text-box-trim:trim-both] flex-1 text-left" href="<?= page("mentions-legales")?->url() ?>">mentions légales</a>
                    </div>
                    <a class="block link [text-box-trim:trim-both] flex-1 text-right" href="https://felixdenoix.fr">site par</a>
                </div>
            </div>
        </div>
    </footer>
</c-footer>

<!--TODO: clean useless libs-->
<?= js([
    // 'assets/js/prism.js',
    // 'assets/js/lightbox.js',
    // 'assets/js/index.js',
    "@auto",
]) ?>
<!--https://getkirby.com/docs/reference/templates/helpers/js#examples__autoloading-template-specific-script-files-->

<?= vite()->js("index.ts", ["async" => true], try: true) ?>
</body>

</html>
