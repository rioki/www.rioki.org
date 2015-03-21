var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders with the require-dir library (allows us to build a modular gulp)
requireDir('./gulp/tasks', { recurse: true });
