<?php
// We now receive $introItems from the home controller, which contains all pre-processed data
foreach ($introItems as $introItem):

    $sceneData = $introItem["data"];
    $intro_block_id = $introItem["introBlockId"];
    $scenes_count = $introItem["scenesCount"];
    $height_class = $introItem["heightClass"];
    $scene_height_multiplicator = $introItem["sceneHeightMultiplicator"];

    // Preparation of styles
    $style = new CssStyle([
        "--bgc" => $sceneData->background_color()->or("white"),
        "--scenes-count" => $scenes_count,
        "--scenes-height" => "calc($scene_height_multiplicator * 100lvh)",
        "--section-index" => $introItem["index"] * 10,
    ]);
    ?>

    <div
        class="c-home-intro block relative bg-(--bgc) w-full h-(--scenes-height) <?= $height_class ?> object-center object-contain px-[5%] lg:px-[10%] z-(--section-index) contain-[layout_paint]"
        string="progress"
        string-key="--home-intro-progress"
        string-id="<?= $intro_block_id ?>"
        <?php if ($introItem["index"] === 0): ?>
        string-offset-bottom="-100%"
        <?php elseif ($introItem["background"]): ?>
        string-enter-el="top"
        string-enter-vp="top"
        string-offset-bottom="0%"
        <?php endif; ?>
        string-exit-el="bottom"
        string-exit-vp="bottom"
        style="<?= $style ?>">

        <?php if ($introItem["background"] || $sceneData->title()->isNotEmpty()): ?>

            <div class="background-wrapper overflow-clip absolute h-(--scenes-height) w-9/10 lg:w-8/10 ">
                <div
                    data-background
                    class="sticky grid place-items-center z-1 top-0 h-lvh w-full left-[5%] lg:left-[10%]">
                    <?php if ($introItem["background"]): ?>

                        <?php snippet("imagex-picture", [
                            "image" => $introItem["background"],
                            "attributes" => [
                                "picture" => [
                                    "shared" => [
                                        "class" => "absolute h-lvh w-full inset-0 z-1 object-contain object-center",
                                    ],
                                ],
                                "img" => [
                                    "shared" => [
                                        "alt" => $introItem["background"]->alt() ?? "",
                                        "class" => "h-full w-full object-contain",
                                        "sizes" => "(min-width: 1024px) 80vw, 30vw",
                                    ],
                                ],
                                "sources" => [
                                    "shared" => [
                                        "sizes" => "(min-width: 1024px) 80vw, 30vw",
                                    ],
                                ],
                            ],
                            "srcset" => "ben-srcset",
                        ]); ?>
                    <?php endif; ?>
                    <div class="headings text-center w-full">
                        <?php if ($sceneData->title()->isNotEmpty()): ?>
                            <h1
                                string="split"
                                string-split="char|fit"
                                class="font-extrabold text-[calc(var(--fit-font-size)*1px)]">
                                <?= $sceneData->title()->escape() ?>
                            </h1>
                        <?php endif; ?>
                        <?php if ($sceneData->subtitle()->isNotEmpty()): ?>
                            <h2 class="text-md font-bold">
                                <?= $sceneData->subtitle()->escape() ?>
                            </h2>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <?php foreach ($introItem["processedScenes"] as $scene):

            $sceneData = $scene["data"];
            $scene_index = $scene["index"];
            ?>
            <div
                string="progress-part"
                string-part-of="<?= $scene["stringPartOf"] ?>"
                class="z-10 scene top-0 sticky h-lvh w-full <?= $scene["classes"] ?>">

                <?php foreach ($scene["imagesFt"] as $img): ?>

                    <!--<img
                        src="<?= $img["file"]->resize(400)->url() ?>"
                        class="absolute md:hidden h-lvh w-full inset-0 z-1 object-contain object-center from-top"
                        style="<?= new CssStyle([
                            "--speed" => $img["speed"],
                            "--start-y" => $img["startY"],
                        ]) ?>" />-->
                    <!--
                    -->
                    <?php snippet("imagex-picture", [
                        "image" => $img["file"],
                        "attributes" => [
                            "picture" => [
                                "shared" => [
                                    "class" => ["absolute h-lvh w-full inset-0 z-1 object-contain object-center from-top"],
                                    "style" => [
                                        new CssStyle([
                                            "--speed" => $img["speed"],
                                            "--start-y" => $img["startY"],
                                        ]),
                                    ],
                                ],
                            ],
                            "img" => [
                                "shared" => [
                                    "alt" => $img["file"]->alt() ?? "",
                                    "class" => ["h-full w-full object-contain"],
                                    "sizes" => "(min-width: 1024px) 80vw, 30vw",
                                    "decoding" => "async",
                                ],
                            ],
                            "sources" => [
                                "shared" => [
                                    "sizes" => "(min-width: 1024px) 80vw, 30vw",
                                ],
                            ],
                        ],
                        "srcset" => "ben-srcset",
                        "loading" => $scene_index === 0 ? "eager" : "lazy",
                    ]); ?>
                <?php endforeach; ?>

                <?php foreach ($scene["imagesFb"] as $img): ?>
                    <!--<img
                        src="<?= $img["file"]->resize(400)->url() ?>"
                        class="md:hidden absolute h-lvh w-full inset-0 z-2 object-contain object-center from-bottom"
                        style="<?= new CssStyle([
                            "--speed" => $img["speed"],
                            "--start-y" => $img["startY"],
                        ]) ?>" />-->
                    <?php snippet("imagex-picture", [
                        "image" => $img["file"],
                        "attributes" => [
                            "picture" => [
                                "shared" => [
                                    "class" => ["absolute h-lvh w-full inset-0 z-2 object-contain object-center from-bottom"],
                                    "style" => [
                                        new CssStyle([
                                            "--speed" => $img["speed"],
                                            "--start-y" => $img["startY"],
                                        ]),
                                    ],
                                ],
                            ],
                            "img" => [
                                "shared" => [
                                    "alt" => $img["file"]->alt() ?? "",
                                    "class" => ["h-full w-full object-contain"],
                                    "sizes" => "(min-width: 1024px) 80vw, 30vw",
                                    "decoding" => "async",
                                ],
                            ],
                            "sources" => [
                                "shared" => [
                                    "sizes" => "(min-width: 1024px) 80vw, 30vw",
                                ],
                            ],
                        ],
                        "srcset" => "ben-srcset",
                        "loading" => $scene_index === 0 ? "eager" : "lazy",
                    ]); ?>
                <?php endforeach; ?>

                <?php foreach ($scene["imagesFade"] as $img): ?>
                    <!--<img
                        src="<?= $img["file"]->resize(400)->url() ?>"
                        class="md:hidden absolute bottom-0 h-lvh w-full object-contain object-center z-3 from-fade"
                        style="<?= new CssStyle([
                            "--speed" => $img["speed"],
                            "--start-y" => $img["startY"],
                        ]) ?>" />-->

                    <?php snippet("imagex-picture", [
                        "image" => $img["file"],
                        "attributes" => [
                            "picture" => [
                                "shared" => [
                                    "class" => ["absolute bottom-0 h-lvh w-full object-contain object-center z-3 from-fade"],
                                    "style" => [
                                        new CssStyle([
                                            "--speed" => $img["speed"],
                                            "--start-y" => $img["startY"],
                                        ]),
                                    ],
                                ],
                            ],
                            "img" => [
                                "shared" => [
                                    "alt" => $img["file"]->alt() ?? "",
                                    "class" => ["h-lvh w-full object-contain"],
                                    "sizes" => "(min-width: 1024px) 80vw, 30vw",
                                    "decoding" => "async",
                                ],
                            ],
                            "sources" => [
                                "shared" => [
                                    "sizes" => "(min-width: 1024px) 80vw, 30vw",
                                ],
                            ],
                        ],
                        "srcset" => "ben-srcset",
                        "loading" => $scene_index === 0 ? "eager" : "lazy",
                    ]); ?>
                <?php endforeach; ?>

            </div>
        <?php
        endforeach; ?>
    </div>
<?php
endforeach; ?>
