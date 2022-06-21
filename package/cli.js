import {
  resolve,
  join,
  relative
} from "path";
import {
  rename,
  copyFile,
  mkdir
} from "fs/promises";
import url from "url";
import {
  execaCommand
} from "execa";
import Scaffold from "scaffold-generator";
import mustache from "mustache";
import {
  capitalCase
} from "change-case";
import {
  Listr
} from "listr2";
import yargs from "yargs";
import {
  walk
} from "@root/walk";

// Internal dependencies
import {
  askQuestions
} from "./utils/askQuestions.js";
import {
  askUntilAnswered
} from "./utils/askUntilAnswered.js";
import {
  success,
  error,
  warning
} from "./utils/inform.js";

const ALLOWED_TEMPLATE_TYPES = ["plain", "tailwind"];

const defaultOptions = {
  author: "",
  templateType: "plain",
};

let options = {};

/**
 * Process the command line arguments and scaffold a block theme accordingly
 * @param {Array} args Command line arguments
 */
export async function cli(args) {
  const tasks = [{
      title: "Copying template files",
      task: async () => await copyTemplateFiles(),
    },
    {
      title: "Initializing git repo",
      task: async () => await initGitRepo(),
    },
    {
      title: "Installing dependencies",
      task: async () => await installDependencies(),
    },
  ];

  const listr = new Listr(tasks, {
    concurrent: false
  });

  try {
    const parsedArgs = yargs(args).argv;
    await assignOptions(parsedArgs);
    await listr.run();

    success("Theme set-up done. Happy Coding!");
  } catch (e) {
    error("There was an error while setting up the theme.");
    console.trace(e);
  }
}

/**
 * Using command line arguments and prompting user to give input, map input to options
 * @param {array} args Command line arguments parsed by yargs
 */
async function assignOptions(args) {
  options.slug =
    args._[0] ||
    (await askUntilAnswered({
      name: "slug",
      message: "Theme Slug: ",
    }));

  const questions = [{
      name: "title",
      message: "Theme Title: ",
      default: capitalCase(options.slug),
    },
    {
      name: "author",
      message: "Author: ",
      default: defaultOptions.author,
    },
  ];

  if (!args.template) {
    // if the user has not passed a flag for template, ask for the template type
    questions.push({
      name: "templateType",
      message: "Template Type: ",
      type: "list",
      choices: ALLOWED_TEMPLATE_TYPES,
      default: defaultOptions.templateType,
    });
  } else {
    options.templateType = args.template;
  }

  const answers = await askQuestions(questions);

  // For each defaultOption, if the corresponding answer is empty, use the defaultOption
  // and override the result with the values already existing in options
  options = Object.assign({},
    ...Object.keys(defaultOptions).map((key) => ({
      [key]: answers[key] || defaultOptions[key],
    })),
    options
  );
}

/**
 * Copy template files from the ./package/template dir into <calling process' cwd>
 */
async function copyTemplateFiles() {
  let templateDir = getTemplateDirectory(options.templateType);
  let targetDir = join(process.cwd(), options.slug);

  await walk(templateDir, async (err, absPath, item) => {
    let relativePath = relative(templateDir, absPath);

    if (err) {
      error("Could not copy template files.");
      throw err;
    }

    const scaffold = new Scaffold({
      data: options,
      render: mustache.render,
    });

    if (item.isDirectory() && relativePath != "") {
      await mkdir(join(targetDir, relativePath));
    } else if (item.isFile()) {
      if (item.name.endsWith(".mustache"))
        await scaffold.copy(absPath, join(targetDir, relativePath));
      else await copyFile(absPath, join(targetDir, relativePath));
    }
  });

  await renameCopiedFiles();
}

/**
 * Rename the copied template files by stripping away their ending .mustache extension
 */
async function renameCopiedFiles() {
  const targetDir = join(process.cwd(), options.slug);

  await walk(targetDir, async (err, absPath, item) => {
    if (err) {
      error("Could not rename copied template files.");
      throw err;
    }

    let newPath = absPath.replace(/(.+)\.mustache$/, "$1");
    await rename(absPath, newPath);
  });
}

/**
 * Initialize an empty git repository in the process' cwd
 */
async function initGitRepo() {
  await execaCommand("git init", {
    cwd: resolve(process.cwd(), options.slug)
  });
}

/**
 * Install all the dependencies and devDependencies listed in the copied template's package.json
 */
async function installDependencies() {
  await execaCommand("npm install", {
    cwd: resolve(process.cwd(), options.slug),
  });
}

/**
 * Get template directory path for the given template type
 * @param {String} templateType Type of the template
 * @returns Path of the template directory
 */
function getTemplateDirectory(templateType) {
  if (!ALLOWED_TEMPLATE_TYPES.includes(templateType)) {
    warning("%s is not a valid template type. Defaulting to %s", [
      templateType,
      "plain",
    ]);
    templateType = "plain";
  }
  return resolve(
    url.fileURLToPath(
      import.meta.url),
    `../templates/${templateType}`
  );
}