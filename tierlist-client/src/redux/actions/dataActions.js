import { SET_TIERLISTS, LOADING_DATA, LIKE_TIERLIST, UNLIKE_TIERLIST } from '../types';
import axios from 'axios';

// Get All Tier Lists
export const getTierLists = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.get('/tierLists')
        .then(res => {
            dispatch({ 
                type: SET_TIERLISTS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({ 
                type: SET_TIERLISTS,
                payload: []
            })
        })
}

// Like a Tier List
export const likeTierList = (tierListId) => (dispatch) => {
    axios.get(`/tierLists/${tierListId}/like`)
        .then(res => {
            dispatch({ 
                type: LIKE_TIERLIST,
                payload: res.data,
            });
        })
        .catch(err => console.log(err))
}

// Unlike a Tier List
export const unlikeTierList = (tierListId) => (dispatch) => {
    axios.get(`/tierLists/${tierListId}/unlike`)
        .then(res => {
            dispatch({ 
                type: UNLIKE_TIERLIST,
                payload: res.data,
            });
        })
        .catch(err => console.log(err))
}