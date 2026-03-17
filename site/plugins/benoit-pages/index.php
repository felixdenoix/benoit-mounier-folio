<?php

Kirby::plugin('felix-denoix/benoit-pages', [
    'pageMethods' => [
        'seo' => function () {
            return new Obj([
                // Fallback to the regular page title if the SEO title is empty
                'title' => $this->seoTitle()->isNotEmpty()
                            ? $this->seoTitle()
                            : $this->title(),

                // Return the description field directly
                'description' => $this->seoDescription(),

                // Return the file object (or null if no image was selected)
                'image' => $this->seoImage()->toFile()
            ]);
        }
    ]
]);
