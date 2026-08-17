//import { createStore } from 'redux';
import rootReducer from '../reducer';

const persistedState = localStorage.getItem('reduxState')
    ? JSON.parse(localStorage.getItem('reduxState') as string)
    : {}

const store = createStore(
    rootReducer,
    persistedState
);

export type RootState = ReturnType<typeof rootReducer>;

store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()))
})

export { store }
