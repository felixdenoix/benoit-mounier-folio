<?php

/**
 * The config file is optional. It accepts a return array with config options
 * Note: Never include more than one return statement, all options go within this single return array
 * In this example, we set debugging to true, so that errors are displayed onscreen.
 * This setting must be set to false in production.
 * All config options: https://getkirby.com/docs/reference/system/options
 */
return [
    'debug' => true,
    'yaml.handler' => 'symfony', // already makes use of the more modern Symfony YAML parser: https://getkirby.com/docs/reference/system/options/yaml (will become the default in a future Kirby version)
    'timnarr.imagex' => [
      'cache' => true,
      'compareFormatsWeights' => 'balanced',
      'customLazyloading' => false,
      'formats' => ['avif', 'webp'],
      'includeInitialFormat' => false,
      'noSrcsetInImg' => false,
      'relativeUrls' => false,
    ], // https://github.com/timnarr/kirby-imagex?tab=readme-ov-file#global-options
    'thumbs' => [
        'srcsets' => [
            'default' => [
                '800w' => ['width' => 800, 'quality' => 80],
                '1024w' => ['width' => 1024, 'quality' => 80],
                '1440w' => ['width' => 1440, 'quality' => 80],
            ],
            'default-webp' => [
                '800w' => ['width' => 800, 'quality' => 75, 'format' => 'webp', 'sharpen' => 10],
                '1024w' => ['width' => 1024, 'quality' => 75, 'format' => 'webp', 'sharpen' => 10],
                '1440w' => ['width' => 1440, 'quality' => 75, 'format' => 'webp', 'sharpen' => 10],
            ],
            'default-avif' => [
                '800w' => ['width' => 800, 'quality' => 65, 'format' => 'avif', 'sharpen' => 25],
                '1024w' => ['width' => 1024, 'quality' => 65, 'format' => 'avif', 'sharpen' => 25],
                '1440w' => ['width' => 1440, 'quality' => 65, 'format' => 'avif', 'sharpen' => 25],
            ],
            'ben-srcset' => [ // preset for jpeg and png
                '400w'  => ['width' =>  400, 'crop' => true, 'quality' => 80],
                '800w'  => ['width' =>  800, 'crop' => true, 'quality' => 80],
                '1200w' => ['width' => 1200, 'crop' => true, 'quality' => 80],
                '1440w' => ['width' => 1440, 'crop' => true, 'quality' => 80],
                '2048w' => ['width' => 2048, 'crop' => true, 'quality' => 80],
            ],
            'ben-srcset-webp' => [ // preset for webp
                '400w'  => ['width' =>  400, 'crop' => true, 'quality' => 75, 'format' => 'webp', 'sharpen' => 10],
                '800w'  => ['width' =>  800, 'crop' => true, 'quality' => 75, 'format' => 'webp', 'sharpen' => 10],
                '1200w' => ['width' => 1200, 'crop' => true, 'quality' => 75, 'format' => 'webp', 'sharpen' => 10],
                '1440w' => ['width' => 1440, 'crop' => true, 'quality' => 75, 'format' => 'webp', 'sharpen' => 10],
                '2048w' => ['width' => 2048, 'crop' => true, 'quality' => 75, 'format' => 'webp', 'sharpen' => 10],
            ],
            'ben-srcset-avif' => [ // preset for avif
                '400w'  => ['width' =>  400, 'crop' => true, 'quality' => 65, 'format' => 'avif', 'sharpen' => 25],
                '800w'  => ['width' =>  800, 'crop' => true, 'quality' => 65, 'format' => 'avif', 'sharpen' => 25],
                '1200w' => ['width' => 1200, 'crop' => true, 'quality' => 65, 'format' => 'avif', 'sharpen' => 25],
                '1440w' => ['width' => 1440, 'crop' => true, 'quality' => 65, 'format' => 'avif', 'sharpen' => 25],
                '2048w' => ['width' => 2048, 'crop' => true, 'quality' => 65, 'format' => 'avif', 'sharpen' => 25],
            ],
        ],
    ],
];
