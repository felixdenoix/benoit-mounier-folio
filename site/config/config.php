<?php

/**
 * The config file is optional. It accepts a return array with config options
 * Note: Never include more than one return statement, all options go within this single return array
 * In this example, we set debugging to true, so that errors are displayed onscreen.
 * This setting must be set to false in production.
 * All config options: https://getkirby.com/docs/reference/system/options
 */

// =============================================
// START: Preserve protocol for localhost access

// 1. Get the host and port exactly as requested by the browser
$host = $_SERVER["HTTP_HOST"] ?? "benoit-mounier-folio.ddev.site";

// 2. Determine if the request is HTTP or HTTPS
$isSecure = false;
if (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] === "on") {
    $isSecure = true;
} elseif (isset($_SERVER["HTTP_X_FORWARDED_PROTO"]) && $_SERVER["HTTP_X_FORWARDED_PROTO"] === "https") {
    $isSecure = true;
}

$protocol = $isSecure ? "https" : "http";

$dynamicUrl = $protocol . "://" . $host;

// END: Preserve protocol for localhost access
// ===========================================

return [
    // Tell Kirby to use our dynamically calculated URL
    "url" => $dynamicUrl,
    "debug" => true,
    "yaml.handler" => "symfony", // already makes use of the more modern Symfony YAML parser: https://getkirby.com/docs/reference/system/options/yaml (will become the default in a future Kirby version)
    "afbora.kirby-minify-html" => [
        "enabled" => false,
    ], // https://github.com/afbora/kirby-minify-html?tab=readme-ov-file#available-minify-options
    "timnarr.imagex" => [
        "cache" => true,
        "compareFormatsWeights" => "balanced",
        "formats" => ["avif", "webp"],
        "noSrcsetInImg" => true,
    ], // https://github.com/timnarr/kirby-imagex?tab=readme-ov-file#global-options
    "thumbs" => [
        "srcsets" => [
            "default" => [
                "800w" => ["width" => 800, "quality" => 80],
                "1024w" => ["width" => 1024, "quality" => 80],
                "1440w" => ["width" => 1440, "quality" => 80],
            ],
            "default-webp" => [
                "800w" => [
                    "width" => 800,
                    "quality" => 75,
                    "format" => "webp",
                    "sharpen" => 10,
                ],
                "1024w" => [
                    "width" => 1024,
                    "quality" => 75,
                    "format" => "webp",
                    "sharpen" => 10,
                ],
                "1440w" => [
                    "width" => 1440,
                    "quality" => 75,
                    "format" => "webp",
                    "sharpen" => 10,
                ],
            ],
            "default-avif" => [
                "800w" => [
                    "width" => 800,
                    "quality" => 65,
                    "format" => "avif",
                    "sharpen" => 25,
                ],
                "1024w" => [
                    "width" => 1024,
                    "quality" => 65,
                    "format" => "avif",
                    "sharpen" => 25,
                ],
                "1440w" => [
                    "width" => 1440,
                    "quality" => 65,
                    "format" => "avif",
                    "sharpen" => 25,
                ],
            ],
            "ben-srcset" => [
                // preset for jpeg and png
                "400w" => ["width" => 400, "crop" => true, "quality" => 80],
                "800w" => ["width" => 800, "crop" => true, "quality" => 80],
                "1200w" => ["width" => 1200, "crop" => true, "quality" => 80],
                "1440w" => ["width" => 1440, "crop" => true, "quality" => 80],
            ],
            "ben-srcset-webp" => [
                // preset for webp
                "400w" => [
                    "width" => 400,
                    "crop" => true,
                    "quality" => 75,
                    "format" => "webp",
                    "sharpen" => 10,
                ],
                "800w" => [
                    "width" => 800,
                    "crop" => true,
                    "quality" => 75,
                    "format" => "webp",
                    "sharpen" => 10,
                ],
                "1200w" => [
                    "width" => 1200,
                    "crop" => true,
                    "quality" => 75,
                    "format" => "webp",
                    "sharpen" => 10,
                ],
                "1440w" => [
                    "width" => 1440,
                    "crop" => true,
                    "quality" => 75,
                    "format" => "webp",
                    "sharpen" => 10,
                ],
            ],
            "ben-srcset-avif" => [
                // preset for avif
                "400w" => [
                    "width" => 400,
                    "crop" => true,
                    "quality" => 65,
                    "format" => "avif",
                    "sharpen" => 25,
                ],
                "800w" => [
                    "width" => 800,
                    "crop" => true,
                    "quality" => 65,
                    "format" => "avif",
                    "sharpen" => 25,
                ],
                "1200w" => [
                    "width" => 1200,
                    "crop" => true,
                    "quality" => 65,
                    "format" => "avif",
                    "sharpen" => 25,
                ],
                "1440w" => [
                    "width" => 1440,
                    "crop" => true,
                    "quality" => 65,
                    "format" => "avif",
                    "sharpen" => 25,
                ],
            ],
        ],
    ],
    "hooks" => [
        "route:after" => function ($route, $path, $method, $result, $final) {
            if ($final === true && $result instanceof Kirby\Cms\Page && $result->template()->name() !== "error") {
                $crawlerDetect = new Jaybizzle\CrawlerDetect\CrawlerDetect();

                if ($crawlerDetect->isCrawler()) {
                    // Manually trigger render (will pull from cache if active)
                    $html = $result->render();

                    // Post-process the HTML
                    // 1. Remove the loader div and its contents
                    // Regex handles the div with id="site-loader" and its immediate closing tags
                    $html = preg_replace('/<div id="site-loader"[^>]*>.*?<\/div>\s*<\/div>/s', "", $html);

                    // 2. Unlock body scrolling by removing the inline style typically used with loaders
                    $html = str_replace('style="overflow: hidden;"', "", $html);

                    // Return a modified response instead of the Page object
                    return $this->response()->body($html);
                }
            }
            return $result;
        },
    ],
    "routes" => [
        [
            "pattern" => "clear-my-cache-pretty-please/(:any)",
            "method" => "POST",
            "action" => function ($token) {
                $secret = option("deploy_token");

                if (empty($secret) === false && $token === $secret) {
                    kirby()->cache("pages")->flush();
                    return [
                        "status" => 200,
                        "message" => "Cache cleared",
                    ];
                }

                return [
                    "status" => 403,
                    "message" => "Forbidden",
                ];
            },
        ],
    ],
];
