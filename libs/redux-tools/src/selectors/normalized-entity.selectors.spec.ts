import { schema } from 'normalizr';
import { INormalizedEntityState } from './interfaces';
import { normalizedEntitySelectorFactory } from './normalized-entity.selectors';
import { ViewModel } from './view-model.class';

const personSchema = new schema.Entity('people');
const subStateSelector = (state: any) => state.currentPerson;

interface IPerson {
  id: string;
  firstname: string;
  lastname: string;
}

// tslint:disable-next-line:max-classes-per-file
class Person extends ViewModel<IPerson> {
  protected static readonly defaults = {
    id: '42',
    firstname: '',
    lastname: '',
  };

  public id: string;
  public firstname: string;
  public lastname: string;

  constructor(args?: Partial<IPerson>) {
    super({ ...Person.defaults, ...args });
  }
}

describe('normalizedEntitySelectorFactory', () => {
  let subject: any;

  const state: { currentPerson: INormalizedEntityState } = {
    currentPerson: {
      entities: { people: { 42: { id: '42', firstname: 'Arthur', lastname: 'Dent' } } },
      result: '42',
      loading: false,
      loaded: true,
      updating: false,
      updatedAt: new Date(),
      error: null,
      lastState: null,
    },
  };

  beforeEach(() => {
    subject = normalizedEntitySelectorFactory(subStateSelector, personSchema, Person);
  });

  describe('subState', () => {
    it('returns the correct state', () => {
      expect(subject.subState(state)).toBe(state.currentPerson);
    });
  });

  describe('loading', () => {
    it('returns the correct state', () => {
      expect(subject.loading(state)).toBe(false);
    });
  });

  describe('loaded', () => {
    it('returns the correct state', () => {
      expect(subject.loaded(state)).toBe(true);
    });
  });

  describe('updating', () => {
    it('returns the correct state', () => {
      expect(subject.updating(state)).toBe(false);
    });
  });

  describe('error', () => {
    it('returns the correct state', () => {
      expect(subject.error(state)).toBe(null);
    });
  });

  describe('updatedAt', () => {
    it('returns the correct state', () => {
      expect(subject.updatedAt(state)).toBeInstanceOf(Date);
    });
  });

  describe('rawEntity', () => {
    it('returns the correct state', () => {
      expect(subject.rawEntity(state)).toEqual({ id: '42', firstname: 'Arthur', lastname: 'Dent' });
    });
  });

  describe('entity', () => {
    let entity: Person;

    beforeEach(() => {
      entity = subject.entity(state);
    });

    it('returns an instance of Person', () => {
      expect(entity).toBeInstanceOf(Person);
    });

    it('the Person is given the correct state data', () => {
      expect(entity.id).toEqual('42');
      expect(entity.firstname).toEqual('Arthur');
      expect(entity.lastname).toEqual('Dent');
    });
  });
});
