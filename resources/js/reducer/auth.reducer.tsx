import { userConstants } from '@/constants';
import {Auth, AuthUser, User} from "@/helper/type";

const initialState: Auth = {
    loggedIn: false,
};

export function authentication(state = initialState, action: { type: string; user?: AuthUser; detail?: User, error?: string}) {
    switch (action.type) {
        case userConstants.LOGIN_SUCCESS:
            return {
                ...state,
                loggedIn: true,
                user: action.user
            }
        case userConstants.LOGOUT:
            return {
                loggedIn: false,
            }
        case userConstants.UPDATE_PROFILE_SUCCESS:
            if (action.detail) state.user!.detail = action.detail;
            return state
        default:
            return state
    }
}
