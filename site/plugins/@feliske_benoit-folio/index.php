<?php

Kirby::plugin("feliske/benoit-folio", [
    "pageMethods" => [
        "seo" => function () {
            return new Obj([
                // Fallback to the regular page title if the SEO title is empty
                "title" => $this->seoTitle()->isNotEmpty()
                    ? $this->seoTitle()
                    : $this->title(),

                // Return the description field directly
                "description" => $this->seoDescription(),

                // Return the file object (or null if no image was selected)
                "image" => $this->seoImage()->toFile(),
            ]);
        },
    ],
    "fieldMethods" => [
        "splitsubelements" => function (
            $field,
            $tag = "strong",
            $splits_attributes = "",
        ) {
            // Add attributes to strong, em, and a tags (or whichever you need)
            $start_tag_replace = preg_replace(
                ["/<{$tag}>/"],
                ["<split-class {$splits_attributes}>"],
                $field,
            );

            $end_tag_replace = preg_replace(
                ["/<\/{$tag}/"],
                ["</split-class"],
                $start_tag_replace,
            );

            $field->value = $end_tag_replace;
            return $field;
        },
    ],
]);

class CssStyle
{
    public function __construct(public array $properties = []) {}

    public function __toString(): string
    {
        $parts = [];
        foreach ($this->properties as $key => $value) {
            $parts[] = "$key: $value";
        }
        return implode("; ", $parts) . ";";
    }
}
