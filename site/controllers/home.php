<?php

return function ($page) {
    // 1. Resolve Expertise links (Random project for each call to action)
    $ctaItems = [];
    foreach ($page->callToAction()->toStructure() as $item) {
        $project = $item->projects()->toPages()->shuffle()->first();

        $projects = [];
        foreach ($item->projects()->toPages() as $p) {
            $firstAsset = $p
                ->medias()
                ->toLayouts()
                ->toBlocks()
                ->filterBy("type", "gallery-simple")
                ->first()
                ?->medias()
                ->toFiles()
                ->first();

            array_push($projects, [
                "url" => $p ? $p->url() : "#",
                "asset" => $firstAsset,
            ]);
        }

        $ctaItems[] = [
            "label" => $item->label(),
            "url" => $project ? $project->url() : "#",
            "projects" => $projects,
            "id" => rand(),
        ];
    }

    // 2. Prepare Intro Scenes data
    $introItems = [];
    $introIndex = 0;
    foreach ($page->intro()->toStructure() as $item) {
        $scenes = $item->scenes()->toStructure();
        $scenesCount = $scenes->count();
        $sceneHeightMultiplicator = $scenesCount ? ($scenesCount < 2 ? 2 : $scenesCount) : 1;

        // Background Image LQIP
        $backgroundImage = $item->background_image()->toFile();
        $backgroundLqip = null;
        if ($backgroundImage) {
            $backgroundLqip =
                "url(data:{$backgroundImage->mime()};base64," .
                $backgroundImage
                    ->thumb([
                        "width" => 30,
                        "blur" => true,
                        "quality" => 50,
                    ])
                    ->base64() .
                ")";
        }

        $processedScenes = [];
        $sceneIndex = 0;
        foreach ($scenes as $scene) {
            $step = 1 / $scenesCount;
            $partStart = $sceneIndex * $step;
            $partEnd = $sceneIndex === $scenesCount - 1 ? 1 : ($sceneIndex + 1) * $step;

            $introBlockId = "into-block-progress" . $introIndex;
            $stringPartOf = "{$introBlockId}[{$partStart}-{$partEnd}]";

            $scrollClasses = $scene->scroll_mode() == "normal" ? "" : "bottom-0";
            $animationClasses = "animation-mode-{$scene->animation_mode()}";

            // Process scene images for LQIP
            $processImages = function ($filesField, $animationMode) {
                $files = $filesField->toFiles();
                $count = $files->count();
                $indexes = range(1, $count);
                if ($animationMode === "random") {
                    shuffle($indexes);
                }

                $results = [];
                $fIndex = 0;
                foreach ($files as $file) {
                    $results[] = [
                        "file" => $file,
                        "lqip" =>
                            "url(data:{$file->mime()};base64," .
                            $file
                                ->thumb([
                                    "width" => 30,
                                    "blur" => true,
                                    "quality" => 50,
                                ])
                                ->base64() .
                            ")",
                        "animationIndex" => $indexes[$fIndex],
                        "animationCount" => $count,
                    ];
                    $fIndex++;
                }
                return $results;
            };

            $processedScenes[] = [
                "data" => $scene,
                "stringPartOf" => $stringPartOf,
                "classes" => $scrollClasses . " " . $animationClasses,
                "index" => $sceneIndex,
                "imagesFt" => $processImages($scene->images_ft(), $scene->animation_mode()),
                "imagesFb" => $processImages($scene->images_fb(), $scene->animation_mode()),
                "imagesFade" => $processImages($scene->images_fade(), $scene->animation_mode()),
            ];
            $sceneIndex++;
        }

        $introItems[] = [
            "data" => $item,
            "index" => $introIndex,
            "scenesCount" => $scenesCount,
            "processedScenes" => $processedScenes,
            "heightClass" => $scenesCount > 0 ? "min-h-[200vh]" : "",
            "sceneHeightMultiplicator" => $sceneHeightMultiplicator,
            "introBlockId" => "into-block-progress" . $introIndex,
            "background" => $backgroundImage,
            "backgroundLqip" => $backgroundLqip,
        ];
        $introIndex++;
    }

    return [
        "ctaItems" => $ctaItems,
        "introItems" => $introItems,
    ];
};
