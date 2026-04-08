<?php
// using the `toStructure()` method, we create a structure collection
$items = $page->intro()->toStructure();
// we can then loop through the entries and render the individual fields
foreach ($items as $index => $item):

    $intro_block_id = "into-block-progress" . $index;
    $scenes_count = count($item->scenes()->toStructure());
    $height_class = $scenes_count > 0 ? "min-h-[200vh]" : "";
    $scene_height_multiplicator = $scenes_count ? ($scenes_count < 2 ? 2 : $scenes_count) : 1;
    $style = new CssStyle([
        "--bgc" => $item->background_color()->or("white"),
        "--scenes-count" => $scenes_count,
        "--scenes-height" => "calc($scene_height_multiplicator * 100vh)",
        "--section-index" => $index * 10,
    ]);
    ?>

    <c-home-intro
        class="block bg-(--bgc) sticky top-0 w-full h-(--scenes-height) <?= $height_class ?> object-center object-contain px-[5%] lg:px-[10%] z-(--section-index)"
        string="progress"
        string-key="--home-intro-progress"
        string-id="<?= $intro_block_id ?>"
        <?php if ($index === 0): ?>
        string-offset-bottom="-100%"
        <?php endif; ?>
        <?php if ($item->background_image()->isNotEmpty()): ?>
        string-enter-el="top"
        string-enter-vp="top"
        string-offset-bottom="0%"
        <?php endif; ?>
        string-exit-el="bottom"
        string-exit-vp="bottom"
        style="<?= $style ?>">

        <?php if ($item->background_image()->isNotEmpty() || $item->title()->isNotEmpty()): ?>

            <div class="background-wrapper absolute h-(--scenes-height) w-9/10 lg:w-8/10 ">
                <div
                    data-background
                    class="sticky grid place-items-center z-1 top-0 h-screen w-full left-[5%] lg:left-[10%]">
                    <?php if ($item->background_image()->isNotEmpty()):
                        $background = $item->background_image()->toFile(); ?>

                        <?php snippet("imagex-picture", [
                            "image" => $background,
                            "pictureAttributes" => [
                                "shared" => [
                                    "class" => ["absolute h-full w-full inset-0 z-1 object-contain object-center"],
                                ],
                            ],
                            "imgAttributes" => [
                                "shared" => [
                                    "class" => ["h-full w-full object-contain bg-contain bg-center bg-[var(--bg-image)]"],
                                    "style" => [
                                        new CssStyle([
                                            "--bg-image" => "url(data:{$background->mime()};base64,{$background->thumb([
                                                "width" => 30,
                                                "blur" => true,
                                                "quality" => 50,
                                            ])->base64()})",
                                        ]),
                                    ],
                                    "sizes" => "100vw",
                                    "decoding" => "async",
                                ],
                            ],
                            "sourcesAttributes" => [
                                "shared" => [
                                    "sizes" => "100vw",
                                ],
                            ],
                            "srcsetName" => "ben-srcset",
                        ]); ?>
                    <?php
                    endif; ?>
                    <div class="headings text-center w-full">
                        <?php if ($item->title()->isNotEmpty()): ?>
                            <h1
                                string="split"
                                string-split="char|fit"
                                class="font-extrabold text-[calc(var(--fit-font-size)*1px)]">
                                <?= $item->title()->escape() ?>
                            </h1>
                        <?php endif; ?>
                        <?php if ($item->subtitle()->isNotEmpty()): ?>
                            <h2 class="text-md font-bold">
                                <?= $item->subtitle()->escape() ?>
                            </h2>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <?php
        $scenes = $item->scenes()->toStructure();
        $scenes_count = count($scenes);
        foreach ($scenes as $scene_index => $scene):

            $step = 1 / $scenes_count;
            $part_start = $scene_index * $step;
            $part_end = $scene_index === $scenes_count - 1 ? 1 : ($scene_index + 1) * $step;
            $string_part_of = "{$intro_block_id}[{$part_start}-{$part_end}]";
            $scroll_classes = $scene->scroll_mode() == "normal" ? "sticky w-full" : "fixed w-9/10 lg:w-8/10";
            $animation_classes = "animation-mode-{$scene->animation_mode()}";
            $classes = join(" ", [$scroll_classes, $animation_classes]);
            ?>
            <div
                string="progress-part"
                string-part-of="<?= $string_part_of ?>"
                class="z-10 scene h-screen top-0 aspect-16/9 <?= $classes ?>">

                <?php
                $ftFiles = $scene->images_ft()->toFiles();
                $ftFilesCount = count($ftFiles);
                $fileIndexes = range(1, $ftFilesCount);
                if ($scene->animation_mode() == "random") {
                    shuffle($fileIndexes);
                }
                foreach ($ftFiles as $imageFt): ?>
                    <?php snippet("imagex-picture", [
                        "image" => $imageFt,
                        "pictureAttributes" => [
                            "shared" => [
                                "class" => ["absolute h-full w-full inset-0 z-1 object-contain object-center from-top"],
                                "style" => [
                                    new CssStyle([
                                        "--animation-index" => "{$fileIndexes[$ftFiles->indexOf($imageFt)]}",
                                        "--animation-count" => $ftFilesCount,
                                    ]),
                                ],
                            ],
                        ],
                        "imgAttributes" => [
                            "shared" => [
                                "class" => ["h-full w-full object-contain bg-contain bg-center bg-[var(--bg-image)]"],
                                "style" => [
                                    new CssStyle([
                                        "--bg-image" => "url(data:{$imageFt->mime()};base64,{$imageFt->thumb([
                                            "width" => 30,
                                            "blur" => true,
                                            "quality" => 50,
                                        ])->base64()})",
                                    ]),
                                ],
                                "sizes" => "100vw",
                                "decoding" => "async",
                            ],
                        ],
                        "sourcesAttributes" => [
                            "shared" => [
                                "sizes" => "100vw",
                            ],
                        ],
                        "srcsetName" => "ben-srcset",
                    ]); ?>
                <?php endforeach;
                ?>

                <?php
                $fbFiles = $scene->images_fb()->toFiles();
                $fbFilesCount = count($fbFiles);
                $fileIndexes = range(1, count($fbFiles));
                if ($scene->animation_mode() === "random") {
                    shuffle($fileIndexes);
                }
                foreach ($fbFiles as $imageFb): ?>
                    <?php snippet("imagex-picture", [
                        "image" => $imageFb,
                        "pictureAttributes" => [
                            "shared" => [
                                "class" => ["absolute h-full w-full inset-0 z-2 object-contain object-center from-bottom"],
                                "style" => [
                                    new CssStyle([
                                        "--animation-index" => $fileIndexes[$fbFiles->indexOf($imageFb)],
                                        "--animation-count" => $fbFilesCount,
                                    ]),
                                ],
                            ],
                        ],
                        "imgAttributes" => [
                            "shared" => [
                                "class" => ["h-full w-full object-contain bg-contain bg-center bg-[var(--bg-image)]"],
                                "style" => [
                                    new CssStyle([
                                        "--bg-image" => "url(data:{$imageFb->mime()};base64,{$imageFb->thumb([
                                            "width" => 30,
                                            "blur" => true,
                                            "quality" => 50,
                                        ])->base64()})",
                                    ]),
                                ],
                                "sizes" => "100vw",
                                "decoding" => "async",
                            ],
                        ],
                        "sourcesAttributes" => [
                            "shared" => [
                                "sizes" => "100vw",
                            ],
                        ],
                        "srcsetName" => "ben-srcset",
                    ]); ?>
                <?php endforeach;
                ?>

                <?php
                $imagesFade = $scene->images_fade()->toFiles();
                $imagesFadeCount = count($imagesFade);
                $fileIndexes = range(1, count($imagesFade));
                if ($scene->animation_mode() === "random") {
                    shuffle($fileIndexes);
                }
                foreach ($imagesFade as $imageFade): ?>

                    <?php snippet("imagex-picture", [
                        "image" => $imageFade,
                        "pictureAttributes" => [
                            "shared" => [
                                "class" => ["absolute h-full w-full inset-0 object-contain object-center z-3 from-fade"],
                                "style" => [
                                    new CssStyle([
                                        "--animation-index" => "{$fileIndexes[$imagesFade->indexOf($imageFade)]}",
                                        "--animation-count" => $imagesFadeCount,
                                    ]),
                                ],
                            ],
                        ],
                        "imgAttributes" => [
                            "shared" => [
                                "class" => ["h-full w-full object-contain bg-contain bg-center bg-[var(--bg-image)]"],
                                "style" => [
                                    new CssStyle([
                                        "--bg-image" => "url(data:{$imageFade->mime()};base64,{$imageFade->thumb([
                                            "width" => 30,
                                            "blur" => true,
                                            "quality" => 50,
                                        ])->base64()})",
                                    ]),
                                ],
                                "sizes" => "100vw",
                                "decoding" => "async",
                            ],
                        ],
                        "sourcesAttributes" => [
                            "shared" => [
                                "sizes" => "100vw",
                            ],
                        ],
                        "srcsetName" => "ben-srcset",
                    ]); ?>
                <?php endforeach;
                ?>
            </div>
        <?php
        endforeach;
        ?>
    </c-home-intro>
<?php
endforeach; ?>
