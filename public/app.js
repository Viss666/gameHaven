Vue.createApp({
  // where you hold your data
  data: function () {
    return {
      test: "hello",
      currentPage: "home",
    };
  },
  //   where you put your methods
  methods: {
    //Change the current page
    navigatePage: function (page) {
      this.currentPage = page;
    },
  },

  created: function () {},
}).mount("#app");
