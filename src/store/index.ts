import { AsyncLocalStorage } from 'async_hooks';

export interface Store {
  id: null | number | string;
  incoming: number;
}

const store = new AsyncLocalStorage<Store>();

export default store;
