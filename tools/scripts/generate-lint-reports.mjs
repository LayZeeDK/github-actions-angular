import { execSync } from 'child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import readdirp from 'readdirp';

import { targetsWithBuilder } from './util/targets-with-builder.mjs';
import { validateProjectName } from './util/validate-project-name.mjs';

function generateLintReports() {
  const workspace = JSON.parse(readFileSync("./angular.json").toString());

  mkdirSync("reports/lint", {
    recursive: true,
  });

  targetsWithBuilder(
    "@angular-eslint/builder:lint",
    workspace.projects
  ).forEach(([projectName, targetName]) => {
    validateProjectName(projectName);
    const lintCommand = `yarn ng run ${projectName}:${targetName} --silent --format=json --force > reports/lint/${projectName}-${targetName}.json`;

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
  const normalizedRootPath = normalizePath(process.cwd() + path.sep);
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
