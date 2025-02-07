// app init
Vue.createApp({
  // where you hold your data
  data: function () {
    return {
      test: "hello",
    };
  },
  //   where you put your methods
  methods: {},
  //   if you have any methods or processes you want to call on creation, do them here. Usually
  //  along the lines of loading data from a server.
  created: function () {},
  //mount application using the id "app"
}).mount("#app");
