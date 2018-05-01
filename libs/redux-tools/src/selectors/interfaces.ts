export interface INormalizedState {
  entities: { [key: string]: { [key: string]: object } };
  loading: boolean;
  loaded: boolean;
  updating: boolean;
  updatedAt: Date | null;
  error: any;
  lastState: INormalizedState | null;
}

export interface INormalizedEntityState extends INormalizedState {
  result: string;
}

export interface INormalizedCollectionState extends INormalizedState {
  result: string[];
}
