import { commonConstants } from "@/constants"
import { RecentlyState } from "@/helper/type";

const initialState: RecentlyState = {
    recentlyViewedLogos: [],
    keywordRecently: [],
}

export function recently(state = initialState, action: any) {
    switch (action.type) {
        case commonConstants.SET_RECENTLY_VIEWED_LOGO:
            return {
                ...state,
                recentlyViewedLogos: action.recentlyViewedLogos
            }
        case commonConstants.SET_KEYWORD_RECENTLY:
            return {
                ...state,
                keywordRecently: action.keywordRecently
            }
        default:
            return state;
    }
}