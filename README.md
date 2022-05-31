<p align="center">
    <img src="https://xylocone.files.wordpress.com/2022/05/logo.png" alt="create-block-theme">
</p>

# create-block-theme

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

- Scaffolds a Wordpress block theme with a single command
- Exposes npm scripts that help in block theme development

## Installation

Install create-block-theme with npm

```bash
  npm install -g @xylocone/create-block-theme
```

## Usage

```bash
create-block-theme <theme-slug>
```

or

```bash
cbt <theme-slug>
```

## Template types

`create-block-theme` currently supports two template types: _plain_ and _tailwind_:

```bash
create-block-theme <theme-slug> --template=<plain|tailwind>
```

If `--template` flag is not passed, the user is prompted to select the template type from a list.

## npm Scripts

The scaffolded theme will have the following npm scripts (that use `@wordpress/scripts` and `@xylocone/block-utils`):

- `start` - Start the development server for blocks in the theme
- `build` - Output an optimized build for blocks in the theme
- `import` - Convert Site-Editor-exported data into the theme
- `import:watch` - Watch zip files and import them into the theme if they contain Site-Editor-exported data
- `add-block` - Add a block to the theme

Run these scripts in the root of your scaffolded theme, with:

```bash
npm run <script-name>
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
