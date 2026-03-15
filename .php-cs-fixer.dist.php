<?php

declare(strict_types=1);

use PhpCsFixer\Config;
use PhpCsFixer\Finder;

return (new Config())
    ->setRiskyAllowed(false)
    ->setRules([
        '@auto' => true
    ])
    // 💡 by default, Fixer looks for `*.php` files excluding `./vendor/` - here, you can groom this config
    ->setFinder(
        (new Finder())
            // 💡 root folder to check
            ->in(__DIR__)
            ->exclude('vendor')     // Ignore Composer dependencies
            ->exclude('node_modules')
            ->name('*.php')
            // 💡 additional files, eg bin entry file
            ->append([__DIR__.'/kirby/bootstrap.php'])
            // 💡 folders to exclude, if any
            // ->exclude([/* ... */])
            // 💡 path patterns to exclude, if any
            // ->notPath([/* ... */])
            // 💡 extra configs
            ->ignoreDotFiles(false) // true by default in v3, false in v4 or future mode
            ->ignoreVCS(true) // true by default
    )
;


// $finder = PhpCsFixer\Finder::create()
//     ->in(__DIR__)
//     ->exclude('kirby')      // Ignore Kirby core
//     ->exclude('vendor')     // Ignore Composer dependencies
//     ->exclude('node_modules')
//     ->name('*.php')
//     ->ignoreDotFiles(true)
//     ->ignoreVCS(true);

// $config = new PhpCsFixer\Config();
// return $config
//     ->setRules([
//         '@PSR12' => true,                 // Standard PHP rules
//         'array_syntax' => ['syntax' => 'short'],
//         'no_unused_imports' => true,
//         'trailing_comma_in_multiline' => true,
//     ])
//     ->setFinder($finder);
