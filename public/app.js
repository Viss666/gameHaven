Vue.createApp({
  data() {
    return {
      currentPage: "home",
      menuOpen: false,
      dropdowns: {
        tcg: false,
        games: false,
      },
      isAdmin: false,
      adminPassword: "",
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
        eventTitle: "",
        eventGame: "",
        eventType: "",
        eventDescription: "",
        eventOrganizer: "",
        organizerContactInfo: "",
        eventDay: "",
        eventDate: "",
        eventTime: "",
      },
      activeEvent: null,
      checkedInEvents: [],
      selectedPlayers: [],
      pairedPlayers: [],
      modifiedFields: {},
      loading: false,
    };
  },
  computed: {
    // I wanted to have it so that selecting a tab could give you a different background image, this is how I implemented that
    // backgroundStyle() {
    //   const images = {
    //     home: "url('images/hex2.png')",
    //     tcg: "url('images/tcg.png')",
    //     games: "url('images/games.png')",
    //     events: "url('images/hex2.png')",
    //     rentals: "url('images/rentals.png')",
    //     contact: "url('images/contact.png')",
    //   };
    //   return { backgroundImage: images[this.currentPage] || "none" };
    // },
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
    convertToStandardTime(militaryTime) {
      if (!militaryTime) return ""; // Handle null or empty time

      const [hours, minutes] = militaryTime.split(":");
      let standardHours = parseInt(hours, 10);
      const standardMinutes = minutes;
      let period = "AM";

      if (standardHours >= 12) {
        period = "PM";
        if (standardHours > 12) {
          standardHours -= 12;
        }
      } else if (standardHours === 0) {
        standardHours = 12; // Midnight is 12 AM
      }

      return `${standardHours}:${standardMinutes} ${period}`;
    },
    //get cookie
    getCookie(name) {
      const cookies = document.cookie.split("; ");
      const cookie = cookies.find((row) => row.startsWith(name + "="));
      return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
    },

    updateActiveEvent(field, value) {
      this.activeEvent[field] = value;
      this.modifiedFields[field] = value;
    },

    togglePlayerSelection(playerId) {
      const playerIndex = this.selectedPlayers.indexOf(playerId);
      if (playerIndex === -1) {
        this.selectedPlayers.push(playerId);
      } else {
        this.selectedPlayers.splice(playerIndex, 1);
      }
      this.updatePairButtonState();
    },

    updatePairButtonState() {
      this.$nextTick(() => {
        if (this.$refs.pairButton) {
          this.$refs.pairButton.disabled = this.selectedPlayers.length !== 2;
        }
      });
    },

    pairSelectedPlayers() {
      if (this.selectedPlayers.length === 2) {
        // Assuming your players are in activeEvent.registered_players
        const player1 = this.activeEvent.playerList.find(
          (p) => p._id === this.selectedPlayers[0] // Use _id
        );
        const player2 = this.activeEvent.playerList.find(
          (p) => p._id === this.selectedPlayers[1] // Use _id
        );
        //console.log(player1);
        // console.log(player2);

        if (player1 && player2) {
          this.pairedPlayers.push({
            player1: player1, // Store player1's _id
            player2: player2, // Store player2's _id
          });
        }
        // console.log("paired players:", this.pairedPlayers);
        // console.log(this.selectedPlayers);
        this.savePairsToEvent(); // Update the event with the new pairs

        this.selectedPlayers = [];
        this.updatePairButtonState();
      }
    },

    removePair(index) {
      this.pairedPlayers.splice(index, 1);
      this.savePairsToEvent(); // Update the event after removing a pair
    },

    savePairsToEvent() {
      // console.log("paired players:", this.pairedPlayers);

      // Prepare the matches data with player _ids
      const matchesToSend = this.pairedPlayers.map((pair) => ({
        player1: { _id: pair.player1._id },
        player2: { _id: pair.player2._id },
      }));

      this.modifiedFields.matches = matchesToSend;

      // Send updated pairs to the backend
      this.saveEvent(this.activeEvent.id);
    },

    // Explanatory
    navigatePage(page) {
      if (page == "events") {
        this.getEvents();
      }
      this.currentPage = page;
      // Close all dropdowns on navigation

      Object.keys(this.dropdowns).forEach(
        (key) => (this.dropdowns[key] = false)
      );
      if (this.menuOpen) {
        this.menuOpen = false;
      }
      // this.setActiveLink();
      this.mobileSubmenuOpen = null; // Close mobile submenu on page navigation
    },

    verifyAdmin() {
      if (this.adminPassword == "friend") {
        this.isAdmin = true;
        this.currentPage = "events";
      } else {
        alert("wrong password you are not friend");
        this.adminPassword = "";
        return;
      }
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

    viewEvent(eventId) {
      this.loading = true;
      // console.log("i am clicked");
      fetch(`https://gamehavenstg.com/events/${eventId}`)
        .then((response) => response.json())
        .then((eventFromServer) => {
          let formattedDate = eventFromServer.eventDate;

          let formattedTime = this.convertToStandardTime(
            eventFromServer.eventTime
          ); // Convert time

          if (formattedDate) {
            formattedDate = formattedDate.split("T")[0]; // Split at "T" and take the date part
          } else {
            formattedDate = ""; // Or some other default value
          }
          // console.log("Fetched Event:", eventFromServer); // Debugging log

          // Normalize the event data (if needed)
          this.activeEvent = {
            _id: eventFromServer._id,
            eventTitle: eventFromServer.eventTitle,
            eventGame: eventFromServer.eventGame,
            eventType: eventFromServer.eventType,
            eventDescription: eventFromServer.eventDescription,
            eventOrganizer: eventFromServer.eventOrganizer,
            organizerContactInfo: eventFromServer.organizerContactInfo,
            playerList: eventFromServer.playerList.map((player) => ({
              player_name: player.playerName,
              discord_id: player.playerDiscordID,
              _id: player._id,
            })),
            eventDay: eventFromServer.eventDay,
            eventDate: formattedDate,
            // eventDate: eventFromServer.eventDate,
            eventTime: formattedTime,
            matches: eventFromServer.matches, // Matches array will be populated
            isPublished: eventFromServer.isPublished,
          };
          //console.log("activeEvent:", this.activeEvent); // Log the activeEvent

          // console.log(this.activeEvent.registered_players);
          this.pairedPlayers = eventFromServer.matches.map((match) => ({
            player1: match.player1
              ? {
                  player_name: match.player1.playerName,
                  _id: match.player1._id,
                }
              : null,
            player2: match.player2
              ? {
                  player_name: match.player2.playerName,
                  _id: match.player2.id,
                }
              : null,
          }));
          if (this.checkedInEvents.includes(this.activeEvent._id)) {
            this.isCheckedIn = true;
          } else {
            this.isCheckedIn = false;
          }

          this.currentPage = "viewEvent";
          // console.log("viewed event: ", this.activeEvent.id);

          //Place any code here that enables the check out button.
        })
        .catch((error) => console.error("Error fetching single event:", error))
        .finally(() => {
          this.loading = false;
          // console.log("viewed event: ", this.activeEvent.id);
        });

      // this.currentPage = "viewEvent";
    },
    openCheckIn() {
      this.showCheckInForm = true;
    },
    closeCheckIn() {
      this.showCheckInForm = false;
    },

    // submitCheckIn(eventId) {
    //   this.loading = true;

    //   if (!eventId || typeof eventId !== "string") {
    //     console.error("Invalid event ID:", eventId);
    //     return;
    //   }

    //   if (this.checkedInEvents.includes(eventId)) {
    //     alert("You are already checked in to this event.");
    //     this.loading = false;
    //     return;
    //   }

    //   console.log("first name and discord id:", this.firstName, this.discordId);

    //   if (this.firstName && this.discordId) {
    //     Cookies.set("firstName", this.firstName, { expires: 999 });
    //     Cookies.set("discordId", this.discordId, { expires: 999 });

    //     fetch(`https://gamehavenstg.com/events/${eventId}/add-player`, {
    //       method: "PUT",
    //       credentials: "include",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         playerName: this.firstName,
    //         playerDiscordID: this.discordId,
    //       }),
    //     })
    //       .then((response) => {
    //         if (!response.ok) throw new Error("Failed to check in.");
    //         return response.json();
    //       })
    //       .then((data) => {
    //         console.log("Check-in successful:", data);

    //         // Ensure `checkedInEvents` is initialized as an array
    //         if (!Array.isArray(this.checkedInEvents)) {
    //           this.checkedInEvents = [];
    //         }

    //         // Immediately update checked-in events and store in cookies
    //         this.checkedInEvents = [...this.checkedInEvents, eventId];
    //         Cookies.set(
    //           "checkedInEvents",
    //           JSON.stringify(this.checkedInEvents),
    //           {
    //             expires: 999,
    //           }
    //         );

    //         this.isCheckedIn = true;
    //         this.showCheckInForm = false;

    //         if (
    //           this.activeEvent &&
    //           Array.isArray(this.activeEvent.playerList)
    //         ) {
    //           this.activeEvent.playerList.push({
    //             player_name: this.firstName,
    //             discord_id: this.discordId,
    //           });
    //         } else {
    //           console.warn(
    //             "activeEvent or playerList is not properly initialized."
    //           );
    //         }
    //       })
    //       .catch((error) => {
    //         console.error("Error during check-in:", error);
    //         alert("Failed to check in. Please try again.");
    //       })
    //       .finally(() => {
    //         // this.loading = false;

    //         // Refresh event list and view event
    //         this.getEvents().then(() => {
    //           this.viewEvent(eventId);
    //         });
    //       });
    //   } else {
    //     alert("Please enter both your name and Discord ID.");
    //     this.loading = false;
    //   }
    // },
    submitCheckIn(eventId) {
      this.loading = true; // Keep loading active

      if (!eventId || typeof eventId !== "string") {
        console.error("Invalid event ID:", eventId);
        this.loading = false;
        return;
      }
      const now = new Date();
      console.log(now);

      if (this.checkedInEvents.includes(eventId)) {
        alert("You are already checked in to this event.");
        this.loading = false;
        return;
      }

      // console.log("first name and discord id:", this.firstName, this.discordId);

      if (this.firstName && this.discordId) {
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
            // console.log("Check-in successful:", data);

            if (!Array.isArray(this.checkedInEvents)) {
              this.checkedInEvents = [];
            }

            this.checkedInEvents = [...this.checkedInEvents, eventId];
            Cookies.set(
              "checkedInEvents",
              JSON.stringify(this.checkedInEvents),
              { expires: 999 }
            );

            this.isCheckedIn = true;
            this.showCheckInForm = false;

            if (
              this.activeEvent &&
              Array.isArray(this.activeEvent.playerList)
            ) {
              this.activeEvent.playerList.push({
                player_name: this.firstName,
                discord_id: this.discordId,
              });
            } else {
              console.warn(
                "activeEvent or playerList is not properly initialized."
              );
            }

            return this.getEvents(); // Fetch updated event list
          })
          .then(() => {
            return this.viewEvent(eventId); // Load the event view while keeping loading active
          })
          .catch((error) => {
            console.error("Error during check-in:", error);
            alert("Failed to check in. Please try again.");
            this.loading = false;
          });
      } else {
        alert("Please enter both your name and Discord ID.");
        this.loading = false;
      }
    },

    giveBye() {
      if (this.selectedPlayers.length === 1) {
        const playerId = this.selectedPlayers[0];
        fetch(
          `https://gamehavenstg.com/events/${this.activeEvent.id}/give-bye`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ playerId }),
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to give bye");
            }
            return response.json();
          })
          .then((data) => {
            // Handle success (e.g., update pairedPlayers, clear selectedPlayers)
            console.log("Bye given:", data);
            this.pairedPlayers.push({
              player1: {
                player_name: this.activeEvent.playerList.find(
                  (p) => p._id === playerId
                ).player_name,
                _id: playerId,
              },
              player2: null, // or isBye: true
              isBye: true,
            });
            this.selectedPlayers = [];
            this.getEvents(); // Refresh event data
          })
          .catch((error) => console.error("Error giving bye:", error));
      }
    },

    submitCheckOut(eventId) {
      this.loading = true;
      if (!eventId || typeof eventId !== "string") {
        console.error("Invalid event ID:", eventId);
        return;
      }

      if (!this.checkedInEvents.includes(eventId)) {
        alert("You are not checked in to this event.");
        return;
      }

      const player = this.activeEvent.playerList.find(
        (p) => p.discord_id === this.discordId
      );

      if (!player) {
        alert("Player not found.");
        return;
      }

      fetch(`https://gamehavenstg.com/events/${eventId}/remove-player`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: player._id }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to check out.");
          return response.json();
        })
        .then((data) => {
          // console.log("Check-out successful:", data);

          // Remove from checkedInEvents
          const index = this.checkedInEvents.indexOf(eventId);
          if (index > -1) {
            this.checkedInEvents.splice(index, 1);
            Cookies.set(
              "checkedInEvents",
              JSON.stringify(this.checkedInEvents),
              { expires: 999 }
            );
          }

          this.isCheckedIn = false;
        })
        .catch((error) => {
          console.error("Error during check-out:", error);
          alert("Failed to check out. Please try again.");
        })
        .finally(() => {
          this.loading = false;

          this.viewEvent(eventId);
        });
    },

    updateCheckedInEvents() {
      let storedEvents = Cookies.get("checkedInEvents");
      storedEvents = storedEvents ? JSON.parse(storedEvents) : [];

      if (!this.discordId) {
        console.warn("Discord ID missing, cannot update checked-in events.");
        return;
      }

      // Find the player's _id across all events
      let playerId = null;
      for (const event of this.events) {
        const player = event.playerList.find(
          (p) => p.discord_id === this.discordId
        );
        if (player) {
          playerId = player._id;
          break;
        }
      }

      if (!playerId) {
        console.warn(
          "Player not found in any event, clearing checked-in events."
        );
        this.checkedInEvents = [];
        Cookies.set("checkedInEvents", JSON.stringify([]), { expires: 999 });
        return;
      }

      // Keep only the events where the user is still checked in
      this.checkedInEvents = storedEvents.filter((eventId) => {
        const event = this.events.find((e) => e.id === eventId);
        return event?.playerList.some((p) => p._id === playerId);
      });

      Cookies.set("checkedInEvents", JSON.stringify(this.checkedInEvents), {
        expires: 999,
      });

      // console.log("Updated checked-in events:", this.checkedInEvents);
    },

    removePlayerFromEvent(eventId, playerId) {
      // console.log(eventId, playerId);
      fetch(`https://gamehavenstg.com/events/${eventId}/admin-remove-player`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }), // Correct key expected by backend
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to remove player");
          return response.json();
        })
        .then((data) => {
          // console.log("Successfully removed player", data);
          this.getEvents().then(() => {
            const updatedEvent = this.events.find(
              (event) => event.id === eventId
            );
            if (updatedEvent) {
              this.activeEvent = updatedEvent;
            }
          });
          this.currentPage = "edit";
        })
        .catch((error) => console.error("Error removing player:", error));
    },

    getEvents() {
      return fetch("https://gamehavenstg.com/events")
        .then((response) => response.json())
        .then((eventsFromServer) => {
          this.events = eventsFromServer.map((event) => {
            let formattedDate = event.eventDate;
            let formattedTime = this.convertToStandardTime(event.eventTime);

            if (formattedDate) {
              formattedDate = formattedDate.split("T")[0]; // Split at "T" and take the date part
            }

            return {
              id: event._id,
              eventTitle: event.eventTitle,
              eventGame: event.eventGame,
              eventType: event.eventType,
              eventDescription: event.eventDescription,
              eventOrganizer: event.eventOrganizer,
              organizerContactInfo: event.organizerContactInfo,
              playerList:
                event.playerList.map((player) => ({
                  player_name: player.playerName,
                  discord_id: player.playerDiscordID,
                  _id: player._id,
                })) || [],
              eventDay: event.eventDay,
              eventDate: formattedDate, // Use the formatted date
              eventTime: formattedTime,
              matches: event.matches,
              isPublished: event.isPublished,
            };
          });

          this.$nextTick(() => {
            this.updateCheckedInEvents();
          });
        })
        .catch((error) => console.error("Error fetching events:", error));
    },

    // getEvents() {
    //   return fetch("https://gamehavenstg.com/events") // Return the fetch promise
    //     .then((response) => response.json())
    //     .then((eventsFromServer) => {
    //       // Normalize each event to match your template's properties
    //       this.events = eventsFromServer.map((event) => ({

    //         id: event._id, // assuming _id from MongoDB
    //         eventTitle: event.eventTitle,
    //         eventGame: event.eventGame,
    //         eventType: event.eventType,
    //         eventDescription: event.eventDescription,
    //         eventOrganizer: event.eventOrganizer,
    //         organizerContactInfo: event.organizerContactInfo,
    //         playerList:
    //           event.playerList.map((player) => ({
    //             player_name: player.playerName,
    //             discord_id: player.playerDiscordID,
    //             _id: player._id, // Include the player's _id
    //           })) || [],
    //         eventDay: event.eventDay,
    //         eventDate: event.eventDate,
    //         eventTime: event.eventTime,
    //         matches: event.matches,
    //         isPublished: event.isPublished,
    //       }));

    // console.log("Normalized events:", this.events);
    //       this.$nextTick(() => {
    //         this.updateCheckedInEvents();
    //       });
    //     })
    //     .catch((error) => console.error("Error fetching events:", error));
    // },
    createEvent() {
      this.activeEvent = null;
      this.navigatePage("creation");
    },

    pushEvent() {
      // const formatEventDate = this.newEvent.eventDate;
      // formateeventDate.toISOString().split("T")[0];

      const newEvent = {
        eventTitle: this.newEvent.eventTitle,
        eventGame: this.newEvent.eventGame,
        eventType: this.newEvent.eventType,
        eventDescription: this.newEvent.eventDescription,
        eventOrganizer: this.newEvent.eventOrganizer,
        organizerContactInfo: this.newEvent.organizerContactInfo,
        eventDate: this.newEvent.eventDate,
        eventDay: this.newEvent.eventDay,
        eventTime: this.newEvent.eventTime,
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
          // console.log("Event created:", createdEvent);

          // Add the created event to the local events array
          this.events.push({
            _id: createdEvent._id, // Assuming MongoDB returns _id
            eventTitle: createdEvent.eventTitle,
            eventGame: createdEvent.eventGame,
            eventType: createdEvent.eventType,
            eventDescription: createdEvent.eventDescription,
            eventOrganizer: createdEvent.eventOrganizer,
            organizerContactInfo: createdEvent.organizerContactInfo,
            playerList: createdEvent.playerList || [],
            matches: createdEvent.matches || [],
            eventDay: createdEvent.eventDay,
            eventDate: createdEvent.eventDate,
            eventTime: createdEvent.eventTime,
          });

          // Reset form fields
          this.newEvent = {
            eventTitle: "",
            eventGame: "",
            eventType: "",
            eventDescription: "",
            eventOrganizer: "",
            organizerContactInfo: "",
            eventDay: "",
            eventDate: "",
            eventTime: "",
          };
        })
        .finally(() => {
          this.getEvents();
          this.currentPage = "events";
        })
        .catch((error) => console.error("Error creating event:", error));
    },
    editEvent(eventId) {
      this.currentPage = "edit";
      this.activeEvent = this.events.find((event) => event.id === eventId);
      // this.viewEvent(eventId);
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
          // console.log("Deleted event:", data);
          this.events = this.events.filter((event) => event.id !== eventId);
          this.currentPage = "events";
        })
        .catch((error) => console.error("Error deleting event:", error));
    },
    togglePublish(eventId) {
      // console.log("togglePublish called with eventId:", eventId);

      // Toggle the isPublished state
      this.activeEvent.isPublished = !this.activeEvent.isPublished;
      this.modifiedFields.isPublished = this.activeEvent.isPublished;

      // console.log("modifiedFields before saveEvent:", this.modifiedFields);
      this.saveEvent(eventId);
    },
    saveEvent(eventId) {
      // console.log("Modified fields:", this.modifiedFields);

      fetch(`https://gamehavenstg.com/events/${eventId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.modifiedFields),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update event");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Event updated:", data);
        })
        .catch((error) => console.error("Error updating event:", error));
    },
  },
  created: function () {
    this.getEvents();
    if (this.events.length > 0) {
      this.activeEvent = this.events[0];
    }
    this.firstName = this.getCookie("firstName") || "";
    this.discordId = this.getCookie("discordId") || "";
    this.checkedInEvents = JSON.parse(
      this.getCookie("checkedInEvents") || "[]"
    );
  },
}).mount("#app");
