import { 
    SET_TIERLISTS, SET_TIERLIST, LIKE_TIERLIST, UNLIKE_TIERLIST, DELETE_TIERLIST, POST_TIERLIST,
    LOADING_DATA, 
    SUBMIT_COMMENT,
    SET_CATEGORIES, SET_CATEGORIES_WITH_TIERLISTS, SET_CATEGORY, RESET_VIEW_CATEGORY, RESET_CATEGORIES,
    SET_TIER_ITEMS, SET_USER_TIER_ITEMS, RESET_VIEW_TIER_ITEMS,
} from '../types';

const initialState = {
    tierList: {},
    tierItems: [],
    categories: [],
    categoriesWithTierLists: {},
    viewCategory: {},
    viewTierItems: [],
    loading: false,
};
let index;
let tierListsSelected;
let newCategories;
export default function(state = initialState, action){
    switch(action.type){
        case LOADING_DATA:
            return {
                ...state,
                loading: true,
            };
        case SET_TIERLISTS:
            return {
                ...state,
                tierLists: action.payload,
                loading: false,
            };
        case SET_TIERLIST:
            return {
                ...state,
                tierList: action.payload,
                loading: false,
            };
        case LIKE_TIERLIST:
        case UNLIKE_TIERLIST:
            // index = state.tierLists.findIndex((tierList) => tierList.tierListId === action.payload.tierListId);
            // state.tierLists[index] = action.payload;
            // if (state.tierList.tierListId === action.payload.tierListId)
            //     state.tierList = action.payload;
            
            index = state.viewCategory[action.payload.category].findIndex((tierList) => tierList.tierListId === action.payload.tierListId);
            state.viewCategory[action.payload.category][index] = action.payload;
            return {
                ...state,
            };
        case DELETE_TIERLIST:
            //index = state.tierLists.findIndex(tierList => tierList.tierListId === action.payload.tierListId);
            //state.tierLists.splice(index, 1);
            
            index = state.viewCategory[action.payload.category].findIndex(tierList => tierList.tierListId === action.payload.tierListId);
            state.viewCategory[action.payload.category].splice(index, 1);
            return {
                ...state
            };
        case POST_TIERLIST:
            if (state.viewCategory.hasOwnProperty(action.payload.category)) state.viewCategory[action.payload.category].push(action.payload);
            else state.viewCategory[action.payload.category] = [action.payload];
            return {
                ...state,
                tierLists: [
                    action.payload,
                    ...state.tierLists,
                ],
            };
        case SUBMIT_COMMENT:
            index = state.tierLists.findIndex((tierList) => tierList.tierListId === action.payload.tierListId);
            state.tierLists[index].commentCount++;
            if (state.tierList.tierListId === action.payload.tierListId)
                state.tierList.commentCount++;
            return{
                ...state,
                tierList: {
                    ...state.tierList,
                    comments: [action.payload, ...state.tierList.comments]
                }
            };
        case SET_CATEGORIES:
            return {
                ...state,
                categories: action.payload,
                loading: false,
            };
        case SET_CATEGORIES_WITH_TIERLISTS:
            return {
                ...state,
                viewCategory: action.payload,
                categoriesWithTierLists: action.payload,
                loading: false,
            };
        case SET_CATEGORY:
            tierListsSelected = {};
            tierListsSelected[action.payload] = state.categoriesWithTierLists[action.payload];
            state.viewCategory = tierListsSelected
            return {
                ...state,
                loading: false,
            };
        case RESET_VIEW_CATEGORY:
            return {
                ...state,
                viewCategory: state.categoriesWithTierLists,
                loading: false,
            };
        case RESET_CATEGORIES:
            newCategories = [];
            for (var category in state.categoriesWithTierLists) {
                newCategories.push({ name: category });
            }
            return {
                ...state,
                categories: newCategories,
            };
        case SET_TIER_ITEMS:
            return {
                ...state,
                tierItems: action.payload,
                viewTierItems: action.payload,
                loading: false
            };
        case SET_USER_TIER_ITEMS:
            state.viewTierItems = state.tierItems.filter(tierItem => tierItem.userId === action.payload);
            return {
                ...state,
            };
        case RESET_VIEW_TIER_ITEMS:
            return {
                ...state,
                viewTierItems: state.tierItems,
                loading: false,
            };
        default:
            return state;
    }
}