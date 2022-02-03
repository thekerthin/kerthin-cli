import { classify } from '@angular-devkit/core/src/utils/strings';

export const MESSAGES = {
  NEW_PROJECT_GENERATING_SCAFFOLDING: (_, projectName: string): string =>
    `Generating ${projectName} project scaffolding.\n`,
  NEW_PROJECT_SCAFFOLDING_GENERATED: (_, projectName: string): string =>
    `Project ${projectName} scaffolding generated.`,
  PACKAGE_MANAGER_INSTALLATION_IN_PROGRESS: 'Installing project dependencies.',
  PACKAGE_MANAGER_INSTALLATION_SUCCEED: 'Project dependencies installed.',
  PACKAGE_MANAGER_INSTALLATION_FAILED: 'Failed installing project dependencies.',
  GET_STARTED_INFORMATION: (_, directory: string, packageManager: string): string => {
    const packageManagerRunner = packageManager === 'yarn' ? packageManager : `${packageManager} run`;
    return `
Getting started with the following steps:

$ cd ./${directory}

# development mode
$ ${packageManagerRunner} start

# production mode
$ ${packageManagerRunner} build && ${packageManagerRunner} start-prod`;
  },
  PROJECT_KERTHIN_CONFIG_FILE_NOT_EXIST: 'You must be within a valid kerthin project, the .kerthin.config file not found.',
  MODULE_GENERATING_FILES: 'Generating module files.\n',
  MODULE_FILES_GENERATED: 'Module files generated.',
  VALUE_OBJECT_GENERATING_FILES: 'Generating value object file.\n',
  VALUE_OBJECT_FILES_GENERATED: 'Value object file generated.',
  MODULES_NOT_FOUND: 'There are not modules defined yet.',
  ENTITY_GENERATING_FILES: 'Generating entity file.\n',
  ENTITY_FILES_GENERATED: 'Entity file generated.',
  ENTITY_PROPERTIES_TITLE: (_, entityName: string): string => {
    const title = `${classify(entityName)} Entity Properties`;
    const dashes = [...Array(title.length).keys()].map(() => '-').join('');
    return `----${dashes}----
    ${title}
----${dashes}----`;
  },
  AGGREGATE_GENERATING_FILES: 'Generating aggregate file.\n',
  AGGREGATE_PROPERTIES_TITLE: (_, entityName: string): string => {
    const title = `${classify(entityName)} Aggregate Properties`;
    const dashes = [...Array(title.length).keys()].map(() => '-').join('');
    return `----${dashes}----
    ${title}
----${dashes}----`;
  },
  VALUE_OBJECT_NOT_FOUND: (_, moduleName: string, target: string): string =>
    `The ${moduleName} module has not value objects defined yet. Before to create an ${target} define your set of value objects for the ${moduleName} module.`,
  ENTITY_OR_AGGREGATE_NOT_FOUND: (_, moduleName: string, target: string): string =>
    `The ${moduleName} module has not any entity or aggregate defined yet. Before to create a ${target} define either an entity or an aggregate for the ${moduleName} module.`,
  REPOSITORY_GENERATING_FILES: 'Generating repository file.\n',
  REPOSITORY_FILES_GENERATED: 'Repository file generated.',
  EVENT_GENERATING_FILES: 'Generating event file.\n',
  EVENT_FILES_GENERATED: 'Event file generated.',
};
