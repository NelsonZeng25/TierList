import { 
    SET_TIERLISTS, SET_TIERLIST, LIKE_TIERLIST, UNLIKE_TIERLIST, DELETE_TIERLIST, POST_TIERLIST,
    LOADING_DATA, 
    SUBMIT_COMMENT,
    SET_CATEGORIES, SET_CATEGORIES_WITH_TIERLISTS, SET_CATEGORY, RESET_VIEW_CATEGORY, RESET_CATEGORIES,
    SET_TIER_ITEMS, SET_USER_TIER_ITEMS, RESET_VIEW_TIER_ITEMS, DELETE_TIER_ITEM, POST_TIER_ITEM, UPDATE_TIER_ITEM, SET_SEARCH_TIER_ITEMS, SET_SEARCH_USER_TIER_ITEMS,
    SET_VIEW_TIER_LIST, ADD_TO_VIEW_TIER_LIST, DELETE_FROM_VIEW_TIER_LIST, SORT_VIEW_TIER_LIST
} from '../types';

const initialState = {
    tierList: {},
    tierItems: [],
    categories: [],
    categoriesWithTierLists: {},
    viewCategory: {},
    viewTierItems: [],
    userTierItems: [],
    viewTierList: {'S': [], 'A': [], 'B': [], 'C': [], 'D': [], 'E': [], 'F': []},
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
            state.viewTierList = {'S': [], 'A': [], 'B': [], 'C': [], 'D': [], 'E': [], 'F': []};
            let temp;
            for (const [id, tierItem] of Object.entries(action.payload.tierItems)) {
                temp = tierItem;
                temp.tierItemId = id;
                state.viewTierList[tierItem.tier].push(temp);
            }
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
            if (index !== -1) state.viewCategory[action.payload.category][index] = action.payload;
            return {
                ...state,
            };
        case DELETE_TIERLIST:
            //index = state.tierLists.findIndex(tierList => tierList.tierListId === action.payload.tierListId);
            //state.tierLists.splice(index, 1);
            
            index = state.viewCategory[action.payload.category].findIndex(tierList => tierList.tierListId === action.payload.tierListId);
            if (index !== -1) state.viewCategory[action.payload.category].splice(index, 1);
            return {
                ...state
            };
        case POST_TIERLIST:
            if (state.viewCategory.hasOwnProperty(action.payload.category)) state.viewCategory[action.payload.category].push(action.payload);
            else state.viewCategory[action.payload.category] = [action.payload];
            return {
                ...state,
            };
        case SUBMIT_COMMENT:
            index = state.tierLists.findIndex((tierList) => tierList.tierListId === action.payload.tierListId);
            if (index !== -1) state.tierLists[index].commentCount++;
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
            state.userTierItems = state.viewTierItems;
            return {
                ...state,
            };
        case SET_SEARCH_TIER_ITEMS:
            state.viewTierItems = state.tierItems.filter(tierItem => tierItem.name.toUpperCase().includes(action.payload.toUpperCase()));
            return {
                ...state,
            };
        case SET_SEARCH_USER_TIER_ITEMS:
            state.viewTierItems = state.userTierItems.filter(tierItem => tierItem.name.toUpperCase().includes(action.payload.toUpperCase()));
            return {
                ...state,
            };
        case RESET_VIEW_TIER_ITEMS:
            return {
                ...state,
                viewTierItems: state.tierItems,
                loading: false,
            };
        case DELETE_TIER_ITEM:
            index = state.viewTierItems.findIndex(tierItem => tierItem.tierItemId === action.payload.tierItemId);
            if (index !== -1) state.viewTierItems.splice(index, 1);
            index = state.tierItems.findIndex(tierItem => tierItem.tierItemId === action.payload.tierItemId);
            if (index !== -1) state.tierItems.splice(index, 1);
            return {
                ...state,
            };
        case POST_TIER_ITEM:
            return {
                ...state,
                tierItems: [
                    action.payload,
                    ...state.tierItems,
                ],
                viewTierItems: [
                    action.payload,
                    ...state.viewTierItems
                ]
            };
        case UPDATE_TIER_ITEM:
            index = state.viewTierItems.findIndex(tierItem => tierItem.tierItemId === action.payload.tierItemId);
            if (index !== -1) state.viewTierItems[index] = action.payload;
            index = state.tierItems.findIndex(tierItem => tierItem.tierItemId === action.payload.tierItemId);
            if (index !== -1) state.tierItems[index] = action.payload;
            return {
                ...state,
            }
        case SET_VIEW_TIER_LIST:
            let updateTierItem = action.payload;
            index = state.viewTierList[updateTierItem.tier].findIndex(tierItem => tierItem.tierItemId === updateTierItem.tierItemId);
            if (index !== -1) Object.assign(state.viewTierList[updateTierItem.tier][index], updateTierItem);
            return {
                ...state,
            }
        case ADD_TO_VIEW_TIER_LIST:
            let foundTier;
            let addTierItem = action.payload;
            for (var tier in state.viewTierList) {
                index = state.viewTierList[tier].findIndex(tierItem => tierItem.tierItemId === addTierItem.tierItemId);
                if (index !== -1) {
                    foundTier = tier;
                    break;
                }
            }
            if (index !== -1) state.viewTierList[foundTier].splice(index, 1);
            state.viewTierList[addTierItem.tier].push(action.payload);
            return {
                ...state,
            }
        case DELETE_FROM_VIEW_TIER_LIST:
            let selectedTierItem = action.payload;
            index = state.viewTierList[selectedTierItem.tier].findIndex(tierItem => tierItem.tierItemId === selectedTierItem.tierItemId);
            if (index !== -1) state.viewTierList[selectedTierItem.tier].splice(index, 1);
            return {
                ...state,
            }
        case SORT_VIEW_TIER_LIST:
            // https://stackoverflow.com/questions/8900732/sort-objects-in-an-array-alphabetically-on-one-property-of-the-array
            var nameA, nameB;
            for (var tier in state.viewTierList) {
                state.viewTierList[tier].sort(function(a,b) {
                    nameA = a.name.toUpperCase();
                    nameB = b.name.toUpperCase();
                    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
                });
            }
            return {
                ...state,
            }
        default:
            return state;
    }
}