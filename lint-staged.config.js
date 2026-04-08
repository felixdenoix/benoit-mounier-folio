import path from "node:path";

export default {
  // 1. Format JS using your existing oxfmt setup
  "*.{js,ts,mjs,cjs}": "oxfmt",

  // 2. Format YAML (Kirby Blueprints, Configs) using Prettier
  "*.{yml,yaml,php}": "prettier --write",

  // 3. Format PHP using PHP-CS-Fixer via DDEV
  "*.php": (absolutePaths) => {
    const cwd = process.cwd();

    // Convert host absolute paths to relative paths for the DDEV container
    const relativePaths = absolutePaths
      .map((file) => path.relative(cwd, file))
      .map((file) => `"${file}"`) // Wrap in quotes for safety
      .join(" ");

    // Pass the relative paths to PHP-CS-Fixer inside the DDEV container
    return `ddev exec vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.dist.php --path-mode=intersection ${relativePaths}`;
  },
};
