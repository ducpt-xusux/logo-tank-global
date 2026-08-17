//import { combineReducers } from 'redux';

import { authentication } from './auth.reducer';
import { system } from './system.reducer';
import { recently } from './recently.reducer';
import { data } from './data.reducer';

const rootReducer = combineReducers({
    authentication,
    system,
    recently,
    data
});

export default rootReducer;

export * from './general.reducer';
