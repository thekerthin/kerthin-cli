import { isNotEmptyOrNil } from '@kerthin/utils';
import * as glob from 'glob';
import { basename, resolve } from 'path';
import { existsSync } from 'fs';
import { Project as ProjectMorph } from 'ts-morph';
import { classify } from '@angular-devkit/core/src/utils/strings';
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

  static isThereAtLeastOneEntityOrAggregate(
    moduleName: string,
    context: 'repository',
  ): void {
    const entities = Project.getEntities(moduleName);
    const aggregates = Project.getAggregates(moduleName);
    if (entities.length === 0 && aggregates.length === 0) {
      throw new Error(MESSAGES.ENTITY_OR_AGGREGATE_NOT_FOUND`${moduleName}${context}`);
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

  static getRepositories(moduleName: string): string[] {
    const project = new ProjectMorph();
    project.addSourceFilesAtPaths(
      `${PROJECT_LOCAL_PATH}/src/modules/${moduleName}/repositories/*Repository.ts`
    );
    const isRepository = (source) => isNotEmptyOrNil(
      source
        .getImportDeclaration('@kerthin/domain')
        .getNamedImports()
        .find(imports => imports.getFullText().trim() === 'Repository')
    );
    const getRepositoryName = (source) => source.getClasses()[0].getName();

    return project
      .getSourceFiles()
      .filter((source) => isRepository(source))
      .map((source) => getRepositoryName(source));
  }

  static getEvents(moduleName: string): string[] {
    const project = new ProjectMorph();
    project.addSourceFilesAtPaths(
      `${PROJECT_LOCAL_PATH}/src/modules/${moduleName}/domain/events/*Event.ts`
    );
    const isEvent = (source) => isNotEmptyOrNil(
      source
        .getImportDeclaration('@kerthin/domain')
        .getNamedImports()
        .find(imports => imports.getFullText().trim() === 'Event')
    );
    const getEventName = (source) => source.getClasses()[0].getName();

    return project
      .getSourceFiles()
      .filter((source) => isEvent(source))
      .map((source) => getEventName(source));
  }

  static getEntityOrAggregateProps(moduleName: string, entityOrAggregate: string): string[] {
    const project = new ProjectMorph();
    project.addSourceFilesAtPaths(
      `${PROJECT_LOCAL_PATH}/src/modules/${moduleName}/domain/*.ts`
    );
    const isEntityOrAggregate = (source) => isNotEmptyOrNil(
      source
        .getImportDeclaration('@kerthin/domain')
        .getNamedImports()
        .find(imports => ['DomainEntity', 'AggregateRoot'].includes(imports.getFullText().trim()))
    );
    const filterByName = (source) => {
      const name = `${classify(entityOrAggregate)}.ts`;
      return source.getBaseName() === name;
    };

    return project
      .getSourceFiles()
      .filter((source) => isEntityOrAggregate(source))
      .find(filterByName)
      .getClasses()[0]
      .getProperties()
      // .map(
      //   (property) => `${property.getName()}:${property.getTypeNode().getText()}`
      // );
      .map((property) => property.getName());
  }

}
