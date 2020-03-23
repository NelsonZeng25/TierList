import { 
    SET_TIERLISTS, SET_TIERLIST, LIKE_TIERLIST, UNLIKE_TIERLIST, DELETE_TIERLIST, POST_TIERLIST,
    LOADING_DATA, 
    SUBMIT_COMMENT} from '../types';

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
                tierList: action.payload,
                loading: false,
            };
        case LIKE_TIERLIST:
        case UNLIKE_TIERLIST:
            index = state.tierLists.findIndex((tierList) => tierList.tierListId === action.payload.tierListId);
            state.tierLists[index] = action.payload;
            if (state.tierList.tierListId === action.payload.tierListId)
                state.tierList = action.payload;
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
            }
        default:
            return state;
    }
}