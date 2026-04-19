<div class="wrapper w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 min-h-screen text-white">
  <div class="flex text-white text-lg w-full items-center gap-grid-padding mb-10 md:mb-16">
    <hr class="bg-white w-full block from-left">
    <span class="animate-opacity">EXPERTISE</span>
    <hr class="text-white w-full block from-right">
  </div>

  <!--TODO: extact to snipet et tout-->
  <div class="animate-opacity delay-750! flex flex-col lg:flex-row gap-4 lg:gap-unset justify-between items-center w-full mb-10 md:mb-16 text-white group">
    <?php foreach ($ctaItems as $item): ?>

      <a
        class="text cap block uppercase text-[1.3rem] text-bold decoration-1 underline transition-[text-decoration-color] ease-projects underline-offset-4 duration-500 not-pointer-coarse:group-has-[:hover]:decoration-transparent not-pointer-coarse:hover:decoration-inherit"
        href="<?= $item["url"] ?>"
        data-expertise-id="<?= $item["id"] ?>"
        data-projects="<?= json_encode($item["projects"]) ?>"
      >
        <?= $item["label"] ?>
      </a>
      <hr
        aria-hidden
        class="w-6 lg:hidden block m-3 last-of-type:hidden">
      <span
        aria-hidden
        class="hidden lg:block last:hidden">|</span>
    <?php endforeach; ?>
  </div>

  <div class="animate-opacity delay-1000! w-full h-[calc(100vh/3)] bdr grid place-items-stretch mb-10 md:mb-16">

      <?php foreach ($ctaItems as $item): ?>

        <div
            class="col-[1/1] bdg h-full w-full row-[1/1] relative
            grid grid-cols-1 grid-rows-1 place-items-stretch min-w-0 min-h-0
            opacity-0"
            data-expertise-id="<?= $item["id"] ?>"
        >
            <?php foreach ($item["projects"] as $link_project): ?>
                <?php snippet("imagex-picture", [
                    "image" => $link_project["asset"],
                    "attributes" => [
                        "picture" => [
                            "class" => "col-[1/1] row-[1/1] place-self-stretch relative",
                        ],
                        "img" => [
                            "class" => "w-full h-full object-contain object-center",
                        ],
                    ],
                    "srcset" => "ben-srcset",
                ]); ?>
            <?php endforeach; ?>
        </div>

      <?php endforeach; ?>

  </div>

  <div class="animate-opacity delay-1250! contact mb-10 md:mb-20 lg:mb-30 flex justify-center">

    <?php if ($site->email()->isNotEmpty()): ?>
    <c-mailto
      class="cta cta-light grid place-items-center w-fit">
      <a
        data-events-click="handleClick"
        href="mailto:<?= $site->email() ?>"
        class="block"><span class=" pointer-events-none">contact</span>
      </a>
    </c-mailto>
    <?php endif; ?>

  </div>
</div>
