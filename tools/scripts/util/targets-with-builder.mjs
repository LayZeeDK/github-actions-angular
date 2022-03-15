export function targetsWithBuilder(builderName, projects) {
  return Object.entries(projects).flatMap(([projectName, project]) =>
    Object.entries(project.architect)
      .filter(([_targetName, target]) => target.builder === builderName)
      .map(([targetName]) => [projectName, targetName])
  );
}
