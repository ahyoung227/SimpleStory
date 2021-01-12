export const state = () => ({
    me: null,
    followers: [{
        id: 1,
        name: "Jahyun"
    },
    {
        id: 2,
        name: "JJ"
    }
    ],
    followings: [{
        id: 1,
        name: "Jinhyun"
    },
    {
        id: 2,
        name: "Ahyoung"
    }
    ]
});

export const mutations = {
    setMe(state, payload) {
        state.me = payload;
    },
    changeNickname(state, payload) {
        state.me.nickname = payload.nickname;
    },
    addFollowers(state, payload) {
        state.followers.push(payload)
    },
    deleteFollowers(state, payload) {
        const index = state.followers.findIndex( v => v.id === payload.userId )
        state.followers.splice(index, 1)
    },
    addFollowings(state, payload) {
        state.followings.push(payload)
    },
    deleteFollowings(state, payload) {
        const index = state.followings.findIndex( v => v.id === payload.userId )
        state.followings.splice(index, 1)
    },
};

export const actions = {
    signUp({ commit, state }, payload) {
        commit('setMe', payload);
    }, 
    logIn({ commit }, payload) {
        commit('setMe', payload);
    },
    logOut({ commit }, payload) {
        commit('setMe', null);
    },
    changeNickname({ commit }, payload) {
        commit('changeNickname', payload)
    },
    addFollowers({ commit }, payload) {
        commit('addFollowers', payload)
    },
    deleteFollowers({ commit }, payload) {
        commit('deleteFollowers', payload)
    },
    addFollowings({ commit }, payload) {
        commit('addfollowings', payload)
    },
    deleteFollowings({ commit }, payload) {
        commit('deleteFollowings', payload)
    },
}