export const state = () => ({
    mainPosts: [],
    hasMorePost: true,
    imagePaths: [],
});

export const mutations = {
    addMainPost(state, payload) {
        state.mainPosts.unshift(payload);
        state.imagePaths = [];
    },
    removeMainPost(state, payload) {
        const index = state.mainPosts.findIndex( v => v.id === payload.postId);
        state.mainPosts.splice(index, 1)
    },
    addComment(state, payload) {
        const index = state.mainPosts.findIndex( v=> v.id == Number(payload.postId) );
        state.mainPosts[index].comments.unshift(payload)
    },
    loadPosts(state, payload) {
        state.mainPosts = state.mainPosts.concat(payload)
        state.hasMorePosts = payload.length === 10;
    },
    loadComments(state, payload) {
        const index = state.mainPosts.findIndex( v=> v.id == Number(payload.postId) );
        state.mainPosts[index].Comments = payload;
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
        console.log(payload.imagePaths)
        this.$axios.post('http://localhost:3085/post', {
            content: payload.content,
            image: state.imagePaths,
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
        this.$axios.delete(`htttp://localhost:3085/post/${payload.postId}`, {
            withCredentials: true
        })
            .then(() => {
                commit('removeMainPost', payload);
            })
            .catch(() => {

            })

    },
    addComment({ commit }, payload) {
        this.$axios.post(`http://localhost:3085/posts/${payload.postId}/comment`, {
            content: payload.content,
        }, {
            withCredentials: true,
        }).then((res) => {
            commit('addComment', res.data)
        }).catch(() => {

        })
    },
    loadComments({commit, payload}) {
        this.$axios.get(`http://localhost:3085/post/${payload.postId}/comments`)
            .then((res) => {
            commit('loadComments', res.data);
        })
            .catch(() => {

            });
    },
    loadPosts({ commit, state }, payload ) {
        if (state.hasMorePost) {
            this.$axios.get(`http://localhost:3085/posts?${state.mainPosts.length}&limit=10`)
                .then((res) => {
                    commit('loadPosts', res.data);
                })
                .catch(()=> {

                })
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