import { 
    SET_TIERLISTS, SET_TIERLIST, LIKE_TIERLIST, UNLIKE_TIERLIST, DELETE_TIERLIST, POST_TIERLIST,
    LOADING_DATA, LOADING_UI, STOP_LOADING_UI, 
    SET_ERRORS, CLEAR_ERRORS, SUBMIT_COMMENT 
} from '../types';
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

// Get a single Tier List
export const getTierList = (tierListId) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.get(`/tierLists/${tierListId}`)
        .then(res => {
            dispatch({
                type: SET_TIERLIST,
                payload: res.data
            });
            dispatch({ type: STOP_LOADING_UI });
        })
        .catch(err => console.log(err))
}

// Post a Tier List
export const postTierList = (newTierList) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/tierLists/createTierList', newTierList)
        .then(res => {
            dispatch({ 
                type: POST_TIERLIST,
                payload: res.data,
            });
            dispatch(clearErrors());
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
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

// Submit a Comment
export const submitComment = (tierListId, commentData) => (dispatch) => {
    axios.post(`/tierLists/${tierListId}/comment`, commentData)
        .then(res => {
            dispatch({
                type: SUBMIT_COMMENT,
                payload: res.data,
            });
            dispatch(clearErrors());
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data,
            })
        })
}

// Delete a Tier List
export const deleteTierList = (tierListId) => (dispatch) => {
    axios.delete(`/tierLists/${tierListId}`)
        .then(() => {
            dispatch({ 
                type: DELETE_TIERLIST,
                payload: tierListId,
            });
        })
        .catch(err => console.log(err))
}

// Clear errors
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
}