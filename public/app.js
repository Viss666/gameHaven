Vue.createApp({
  data() {
    return {
      currentPage: "home",
    };
  },
  computed: {
    backgroundStyle() {
      const images = {
        home: "url('images/hex2.png')",
        tcg: "url('images/tcg.png')",
        games: "url('images/games.png')",
        events: "url('images/events.png')",
        rentals: "url('images/rentals.png')",
        contact: "url('images/contact.png')",
      };
      return { backgroundImage: images[this.currentPage] || "none" };
    },
  },
  methods: {
    navigatePage(page) {
      this.currentPage = page;
    },
  },
}).mount("#app");
