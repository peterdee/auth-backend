import store from '../store';

export default async function delay() {
  store.enterWith({
    id: null,
    incoming: Date.now(),
  });
}
