Vue.createApp({
  data() {
    return {
      currentPage: "home",
      menuOpen: false,
      dropdowns: {
        tcg: false,
        games: false,
      },
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
      // Close all dropdowns on navigation

      Object.keys(this.dropdowns).forEach(
        (key) => (this.dropdowns[key] = false)
      );
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },

    toggleDropdown(menu) {
      // Close all dropdowns except the clicked one
      Object.keys(this.dropdowns).forEach((key) => {
        this.dropdowns[key] = key === menu ? !this.dropdowns[key] : false;
      });
    },
  },
}).mount("#app");
