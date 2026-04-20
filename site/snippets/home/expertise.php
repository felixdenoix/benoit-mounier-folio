<c-home-expertise
    log
    class="wrapper w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 min-h-screen text-white">

    <div
        class=" text-gray-text-light text-2xl w-full text-center gap-grid-padding mb-10 md:mb-16 block expertise-title font-bold"
        string="split"
        string-repeat="true"
        string-offset-bottom="-30%"
        string-split="char[random(0,1)]|char-word[random(0,10)]">
        EXPERTISE
    </div>


    <div
        class="animate-opacity flex flex-col md:flex-row gap-y-4 md:gap-unset justify-between items-center w-full mb-10 md:mb-16 text-white group md:pb-[calc(40px+33vh)] relative"
        string
        string-repeat="true"
        string-offset-bottom="-30%">
        <?php foreach ($ctaItems as $index => $item): ?>
            <a
                class="expertise-el cap block uppercase text-[1.3rem] font-bold transition opacity-0 group-[&.-inview]:opacity-100 group-[&.-inview]:delay-[calc(var(--expertise-index)*55ms+60ms)] ease-projects duration-500 not-pointer-coarse:group-has-[:hover]:text-gray-text-light not-pointer-coarse:hover:text-white group/link"
                style="--expertise-index:<?= $index ?>;"
                href="<?= $item["url"] ?>"
                data-dom="expertise"
                data-expertise-id="<?= $item["id"] ?>"
                data-expertise-projects="<?= esc($item["projects_encoded"], "html") ?>"
                data-projects-count="<?= $item["projects_count"] ?>">
                <span class="pointer-events-none"><?= $item["label"] ?></span>
                <div
                    class="pointer-events-none absolute bottom-0 left-0 w-full h-[33vh] grid grid-cols-1 grid-rows-1 place-items-stretch min-w-0 min-h-0 opacity-0 scale-99 transition duration-300 ease-projects group-hover/link:opacity-100 group-hover/link:scale-101"
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
                                            "w-full h-full object-contain object-center " .
                                            ($item["projects_count"] > 1
                                                ? " scale-101 opacity-0 scale-99! transition duration-400 ease-projects"
                                                : " opacity-100"),
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
                class="w-6 md:hidden block m-3 last-of-type:hidden">
            <span
                aria-hidden
                class="hidden md:block last:hidden opacity-0 group-[&.-inview]:opacity-100 duration-500 ease-projects delay-500">|</span>
        <?php endforeach; ?>

    </div>

    <div
        class="contact mb-10 md:mb-20 lg:mb-30 flex justify-center opacity-0 transition-opacity duration-500 ease-projects [&.-inview]:opacity-100"
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
