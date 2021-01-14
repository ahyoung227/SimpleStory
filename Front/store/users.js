export const state = () => ({
    me: null,
    followerList: [],
    followingList: [],
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
    ],
    hasMoreFollowers: true,
    hasMoreFollowings: true,
});

const totalFollowers = 8;
const totalFollowings = 6;
const limit = 3;

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
    loadFollowers(state) {
        const diff = totalFollowers - state.followerList.length;
        const fakeUsers = Array(diff > limit ? limit : diff).fill().map(v => ({
            id: Math.random().toString(),
            nickname: Math.floor(Math.random() * 1000),
        }));
        state.followerList = state.followerList.concat(fakeUsers);
        state.hasMoreFollowers = fakeUsers.length === limit;
    },
    loadFollowings(state) {
        const diff = totalFollowings - state.followingList.length;
        const fakeUsers = Array(diff > limit ? limit : diff).fill().map(v => ({
            id: Math.random().toString(),
            nickname: Math.floor(Math.random() * 1000),
        }));
        state.followingList = state.followingList.concat(fakeUsers);
        state.hasMoreFollowings = fakeUsers.length === limit
    }
};

export const actions = {
    signUp({ commit, state }, payload) {
        this.$axios.post('http://localhost:3085/user/', {
           email: payload.email,
           nickname: payload.nickname,
           password: payload.password,
        },{
            withCredentials: true,
        }).then((res) => {
            commit('setMe', res.data);
        }).catch((err) => {
            console.error(err);
        });
    }, 
    logIn({ commit }, payload) {
        this.$axios.post('http://localhost:3085/user/login', {
            email: payload.email,
            password: payload.password,
    },{
            withCredentials: true,
        }).then((res) => {
            commit('setMe', res.data);
        }).catch((err) => {
            console.error(err);
        });
    },
    logOut({ commit }) {
        this.$axios.post('http://localhost:3085/user/logout', {}, {
            withCredentials: true,
        })
            .then((data) => {
            commit('setMe', null);
        })
            .catch((err) => {
            console.error(err);
        });
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
    loadFollowers({ commit, state }, payload) {
        if (state.hasMoreFollowers) {
            commit('loadFollowers');
        }
    },
    loadFollowings({ commit, state }, payload) {
        if (state.hasMoreFollowings) {
            commit('loadFollowings');
        }
    }
}