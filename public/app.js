Vue.createApp({
  data() {
    return {
      currentPage: "home",
      menuOpen: false,
      dropdowns: {
        tcg: false,
        games: false,
      },
      isAdmin: true,
      mobileSubmenuOpen: null,
      showCheckInForm: false,
      firstName: "",
      discordId: "",
      isCheckedIn: false,
      firstName: "",
      discordId: "",
      templates: null,
      events: [
        {
          id: "1234",
          title: "Thursday Night Firefight",
          game: "Warhammer 40,000",
          type: "example",
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
      newEvent: {
        title: "",
        game: "",
        type: "",
        description: "",
        organizer: "",
        organizer_contact: "",
        day: "",
        date: "",
        time: "",
      },
      activeEvent: null,
      checkedInEvents: [],
    };
  },
  computed: {
    // I wanted to have it so that selecting a tab could give you a different background image, this is how I implemented that
    backgroundStyle() {
      const images = {
        home: "url('images/hex2.png')",
        tcg: "url('images/tcg.png')",
        games: "url('images/games.png')",
        events: "url('images/hex2.png')",
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
    //get cookie
    getCookie(name) {
      const cookies = document.cookie.split("; ");
      const cookie = cookies.find((row) => row.startsWith(name + "="));
      return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
    },

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
      // console.log(this.events);
      this.activeEvent = this.events.find((event) => event.id === eventId);
      // Navigate to the event info/sign-up page (assumed to be "viewEvent")
      this.currentPage = "viewEvent";
      if (this.checkedInEvents.includes(this.activeEvent.id)) {
        this.isCheckedIn = true;
      } else {
        this.isCheckedIn = false;
      }
      console.log(this.activeEvent.registered_players);
    },
    openCheckIn() {
      this.showCheckInForm = true;
    },
    closeCheckIn() {
      this.showCheckInForm = false;
    },
    submitCheckIn(eventId) {
      if (!eventId || typeof eventId !== "string") {
        console.error("Invalid event ID:", eventId);
        return;
      }

      // Get existing events from cookie
      // let checkedInEvents = Cookies.get("checkedInEvents");
      // checkedInEvents = checkedInEvents ? JSON.parse(checkedInEvents) : [];

      // Prevent duplicate entries
      if (this.checkedInEvents.includes(eventId)) {
        alert("You are already checked in to this event.");
        return;
      }

      if (this.firstName && this.discordId) {
        // Save user info
        Cookies.set("firstName", this.firstName, { expires: 999 });
        Cookies.set("discordId", this.discordId, { expires: 999 });

        fetch(`https://gamehavenstg.com/events/${eventId}/add-player`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerName: this.firstName,
            playerDiscordID: this.discordId,
          }),
        })
          .then((response) => {
            if (!response.ok) throw new Error("Failed to check in.");
            return response.json();
          })
          .then((data) => {
            console.log("Check-in successful:", data);

            // Add event ID to the cookie
            this.checkedInEvents.push(eventId);
            Cookies.set(
              "checkedInEvents",
              JSON.stringify(this.checkedInEvents),
              {
                expires: 999,
              }
            );

            this.isCheckedIn = true;
            this.showCheckInForm = false;
            this.getEvents();
          })
          .catch((error) => {
            console.error("Error during check-in:", error);
            alert("Failed to check in. Please try again.");
          });
      } else {
        alert("Please enter both your name and Discord ID.");
      }
    },
    submitCheckOut(eventId) {
      if (!eventId || typeof eventId !== "string") {
        console.error("Invalid event ID:", eventId);
        return;
      }

      // Ensure user is checked into this event
      if (!this.checkedInEvents.includes(eventId)) {
        alert("You are not checked in to this event.");
        return;
      }

      fetch(`https://gamehavenstg.com/events/${eventId}/remove-player`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: this.firstName,
          playerDiscordID: this.discordId,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to check out.");
          return response.json();
        })
        .then((data) => {
          console.log("Check-out successful:", data);

          // Remove event ID from checked-in events
          this.checkedInEvents = this.checkedInEvents.filter(
            (id) => id !== eventId
          );
          Cookies.set("checkedInEvents", JSON.stringify(this.checkedInEvents), {
            expires: 999,
          });

          this.isCheckedIn = false;
          this.getEvents();
        })
        .catch((error) => {
          console.error("Error during check-out:", error);
          alert("Failed to check out. Please try again.");
        });
    },

    getEvents() {
      fetch("https://gamehavenstg.com/events")
        .then((response) => response.json())
        .then((eventsFromServer) => {
          // Normalize each event to match your template's properties
          this.events = eventsFromServer.map((event) => ({
            id: event._id, // assuming _id from MongoDB
            title: event.eventTitle,
            game: event.eventGame,
            type: event.eventType,
            description: event.eventDescription,
            organizer: event.eventOrganizer,
            organizer_contact: event.organizerContactInfo,
            registered_players: event.playerList || [], // Map playerList to registered_players
            day: event.eventDay,
            date: event.eventDate,
            time: event.eventTime,
          }));
          if (this.events.length > 0) {
            this.activeEvent = this.events[0]; // Set the first event as active
          }

          console.log("Normalized events:", this.events);
        })
        .catch((error) => console.error("Error fetching events:", error));
    },

    createEvent() {
      this.activeEvent = null;
      this.navigatePage("creation");
    },

    pushEvent() {
      const dateString = this.newEvent.Date;
      const formattedDate = new Date(dateString).toISOString().split("T")[0];

      const newEvent = {
        eventTitle: this.newEvent.title,
        eventGame: this.newEvent.game,
        eventType: this.newEvent.type,
        eventDescription: this.newEvent.description,
        eventOrganizer: this.newEvent.organizer,
        organizerContactInfo: this.newEvent.organizer_contact,
        eventDate: this.formattedDate,
        eventDay: this.newEvent.day,
        eventTime: this.newEvent.time,
        playerList: [],
        matches: [],
      };

      fetch("https://gamehavenstg.com/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to create event");
          }
          return response.json();
        })
        .then((createdEvent) => {
          console.log("Event created:", createdEvent);

          // Add the created event to the local events array
          this.events.push({
            id: createdEvent._id, // Assuming MongoDB returns _id
            title: createdEvent.eventTitle,
            game: createdEvent.eventGame,
            type: createdEvent.eventType,
            description: createdEvent.eventDescription,
            organizer: createdEvent.eventOrganizer,
            organizer_contact: createdEvent.organizerContactInfo,
            registered_players: createdEvent.playerList || [],
            day: createdEvent.eventDay,
            date: createdEvent.eventDate,
            time: createdEvent.eventTime,
          });

          // Reset form fields
          this.newEvent = {
            title: "",
            game: "",
            type: "",
            description: "",
            organizer: "",
            organizer_contact: "",
            day: "",
            date: "",
            time: "",
          };
        })
        .catch((error) => console.error("Error creating event:", error));
    },
    editEvent(eventId) {
      this.currentPage = "edit";
      this.activeEvent = this.events.find((event) => event.id === eventId);
    },
    deleteEvent(eventId) {
      fetch(`https://gamehavenstg.com/events/${eventId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete event");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Deleted event:", data);
          this.events = this.events.filter((event) => event.id !== eventId);
        })
        .catch((error) => console.error("Error deleting event:", error));
    },
    saveEvent(eventId) {
      fetch(`https://gamehavenstg.com/events/${eventId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventTitle: this.activeEvent.title,
          eventGame: this.activeEvent.game,
          eventType: this.activeEvent.type,
          eventDescription: this.activeEvent.description,
          eventOrganizer: this.activeEvent.organizer,
          organizerContactInfo: this.activeEvent.organizer_contact,
          eventDate: this.activeEvent.date,
          eventDay: this.activeEvent.day,
          eventTime: this.activeEvent.time,
          playerList: this.activeEvent.registered_players || [],
          matches: this.activeEvent.matches || [],
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update event");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Event updated:", data);
          // Optionally update the local events list
          this.events = this.events.map((event) =>
            event.id === eventId ? { ...event, ...this.activeEvent } : event
          );
        })
        .catch((error) => console.error("Error updating event:", error));
    },
  },
  created: function () {
    // console.log("Hello, world.")
    // this.getStories();
    // fetch("/sessions", {
    //     method: "GET",
    // }).then((response) => {
    //     response.json().then(data => {
    //         this.userId = data._id;
    //         this.user.username = data.username;
    //         this.user.isAdmin = data.isAdmin;
    //     })
    // })
    console.log("Hello, world");
    this.getEvents();
    if (this.events.length > 0) {
      this.activeEvent = this.events[0];
    }
    this.firstName = this.getCookie("firstName") || "";
    this.discordId = this.getCookie("discordId") || "";
    this.checkedInEvents = JSON.parse(
      this.getCookie("checkedInEvents") || "[]"
    );
    //this fetch will grab the first name/discord id from their cookie?
    //fetch()
  },
}).mount("#app");
