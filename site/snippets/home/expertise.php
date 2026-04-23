<c-home-expertise
    class="wrapper relative w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 min-h-[min(100vh,900px)] text-white">

    <div
        class=" text-gray-text-light text-2xl w-full text-center gap-grid-padding mb-16 block expertise-title font-bold"
        string="split"
        string-repeat="true"
        string-offset-bottom="-30%"
        string-split="char[random(0,1)]|char-word[random(0,10)]">
        EXPERTISE
    </div>

    <div
        class="animate-opacity flex flex-col md:flex-row justify-between items-center w-full mb-16 text-white group py-[10vh] md:py-0 md:pb-[calc(40px+33vh)] relative z-0"
        string
        string-offset-bottom="-30%">

        <div
            class="pointer-events-none sticky md:absolute top-1/2 md:top-[unset] md:bottom-0 left-0 w-full h-0 md:h-[33svh] z-0"
            data-dom="media-display">
            <?php foreach ($ctaItems as $index => $item): ?>
                <div
                    class="absolute inset-0 h-[33svh] -translate-y-1/2 md:translate-y-0 grid grid-cols-1 grid-rows-1 place-items-stretch opacity-0 scale-99 transition duration-300 ease-projects"
                    data-dom="media-group"
                    data-expertise-id="<?= $item["id"] ?>">
                    <?php foreach ($item["projects"] as $link_project): ?>
                        <?php snippet("imagex-picture", [
                            "image" => $link_project["asset"],
                            "attributes" => [
                                "picture" => [
                                    "class" => "col-[1/1] row-[1/1] place-self-stretch relative",
                                ],
                                "img" => [
                                    "shared" => [
                                        "class" =>
                                            "w-full h-full object-contain object-center scale-101 transition duration-400 brightness-80 ease-projects " .
                                            ($item["projects_count"] > 1 ? "opacity-0 scale-99!" : "opacity-100"),
                                        "sizes" => "600px",
                                    ],
                                ],
                            ],
                            "srcset" => "ben-srcset",
                        ]); ?>
                    <?php endforeach; ?>
                </div>
            <?php endforeach; ?>
        </div>

        <?php foreach ($ctaItems as $index => $item): ?>
            <a
                class="expertise-el z-10 cap block uppercase text-[1.3rem] font-bold py-8 md:py-0 transition opacity-0 text-shadow-sm text-gray-text-light md:text-white md:text-shadow-none group-[&.-inview]:opacity-100 group-[&.-inview]:delay-[calc(var(--expertise-index)*55ms+60ms)] ease-projects duration:300 md:duration-500 not-pointer-coarse:group-has-[:hover]:text-gray-text-light not-pointer-coarse:hover:text-white group/link"
                style="--expertise-index:<?= $index ?>;"
                href="<?= $item["url"] ?>"
                data-dom="expertise"
                data-expertise-id="<?= $item["id"] ?>"
                data-expertise-projects="<?= esc($item["projects_encoded"], "html") ?>"
                data-projects-count="<?= $item["projects_count"] ?>">
                <span
                    class="block transform-[translate3d(calc(round(var(--magnetic-x,0),.1)*1px),calc(round(var(--magnetic-y,0),.1)*1px),0)] relative after:absolute after:-inset-3"
                    string="magnetic"
                    string-strength="0.12"
                    string-radius="150"
                    ><?= $item["label"] ?></span>
                <div
                    class="hidden pointer-events-none absolute bottom-0 left-0 w-full h-[33svh] md:grid grid-cols-1 grid-rows-1 place-items-stretch min-w-0 min-h-0 opacity-0 scale-99 transition duration-500 ease-projects group-hover/link:opacity-100 group-hover/link:scale-101"
                    data-dom="desktop-media-group"
                    data-expertise-id="<?= $item["id"] ?>">
                    <?php foreach ($item["projects"] as $index => $link_project): ?>
                        <?php snippet("imagex-picture", [
                            "image" => $link_project["asset"],
                            "attributes" => [
                                "picture" => [
                                    "class" => "col-[1/1] row-[1/1] place-self-stretch relative",
                                ],
                                "img" => [
                                    "shared" => [
                                        "class" =>
                                            "w-full h-full object-contain object-center " .
                                            ($item["projects_count"] > 1
                                                ? " scale-101 opacity-0 scale-99! transition duration-500 ease-projects"
                                                : " opacity-100"), // TODO: handle opacity based on index
                                        "sizes" => "600px",
                                    ],
                                ],
                            ],
                            "srcset" => "ben-srcset",
                        ]); ?>
                    <?php endforeach; ?>
                </div>
            </a>
            <hr
                aria-hidden
                class="w-6 md:hidden block m-3 last-of-type:hidden opacity-0 group-[&.-inview]:opacity-100 duration-500 ease-projects delay-500">
            <span
                aria-hidden
                class="hidden md:block last:hidden opacity-0 group-[&.-inview]:opacity-100 duration-500 ease-projects delay-500">|</span>
        <?php endforeach; ?>
    </div>

    <div
        class="contact mb-20 lg:mb-30 flex justify-center opacity-0 transition-opacity duration-500 ease-projects [&.-inview]:opacity-100"
        string
        string-offset-bottom="-30%">

        <?php if ($site->email()->isNotEmpty()): ?>
            <c-mailto
                class="cta cta-light grid place-items-center w-fit">
                <a
                    data-events-click="handleClick"
                    href="mailto:<?= $site->email() ?>"
                    class="block"><span class=" pointer-events-none">contact</span>
                </a>
            </c-mailto>
        <?php endif; ?>

    </div>

</c-home-expertise>
