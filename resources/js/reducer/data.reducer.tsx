import {commonConstants, userConstants} from '@/constants';
import {Auth, AuthUser, DataReducerProps, User} from "@/helper/type";

const initialState: DataReducerProps = {
    contactData: null,
    quoteData: null,
};

export function data(state = initialState, action: { type: string; payload: any}) {
    switch (action.type) {
        case commonConstants.SET_CONTACT_DATA:
            return {
                ...state,
                contactData: action.payload,
            }
        default:
            return state
    }
}
