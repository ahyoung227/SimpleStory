export const state = () => ({
    mainPosts: [],
});

export const mutations = {
    addMainPost(state, payload) {
        state.mainPosts.unshift(payload);
    },
    removeMainPost(state, payload) {
        const index = state.mainPosts.findIndex( v => v.id === payload.id);
        state.mainPosts.splice(index, 1)
    },
    addComment(state, payload) {
        const index = state.mainPosts.findIndex( v=> v.id == Number(payload.postId) );
        console.log(state.mainPosts)
        console.log(index);
        console.log(payload.postId);
        state.mainPosts[index].comments.unshift(payload)
    },
};

export const actions = {
    add({ commit } , payload) {
        commit('addMainPost', payload);
    },
    remove({ commit }, payload) {
        commit('removeMainPost', payload);
    },
    addComment({ commit }, payload) {
        console.log(payload)
        commit('addComment', payload);
    }
}