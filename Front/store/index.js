export const state = () => ({
    hello: "vuex",
});

export const mutations = {
    bye(state) {
        state.hello = 'goodbye';
    }
};
//
// export const actions = {
//     nuxtSeverInit({ commit, dispatch, state})
// }