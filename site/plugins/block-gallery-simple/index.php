<?php

Kirby::plugin('felix-denoix/block-gallery-simple', [
    'blueprints' => [
        'blocks/gallery-simple' => __DIR__ . '/blueprints/blocks/gallery-simple.yml',
        'blocks/gallery-title' => __DIR__ . '/blueprints/blocks/gallery-title.yml',
        'files/image' => __DIR__ . '/blueprints/files/image.yml'
    ],
    'snippets' => [
        'blocks/gallery-simple' => __DIR__ . '/snippets/blocks/gallery-simple.php',
        'blocks/gallery-title' => __DIR__ . '/snippets/blocks/gallery-title.php'
    ]
]);
