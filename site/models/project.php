<?php

use Kirby\Cms\Page;

class ProjectPage extends Page
{
    public function cover()
    {
        return $this->content()->cover()->toFile();
    }
}
