Vue.createApp({
  data() {
    return {
      currentPage: "home",
      menuOpen: false,
      dropdowns: {
        tcg: false,
        games: false,
      },
      mobileSubmenuOpen: null,

      events: [
        {
          id: "1234",
          title: "Thursday Night Firefight",
          game: "Warhammer 40,000",
          description:
            "Here is a description Here is a descriptionHere is a descriptionHere is a descriptionHere is a descriptionHere is a descriptionHere is a description",
          organizer: "Ezra",
          organizer_contact: "vistral9546@gmail.com",
          registered_players: [
            {
              player_name: "Grant",
              discord_id: "hammerhammer",
            },
            {
              player_name: "Adrian",
              discord_id: "GWOTH",
            },
          ],
          day: "Thursday",
          date: "03/26/25",
          time: "6:00PM",
        },
      ],
      activeEvent: null,
    };
  },
  computed: {
    // I wanted to have it so that selecting a tab could give you a different background image, this is how I implemented that
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

  // Mounted/unmounted, this is so that a user on mobile can tap off the navigation to make it disappear
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
    // Explanatory
    navigatePage(page) {
      this.currentPage = page;
      // Close all dropdowns on navigation

      Object.keys(this.dropdowns).forEach(
        (key) => (this.dropdowns[key] = false)
      );
      if (this.menuOpen) {
        this.menuOpen = false;
      }
      this.setActiveLink();
      this.mobileSubmenuOpen = null; // Close mobile submenu on page navigation
    },

    // Toggles submenus
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      this.mobileSubmenuOpen = null; // Close mobile submenu when menu toggles
    },
    toggleMobileSubmenu(submenu) {
      if (this.mobileSubmenuOpen === submenu) {
        this.mobileSubmenuOpen = null; // Close if already open
      } else {
        this.mobileSubmenuOpen = submenu; // Open the selected submenu
      }
    },
    // logic to close the submenu when clicking off
    closeMenuOnClickOutside(event) {
      if (
        this.menuOpen &&
        !event.target.closest("nav") &&
        !event.target.closest(".menu-btn")
      ) {
        this.menuOpen = false;
        this.mobileSubmenuOpen = null; // Close mobile submenu when menu closes
      }
    },
    // Navigates to an event in the events section based off the events id
    viewEvent(eventId) {
      // Find the event with the matching id
      this.activeEvent = this.events.find((event) => event.id === eventId);
      // Navigate to the event info/sign-up page (assumed to be "viewEvent")
      this.currentPage = "viewEvent";
    },
  },
}).mount("#app");
