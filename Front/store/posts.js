export const state = () => ({
    mainPosts: [],
    hasMorePost: true,
});

const totalPosts = 101;
const limit = 10;

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
    loadPosts(state) {
        const diff = totalPosts - state.mainPosts.length
        const fakePosts = Array(diff > limit ? limit : diff ).fill().map(v => ({
            id: Math.random().toString(),
            user: {
                id: 1,
                nickname: 'ahyoung',
            },
            content: `Hello, infinite scrolling ${Math.random()}`,
            comments: [],
            images: [],
        }));
        state.mainPosts = state.mainPosts.concat(fakePosts);
        state.hasMorePosts = fakePosts.length === limit;
    }
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
    },
    loadPosts({ commit, state }, payload ) {
        if (state.hasMorePost) {
            commit('loadPosts');
        }
    }
}