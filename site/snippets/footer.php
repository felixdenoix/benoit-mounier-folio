<?php
/*
  Snippets are a great way to store code snippets for reuse
  or to keep your templates clean.

  This footer snippet is reused in all templates.

  More about snippets:
  https://getkirby.com/docs/guide/templates/snippets
*/
?>
<div class="transition-overlay fixed inset-0 bg-white invisible opacity:0 pointer-events-none z-[calc(var(--z-header)-1)]"></div>
</div>
</main>

<c-footer>
    <footer
        string="progress|proximity[smooth]"
        string-radius="300"
        string-repeat
        string-id="footer"
        string-exit-el="bottom"
        string-exit-vp="bottom"
        string-offset-top="-40sh"
        string-easing="cubic-bezier(0.44,0.07,0.41,1)"
        class="footer box-border block shadow-md-upwards-proximity">
        <div class="base-grid w-full py-8 mb:py-grid-padding px-grid-padding">
            <div class="col-span-full flex justify-center">
                <?php snippet("navigation", ["classes" => "text-md font-extrabold width-auto gap-8 md:gap-0 md:width-col-4 lg:width-col-3"]); ?>
            </div>
        </div>
        <div class="bg-black w-full leading-none">
            <div class="base-grid p-grid-padding w-full  text-white">
                <div class="col-span-full flex justify-between items-end">
                    <div class="flex flex-col gap-2">
                        <a
                            class="logo block font-extrabold flex-1 text-center uppercase h-"
                            href="<?= $site->url() ?>">
                            <h2 class="leading-none"><?= $site->title()->esc() ?></h2>
                        </a>
                        <a class="block link [text-box-trim:trim-both] text-xs flex-1 text-left" href="<?= page(
                            "mentions-legales",
                        )?->url() ?>">mentions légales</a>
                    </div>
                    <div class="flex-col gap-2 flex text-right text-white">
                        <c-mailto class="grid place-items-end w-fit font-extrabold">
                            <a
                                data-events-click="handleClick"
                                href="mailto:<?= $site->email() ?>"
                                class="block col-start-1 row-start-1"><span class=" pointer-events-none">contact</span>
                            </a>
                        </c-mailto>
                        <a class="block link [text-box-trim:trim-both] flex-1 text-xs text-right" rel="noopener" target="_blank"  href="https://felixdenoix.fr">site par</a>
                    </div>
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
