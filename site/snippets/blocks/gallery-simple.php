<?php
/** @var \Kirby\Cms\Block $block */
?>

<div class="gallery-simple overriden">
    <ul class="h-full flex flex-col justify-stretch ">
        <?php foreach ($block->medias()->toFiles() as $image): ?>
            <li class="h-full">
                <?php snippet("imagex-picture", [
                    "image" => $image,
                    "attributes" => [
                        "picture" => [
                            "shared" => [
                                "class" => [" h-full w-full"],
                            ],
                        ],
                        "img" => [
                            "shared" => [
                                "alt" => $image->alt() ?? "",
                                "class" => ["lazy-load object-cover h-full w-full bg-cover bg-center bg-[var(--bg-image)]"],
                                "style" => [
                                    "--bg-image: url(data:{$image->mime()};base64,{$image->thumb([
                                        "width" => 30,
                                        "blur" => true,
                                        "quality" => 50,
                                    ])->base64()});",
                                ],
                                "sizes" => "(40em <= width) 50vw, (width < 40rem) 100vw",
                                "data-dom" => "lazy-media",
                            ],
                        ],
                        "sources" => [
                            "sizes" => "(40em <= width) 50vw, (width < 40rem) 100vw",
                        ],
                    ],
                    "srcset" => "ben-srcset",
                    "loading" => $loading ?? "lazy",
                ]); ?>
            </li>
        <?php endforeach; ?>
    </ul>
</div>
