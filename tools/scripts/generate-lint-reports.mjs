import { execSync } from 'child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import readdirp from 'readdirp';

import { validateProjectName } from './util/validate-project-name.mjs';

function generateLintReports() {
  const workspace = JSON.parse(readFileSync("./angular.json").toString());

  const hasLint = (project) => project.architect.lint;

  mkdirSync("reports/lint", {
    recursive: true,
  });

  Object.entries(workspace.projects)
    .filter(([_projectName, project]) => hasLint(project))
    .map(([projectName]) => projectName)
    .forEach((projectName) => {
      validateProjectName(projectName);
      const lintCommand = `ng lint ${projectName} --silent --format=json --force > reports/lint/${projectName}.json`;

      console.log(`> ${lintCommand}`);
      execSync(lintCommand, {
        stdio: "inherit",
      });
    });
}

function normalizePath(path, separator = path.sep) {
  return path.replace(/[\\\/]/g, separator);
}

async function sanitizeLintReports() {
  const normalizedRootPath = normalizePath(process.cwd() + path.sep, path.sep);
  const lintReportsPath = path.join("reports", "lint");

  for await (const { path: fileName } of readdirp(lintReportsPath)) {
    const reportPath = path.join(lintReportsPath, fileName);

    const lintReport = JSON.parse(readFileSync(reportPath).toString());

    const sanitizedlintReport = lintReport.map((reportItem) => ({
      ...reportItem,
      filePath: normalizePath(
        reportItem.filePath.replace(normalizedRootPath, ""),
        "/"
      ),
    }));

    writeFileSync(reportPath, JSON.stringify(sanitizedlintReport));
  }
}

(async () => {
  generateLintReports();
  await sanitizeLintReports();
})();
