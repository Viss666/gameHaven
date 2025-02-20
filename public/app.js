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

  mounted() {
    const mainContent = document.getElementById("main");
    mainContent.addEventListener("touchstart", this.closeMenuOnClickOutside); // Mobile
    mainContent.addEventListener("click", this.closeMenuOnClickOutside); //Desktop
  },
  beforeUnmount() {
    const mainContent = document.getElementById("main");
    mainContent.removeEventListener("touchstart", this.closeMenuOnClickOutside);
    mainContent.removeEventListener("click", this.closeMenuOnClickOutside);
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

    closeMenuOnClickOutside(event) {
      if (
        this.menuOpen &&
        !event.target.closest("nav") &&
        !event.target.closest(".menu-btn")
      ) {
        this.menuOpen = false;
      }
    },
  },
}).mount("#app");
