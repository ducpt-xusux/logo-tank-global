import { commonConstants, userConstants } from "../constants";
import { System, SystemActionTypes } from "@/helper/type";

const initialState: System = {
    menu: 'dashboard',
    openMenu: true,
    openSignInForm: false,
    openSignUpForm: false,
    openMobileMenu: false,
    openPaymentMethod: false,
    loading:false,
    designers: [],
    priceSettings: {
        cancellation_fee: {},
        logo_motion_price: {},
        logo_price: {},
        logo_manual_price: {},
        tax: {},
    },
    shoppingCart: [],
    prepareOrderData: {
        paymentMethod: {
            id: 0, name: ''
        },
        cart: [],
    },
    order: {},
    conditions: {},
    industries: [],
    colors: [],
    tastes: [],
    alphabets: [],
    favoriteCount: 0,
    doSearch: false,
    page_logo_admin: 1,
    totalAmount: 0
};

export function system(state = initialState, action: SystemActionTypes) {
    switch (action.type) {
        case commonConstants.SET_MENU:
            return {
                ...state,
                menu: action.menu,
            };
        case commonConstants.SET_OPEN_MENU:
            return {
                ...state,
                openMenu: action.openMenu
            }
        case commonConstants.SET_OPEN_MOBILE_MENU:
            return {
                ...state,
                openMobileMenu: action.openMobileMenu
            }
        case commonConstants.SET_OPEN_SIGN_IN:
            return {
                ...state,
                openSignInForm: action.openSignInForm
            }
        case commonConstants.SET_OPEN_SIGN_UP:
            return {
                ...state,
                openSignUpForm: action.openSignUpForm
            }
        case commonConstants.SET_DESIGNERS:
            return {
                ...state,
                designers: action.designers
            }
        case commonConstants.SET_PRICE_SETTING:
            return {
                ...state,
                priceSettings: action.priceSettings
            }
        case userConstants.SET_SHOPPING_CART:
            return {
                ...state,
                shoppingCart: action.shoppingCart
            }
        case commonConstants.SET_OPEN_PAYMENT_METHOD:
            return {
                ...state,
                openPaymentMethod: action.openPaymentMethod
            }
        case commonConstants.SET_PREPARE_ORDER_DATA:
            return {
                ...state,
                prepareOrderData: action.prepareOrderData
            }
        case commonConstants.SET_LOADING:
            return {
                ...state,
                loading: action.loading
            }
        case commonConstants.SET_RECENTLY_VIEWED_LOGO:
            return {
                ...state,
            }
        case commonConstants.SET_ORDER:
            return {
                ...state,
                order: action.order
            }
        case commonConstants.SET_CONDITION:
            return {
                ...state,
                conditions: action.conditions
            }
        case commonConstants.SET_M_INDUSTRIES:
            return {
                ...state,
                industries: action.industries
            }
        case commonConstants.SET_M_COLORS:
            return {
                ...state,
                colors: action.colors
            }
        case commonConstants.SET_M_TASTES:
            return {
                ...state,
                tastes: action.tastes
            }
        case commonConstants.SET_M_ALPHABETS:
            return {
                ...state,
                alphabets: action.alphabets
            }
        case commonConstants.SET_FAVORITE_COUNT:
            return {
                ...state,
                favoriteCount: action.favoriteCount
            }
        case commonConstants.SET_ACTION_SEARCH:
            return {
                ...state,
                doSearch: action.doSearch
            }
        case commonConstants.SET_PAGE_LOGO_ADMIN:
            return {
                ...state,
                page_logo_admin: action.page_logo_admin,
            };
        case commonConstants.SET_TOTAL_AMOUNT:
            return {
                ...state,
                totalAmount: action.totalAmount,
            }
        default:
            return state;
    }
}
