import { keys } from 'ramda';
import { Constructor } from './normalized-entity.selectors';
// no typings
const hashIt = require('hash-it').default;

export function generateGetter<T extends object, K extends keyof T>(instance: ViewModel<T>, key: K) {
  if (Object.getOwnPropertyDescriptor(Object.getPrototypeOf(instance), key) === undefined) {
    Object.defineProperty(instance, key, {
      get() {
        return instance.getProp(key);
      },
      configurable: true,
      enumerable: true,
    });
  }
}

export abstract class ViewModel<T extends object> {
  protected instanceCache: { [key: string]: any } = {};
  // tslint:disable-next-line:variable-name
  protected _identifier = '';

  get loaded(): boolean {
    // naive implementation as default: presence of id
    // overwrite when necessary
    return !!(this as any).id;
  }

  get identifier(): string {
    if (!this._identifier) {
      this._identifier = hashIt(this.props);
    }
    return this._identifier;
  }

  constructor(protected props: Partial<T> = {}) {
    keys(props).forEach(key => {
      generateGetter(this, key);
    });
  }

  public getProp(key: keyof T) {
    return (<any>this.props)[key];
  }

  public merge(data: { [key: string]: any }): this {
    const props = { ...this.toObject(), ...data };
    return new (<any>this.constructor)(props);
  }

  public toJSON(): string {
    return JSON.stringify(this.props);
  }

  public toObject(): object {
    return { ...(this.props as object) };
  }

  protected getInstance(key: keyof T, konstructor: Constructor<any>, collection = false) {
    if (!this.instanceCache[key]) {
      if (collection) {
        this.instanceCache[key] = this.getProp(key).map((item: any) => new konstructor(item));
      } else {
        this.instanceCache[key] = new konstructor(this.getProp(key));
      }
    }

    return this.instanceCache[key];
  }
}
