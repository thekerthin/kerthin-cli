import { Targets } from '../targets.enum';
import { Generator } from './generator';
import { AggregateGenerator } from './aggregate.generator';
import { EntityGenerator } from './entity.generator';
import { EventGenerator } from './event.generator';
import { ModuleGenerator } from './module.generator';
import { RepositoryGenerator } from './repository.generator';
import { UseCaseGenerator } from './use-case.generator';
import { ValueObjectGenerator } from './value-object.generator';

export class GeneratorFactory {

  static getGenerator(target: Targets): Generator {
    switch (target) {
      case Targets.Aggregate:
        return new AggregateGenerator();
      case Targets.Entity:
        return new EntityGenerator();
      case Targets.Event:
        return new EventGenerator();
      case Targets.Module:
        return new ModuleGenerator();
      case Targets.Repository:
        return new RepositoryGenerator();
      case Targets.UseCase:
        return new UseCaseGenerator();
      case Targets.ValueObject:
        return new ValueObjectGenerator();
      default:
        throw new Error('Incorrect Target.');
    }
  }

}
