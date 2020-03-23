import { SET_USER, LOADING_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LIKE_TIERLIST, UNLIKE_TIERLIST } from '../types';

const initialState =  {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: []
};

export default function(state=initialState, action){
    switch(action.type){
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true,
            };
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                authenticated: true,
                loading: false,
                ...action.payload,
            };
        case LOADING_USER:
            return {
                ...state,
                loading: true
            }
        case LIKE_TIERLIST:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userId: state.credentials.userId,
                        userName: state.credentials.userName,
                        tierListId: action.payload.tierListId
                    }
                ]
            }
        case UNLIKE_TIERLIST:
            return {
                ...state,
                likes: state.likes.filter(like => like.tierListId !== action.payload.tierListId)
            }
        default:
            return state;
    }
}