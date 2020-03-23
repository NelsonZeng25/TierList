import { 
    SET_TIERLISTS, SET_TIERLIST, LIKE_TIERLIST, UNLIKE_TIERLIST, DELETE_TIERLIST, POST_TIERLIST,
    LOADING_DATA } from '../types';

const initialState = {
    tierLists: [],
    tierList: {},
    loading: false,
};
let index;
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
                loading: false,
            };
        case LIKE_TIERLIST:
        case UNLIKE_TIERLIST:
            index = state.tierLists.findIndex((tierList) => tierList.tierListId === action.payload.tierListId);
            state.tierLists[index] = action.payload;
            return {
                ...state,
            };
        case DELETE_TIERLIST:
            index = state.tierLists.findIndex(tierList => tierList.tierListId === action.payload);
            state.tierLists.splice(index, 1);
            return {
                ...state
            };
        case POST_TIERLIST:
            return {
                ...state,
                tierLists: [
                    action.payload,
                    ...state.tierLists,
                ]
            }
        default:
            return state;
    }
}