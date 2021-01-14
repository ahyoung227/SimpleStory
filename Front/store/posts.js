export const state = () => ({
    mainPosts: [],
    hasMorePost: true,
    imagePaths: [],
});

const totalPosts = 101;
const limit = 10;

export const mutations = {
    addMainPost(state, payload) {
        state.mainPosts.unshift(payload);
        state.imagePaths = [];
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
            User: {
                id: 1,
                nickname: 'ahyoung',
            },
            content: `Hello, infinite scrolling ${Math.random()}`,
            comments: [],
            images: [],
        }));
        state.mainPosts = state.mainPosts.concat(fakePosts);
        state.hasMorePosts = fakePosts.length === limit;
    },
    concatImagePaths(state, payload) {
        state.imagePaths = state.imagePaths.concat(payload);
    },
    removeImagePath(state, payload) {
        state.imagePaths.splice(payload, 1);
    },
};

export const actions = {
    add({ commit, state } , payload) {
        this.$axios.post('http://localhost:3085/post', {
            content: payload.content,
            imagePaths: state.imagePaths,
        },{
            withCredentials: true,
        })
            .then((res) => {
                console.log(res)
                commit('addMainPost', res.data);
            })
            .catch(() => {

        });

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
    },
    uploadImages({ commit }, payload) {
        this.$axios.post( 'http://localhost:3085/post/images', payload, {
            withCredentials: true
        })
            .then((res) => {
                commit('concatImagePaths', res.data)
        })
            .catch(() => {

        })

    }
}