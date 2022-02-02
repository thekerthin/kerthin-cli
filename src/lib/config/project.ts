import { isNotEmptyOrNil } from '@kerthin/utils';
import * as glob from 'glob';
import { basename, resolve, parse } from 'path';
import { existsSync } from 'fs';
import { Project as ProjectMorph } from 'ts-morph';
import { KERTHIN_CONFIG_FILE_NAME, PROJECT_LOCAL_PATH } from '../ui/constants';
import { MESSAGES } from '../ui/messages';

export class Project {

  static getProjectFolderPath(): string {
    return resolve(process.cwd(), 'example');
  }

  static isValidProject(): void {
    const kerthinConfigFileName = resolve(
      PROJECT_LOCAL_PATH, KERTHIN_CONFIG_FILE_NAME
    );

    const isValidProject = existsSync(kerthinConfigFileName);

    if (isValidProject) return;

    throw new Error(MESSAGES.PROJECT_KERTHIN_CONFIG_FILE_NOT_EXIST);
  }

  static isThereAtLeastOneModule(): void {
    const modules = Project.getModules();
    if (modules.length === 0) {
      throw new Error(MESSAGES.MODULES_NOT_FOUND);
    }
  }

  static isThereAtLeastOneValueObject(
    moduleName: string,
    context: 'entity' | 'aggregate'
  ): void {
    const valueObjects = Project.getValueObjects(moduleName);
    if (valueObjects.length === 0) {
      throw new Error(MESSAGES.VALUE_OBJECT_NOT_FOUND`${moduleName}${context}`);
    }
  }

  static getModules(): string[] {
    const modulesPath = `${PROJECT_LOCAL_PATH}/src/modules/*`;

    return glob.sync(modulesPath).map(
      modulePath => basename(modulePath)
    );
  }

  static getValueObjects(moduleName: string): string[] {
    const project = new ProjectMorph();
    project.addSourceFilesAtPaths(
      `${PROJECT_LOCAL_PATH}/src/modules/${moduleName}/domain/value_objects/*.ts`
    );
    const isValueObject = (source) => isNotEmptyOrNil(
      source
        .getImportDeclaration('@kerthin/domain')
        .getNamedImports()
        .find(imports => imports.getFullText().trim() === 'DomainValueObject')
    );
    const getValueObjectName = (source) => source.getClasses()[0].getName();

    return project
      .getSourceFiles()
      .filter((source) => isValueObject(source))
      .map((source) => getValueObjectName(source));
  }

  static getEntities(moduleName: string): string[] {
    const project = new ProjectMorph();
    project.addSourceFilesAtPaths(
      `${PROJECT_LOCAL_PATH}/src/modules/${moduleName}/domain/*.ts`
    );
    const isEntity = (source) => isNotEmptyOrNil(
      source
        .getImportDeclaration('@kerthin/domain')
        .getNamedImports()
        .find(imports => imports.getFullText().trim() === 'DomainEntity')
    );
    const getEntityName = (source) => source.getClasses()[0].getName();

    return project
      .getSourceFiles()
      .filter((source) => isEntity(source))
      .map((source) => getEntityName(source));
  }

  static getAggregates(moduleName: string): string[] {
    const project = new ProjectMorph();
    project.addSourceFilesAtPaths(
      `${PROJECT_LOCAL_PATH}/src/modules/${moduleName}/domain/*.ts`
    );
    const isAggregate = (source) => isNotEmptyOrNil(
      source
        .getImportDeclaration('@kerthin/domain')
        .getNamedImports()
        .find(imports => imports.getFullText().trim() === 'AggregateRoot')
    );
    const getAggregateName = (source) => source.getClasses()[0].getName();

    return project
      .getSourceFiles()
      .filter((source) => isAggregate(source))
      .map((source) => getAggregateName(source));
  }

}