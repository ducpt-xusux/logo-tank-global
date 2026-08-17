import {commonConstants} from "@/constants";

export const generalReducer = (items: any[], action: {type: string, payload: any}): any[] => {
    switch (action.type) {
        case commonConstants.SET_ITEMS:
            return action.payload;
        case commonConstants.ADD_ITEM:
            return [
                ...items,
                action.payload,
            ]
        case commonConstants.DELETE_ITEM:
            return items.filter(i => i.id !== action.payload.id);
        case commonConstants.UPDATE_ITEM:
            return items.map(i => {
                if (i.id === action.payload.id) return action.payload;
                return i;
            })
        default:
            return items;
    }
}

export const itemReducer = (item: any, action: {type: string, payload: any}): any => {
    switch (action.type) {
        case commonConstants.SET_ITEM:
            return action.payload;
        case commonConstants.UPDATE_ITEM_ATTRIBUTE:
            return {
                ...item,
                ...action.payload,
            }
        default:
            return item;
    }
}
