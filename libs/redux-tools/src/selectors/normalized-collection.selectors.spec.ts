import { schema } from 'normalizr';
import { INormalizedCollectionState } from './interfaces';
import { normalizedCollectionSelectorFactory } from './normalized-collection.selectors';
import { ViewModel } from './view-model.class';

const personSchema = new schema.Entity('people');
const peopleSchema = new schema.Array(personSchema);
const subStateSelector = (state: any) => state.people;

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

describe('normalizedCollectionSelectorFactory', () => {
  let subject: any;

  const state: { people: INormalizedCollectionState } = {
    people: {
      entities: {
        people: {
          42: { id: '42', firstname: 'Arthur', lastname: 'Dent' },
          43: { id: '43', firstname: 'Ford', lastname: 'Perfect' },
        },
      },
      result: ['43', '42'],
      loading: false,
      loaded: true,
      updating: false,
      updatedAt: new Date(),
      error: null,
      lastState: null,
    },
  };

  beforeEach(() => {
    subject = normalizedCollectionSelectorFactory(subStateSelector, peopleSchema, Person);
  });

  describe('subState', () => {
    it('returns the correct state', () => {
      expect(subject.subState(state)).toBe(state.people);
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

  describe('rawCollection', () => {
    it('returns the correct state', () => {
      expect(subject.rawCollection(state)).toEqual([
        { id: '43', firstname: 'Ford', lastname: 'Perfect' },
        { id: '42', firstname: 'Arthur', lastname: 'Dent' },
      ]);
    });
  });

  describe('collection', () => {
    let collection: Person[];

    beforeEach(() => {
      collection = subject.collection(state);
    });

    it('returns instances of Person', () => {
      expect(collection[0]).toBeInstanceOf(Person);
      expect(collection[1]).toBeInstanceOf(Person);
    });

    it('the Person is given the correct state data', () => {
      const entity = collection[1];
      expect(entity.id).toEqual('42');
      expect(entity.firstname).toEqual('Arthur');
      expect(entity.lastname).toEqual('Dent');
    });
  });
});
