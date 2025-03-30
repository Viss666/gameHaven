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
      adminPassword: "",
      mobileSubmenuOpen: null,
      showCheckInForm: false,
      firstName: "",
      discordId: "",
      isCheckedIn: false,
      searchInput: "",
      firstName: "",
      discordId: "",
      templates: null,
      events: [],

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
      pairingsChanged: false, // Flag to track changes

      modifiedFields: {},
      loading: false,
      boardgames: [],
      loading: true,
      selectedGame: "All Games",

      error: null,
      gamesToBuy: [
        {
          title: "Settlers of Catan",
          price: "$49.99",
          recommended_players: "3-4",
          imgURL: "images/catan.png",
          year: "1995",
        },
        {
          title: "Klask",
          price: "$59.99",
          recommended_players: "2",
          imgURL: "images/klask.png",
          year: "2014",
        },
        {
          title: "Ticket to Ride",
          price: "$49.99",
          recommended_players: "2-5",
          imgURL: "images/ticketToRide.png",
          year: "2004",
        },
        {
          title: "Zombicide: Black Plague",
          price: "$87.99",
          recommended_players: "1-6",
          imgURL: "images/zombicide.png",
          year: "2015",
        },
        {
          title: "Twilight Imperium",
          price: "$129.99",
          recommended_players: "3-6",
          imgURL: "images/twilightImperium.png",
          year: "2017",
        },
        {
          title: "Scythe",
          price: "$79.99",
          recommended_players: "1-7",
          imgURL: "images/scythe.png",
          year: "2016",
        },
        {
          title: "Azul",
          price: "$29.99",
          recommended_players: "2-4",
          imgURL: "images/azul.png",
          year: "2017",
        },
        {
          title: "Dungeons and Dragons: Player's Handbook",
          price: "$59.99",
          recommended_players: "2-4",
          imgURL: "images/dndHandbook.png",
          year: "2024",
        },
        {
          title: "Dungeons and Dragons: Monster Manual",
          price: "$59.99",
          recommended_players: "2-4",
          imgURL: "images/dndMonster.png",
          year: "2024",
        },
        {
          title: "Dungeons and Dragons: Dungeon Master's Guide",
          price: "$59.99",
          recommended_players: "2-4",
          imgURL: "images/dndMaster.png",
          year: "2024",
        },
      ],
      showRentalDetail: false,
      selectedGame: "All Games",
    };
  },
  computed: {
    saveButtonDisabled() {
      return (
        Object.keys(this.modifiedFields).length === 0 && !this.pairingsChanged
      );
    },
    saveButtonDisabled() {
      return !this.pairingsChanged;
    },
    gameOptions() {
      const uniqueGames = new Set();
      this.events.forEach((event) => {
        uniqueGames.add(event.eventGame);
      });
      return ["All Games", ...uniqueGames]; // Add 'all' option
    },
    filteredEvents() {
      let filtered = this.events;

      if (this.selectedGame !== "All Games") {
        filtered = filtered.filter(
          (event) => event.eventGame === this.selectedGame
        );
      }

      if (this.searchInput) {
        const searchTerm = this.searchInput.toLowerCase();
        filtered = filtered.filter((event) =>
          event.eventTitle.toLowerCase().includes(searchTerm)
        );
      }

      return filtered;
    },
  },

  // Mounted/unmounted, this is so that a user on mobile can tap off the navigation to make it disappear
  mounted() {
    const mainContent = document.getElementById("main");
    mainContent.addEventListener("touchstart", this.closeMenuOnClickOutside); // Mobile
    mainContent.addEventListener("click", this.closeMenuOnClickOutside); //Desktop
    this.fetchBoardGames();
    console.log(this.events);
  },
  beforeUnmount() {
    const mainContent = document.getElementById("main");
    mainContent.removeEventListener("touchstart", this.closeMenuOnClickOutside);
    mainContent.removeEventListener("click", this.closeMenuOnClickOutside);
  },

  methods: {
    closeRentalDetail() {
      let rentalDetail = document.querySelector(".rental-detail-container"); //this.$refs.rentalDetailContainer;

      //console.log("rental detail ref: ", rentalDetail);
      rentalDetail.style.animation = "slideDownAnimation 1.5s";
      // rentalDetail.classList.add("slide");
      setTimeout(() => {
        //rentalDetail.style.animation = 'slideDownAnimation 1.5s';
        this.selectedGame = null;
      }, 1400);
      // this.selectedGame = null;
      return;
    },
    getRentalDetail(game) {
      this.showRentalDetail = true;
    },
    toggleRentalDetail(game) {
      this.selectedGame =
        this.selectedGame && this.selectedGame.id === game.id ? null : game;
      if (this.selectedGame == null) {
        return;
      }
      this.fetchBoardGameInfo(game);
    },
    getRandomCopiesAmount() {
      min = Math.ceil(0);
      max = Math.floor(9);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    fetchBoardGames() {
      fetch("https://boardgamegeek.com/xmlapi2/hot?type=boardgame")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text(); // BGG API returns XML
        })
        .then((str) => {
          const parser = new DOMParser();
          const xml = parser.parseFromString(str, "application/xml");
          const items = xml.querySelectorAll("item");

          // Map each item with thumbnail, name, yearPublished
          this.boardgames = Array.from(items).map((item) => ({
            id: item.getAttribute("id"),
            rank: item.getAttribute("rank"),
            name:
              item.querySelector("name")?.getAttribute("value") || "Unknown",
            yearPublished:
              item.querySelector("yearpublished")?.getAttribute("value") ||
              "Unknown",
            thumbnail:
              item.querySelector("thumbnail")?.getAttribute("value") || "",
            copies: this.getRandomCopiesAmount(),
            detailShow: false,
          }));

          this.loading = false;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.error = "Failed to fetch board games";
          this.loading = false;
        });
    },
    parseBoardGameXML(xmlDoc) {
      const item = xmlDoc.querySelector("item");
      this.selectedGame.minPlayers =
        item.querySelector("minplayers")?.getAttribute("value") || "";
      this.selectedGame.maxPlayers =
        item.querySelector("maxplayers")?.getAttribute("value") || "";
      this.selectedGame.minPlaytime =
        item.querySelector("minplaytime")?.getAttribute("value") || "";
      this.selectedGame.maxPlaytime =
        item.querySelector("maxplaytime")?.getAttribute("value") || "";
      this.selectedGame.minAge =
        item.querySelector("minage")?.getAttribute("value") || "";

      const gameData = {
        id: item.getAttribute("id"),
        thumbnail: item.querySelector("thumbnail")?.textContent || "",
        image: item.querySelector("image")?.textContent || "",
        description: item.querySelector("description")?.textContent || "",
        yearPublished:
          item.querySelector("yearpublished")?.getAttribute("value") || "",
        minPlayers:
          item.querySelector("minplayers")?.getAttribute("value") || "",
        maxPlayers:
          item.querySelector("maxplayers")?.getAttribute("value") || "",
        minPlaytime:
          item.querySelector("minplaytime")?.getAttribute("value") || "",
        maxPlaytime:
          item.querySelector("maxplaytime")?.getAttribute("value") || "",
        playingTime:
          item.querySelector("playingtime")?.getAttribute("value") || "",
        minAge: item.querySelector("minage")?.getAttribute("value") || "",
        pollResults: {
          suggestedPlayers: {},
          suggestedPlayerAge: {},
        },
      };
      const suggestedPlayersPoll = item.querySelector(
        "poll[name='suggested_numplayers']"
      );
      if (suggestedPlayersPoll) {
        suggestedPlayersPoll
          .querySelectorAll("results")
          .forEach((resultsNode) => {
            const numPlayers = resultsNode.getAttribute("numplayers");
            const bestVotes =
              resultsNode
                .querySelector("result[value='Best']")
                ?.getAttribute("numvotes") || "0";
            const recommendedVotes =
              resultsNode
                .querySelector("result[value='Recommended']")
                ?.getAttribute("numvotes") || "0";
            const notRecommendedVotes =
              resultsNode
                .querySelector("result[value='Not Recommended']")
                ?.getAttribute("numvotes") || "0";
            gameData.pollResults.suggestedPlayers[numPlayers] = {
              best: bestVotes,
              recommended: recommendedVotes,
              notRecommended: notRecommendedVotes,
            };
          });
      }
      const suggestedAgePoll = item.querySelector(
        "poll[name='suggested_playerage']"
      );
      if (suggestedAgePoll) {
        suggestedAgePoll.querySelectorAll("result").forEach((resultNode) => {
          const age = resultNode.getAttribute("value");
          const votes = resultNode.getAttribute("numvotes") || "0";
          gameData.pollResults.suggestedPlayerAge[age] = votes;
        });
      }
      let maxVotes = 0;
      let bestAge = null;
      for (const [age, votes] of Object.entries(
        gameData.pollResults.suggestedPlayerAge
      )) {
        const voteCount = parseInt(votes, 10);
        if (voteCount > maxVotes) {
          maxVotes = voteCount;
          bestAge = age;
        }
      }
      this.selectedGame.bestPlayerAge = bestAge;
      return gameData;
    },
    fetchBoardGameInfo(game) {
      //for (game in this.boardgames) {
      fetch("https://boardgamegeek.com/xmlapi2/thing?id=" + game.id)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          //console.log(response.text());
          return response.text();
        })
        .then((xmlText) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, "text/xml");
          const gameInfo = this.parseBoardGameXML(xmlDoc);
          console.log(gameInfo);
          console.log(this.selectedGame);
          //console.log(xmlDoc);
          //this.selectedGame.description = xmlDoc.querySelector('description').textContent;
        })
        .catch((error) => {
          console.error(`There was a problem with the fetch operation:`, error);
        });
    },
    clearInput() {
      this.searchInput = "";
      this.selectedGame = "All Games";
    },
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
      console.log("playerindex: ", playerIndex);
      console.log("player id: ", playerId);
      if (playerIndex === -1) {
        this.selectedPlayers.push(playerId);
        console.log(this.selectedPlayers);
      } else {
        this.selectedPlayers.splice(playerIndex, 1);
      }
      this.updatePairButtonState();
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "auto" });
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
        const player1 = this.activeEvent.playerList.find(
          (p) => p._id === this.selectedPlayers[0]
        );
        const player2 = this.activeEvent.playerList.find(
          (p) => p._id === this.selectedPlayers[1]
        );

        if (player1 && player2) {
          this.pairedPlayers.push({
            player1: player1,
            player2: player2,
          });
          console.log("paired players: ", this.pairedPlayers);
          this.pairingsChanged = true; // Set flag to true
        }
        console.log("post selected players: ", this.selectedPlayers);
        this.selectedPlayers = [];
        this.updatePairButtonState();
      }
    },

    // removePair(index) {
    //   this.pairedPlayers.splice(index, 1);
    //   this.savePairsToEvent(); // Update the event after removing a pair
    // },

    removePair(index) {
      this.pairedPlayers.splice(index, 1);
      this.pairingsChanged = true; // Set flag to true
    },

    // Explanatory
    navigatePage(page) {
      if (page == "events") {
        console.log(this.events);

        this.getEvents();
      }
      if (page == "rentals") {
        //this.fetchBoardGameInfo();
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
      this.scrollToTop();
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
        const player1 = this.activeEvent.playerList.find(
          (p) => p._id === playerId
        );

        if (player1) {
          this.pairedPlayers.push({
            player1: player1,
            player2: null,
            isBye: true, // Set isBye to true
          });
          this.pairingsChanged = true;
        }

        this.selectedPlayers = [];
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
      //this.saveEvent(eventId);
    },

    // saveEvent(eventId) {
    //   // console.log("Modified fields:", this.modifiedFields);
    //   this.scrollToTop();
    //   this.loading = true;
    //   console.log("Pairings changed:", this.pairingsChanged);
    //   if (this.pairingsChanged) {
    //     const matchesToSend = this.pairedPlayers.map((pair) => ({
    //       player1: pair.player1 ? { _id: pair.player1._id } : null,
    //       player2: pair.player2 ? { _id: pair.player2._id } : null,
    //     }));
    //     console.log("matches to send:", matchesToSend);
    //     this.modifiedFields.matches = matchesToSend;
    //   }

    //   fetch(`https://gamehavenstg.com/events/${eventId}`, {
    //     method: "PUT",
    //     credentials: "include",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(this.modifiedFields),
    //   })
    //     .then((response) => {
    //       if (!response.ok) {
    //         throw new Error("Failed to update event");
    //       }
    //       console.log(response);
    //       return response.json();
    //     })
    //     .then((data) => {
    //       console.log("Event updated:", data);
    //       // Update local event data
    //       const index = this.events.findIndex((event) => event.id === eventId);
    //       if (index !== -1) {
    //         this.events[index] = {
    //           ...this.events[index],
    //           ...data,
    //         };
    //       }

    //       this.activeEvent = {
    //         ...this.activeEvent,
    //         ...data,
    //       };

    //       this.modifiedFields = {}; // Reset modified fields
    //       this.pairingsChanged = false; // Reset pairings changed flag
    //       this.loading = false;
    //     })
    //     .catch((error) => console.error("Error updating event:", error))
    //     .finally(() => {
    //       this.loading = false; // Set loading to false after promise resolves
    //       // this.getEvents();
    //       // this.editEvent(this.activeEvent.id);
    //     });
    // },
    // saveEvent(eventId) {
    //   console.log("Save event paired players", this.pairedPlayers);
    //   this.scrollToTop();
    //   this.loading = true;
    //   if (this.pairingsChanged) {
    //     const matchesToSend = this.pairedPlayers.map((pair) => ({
    //       player1: pair.player1 ? { _id: pair.player1._id } : null,
    //       player2: pair.player2 ? { _id: pair.player2._id } : null,
    //     }));
    //     console.log("matches to send: ", matchesToSend);
    //     this.modifiedFields.matches = matchesToSend;
    //   }
    //   fetch(`https://gamehavenstg.com/events/${eventId}`, {
    //     method: "PUT",
    //     credentials: "include",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(this.modifiedFields),
    //   })
    //     .then((response) => {
    //       if (!response.ok) {
    //         throw new Error("Failed to update event");
    //       }
    //       return response.json();
    //     })
    //     .then((data) => {
    //       this.activeEvent = data;
    //       const index = this.events.findIndex((event) => event.id === eventId);
    //       if (index !== -1) {
    //         this.events[index] = data;
    //       }
    //       this.modifiedFields = {};
    //       this.pairingsChanged = false;
    //     })
    //     .catch((error) => console.error("Error updating event:", error))
    //     .finally(() => {
    //       this.loading = false;
    //       // this.viewEvent(eventId);
    //     });
    // },
    saveEvent(eventId) {
      console.log("Save event paired players", this.pairedPlayers);
      this.scrollToTop();
      this.loading = true;
      if (this.pairingsChanged) {
        const matchesToSend = this.pairedPlayers.map((pair) => ({
          player1: pair.player1 ? pair.player1 : null, // Send the entire player object
          player2: pair.player2 ? pair.player2 : null, // Send the entire player object
        }));
        console.log("matches to send: ", matchesToSend);
        this.modifiedFields.matches = matchesToSend;
      }
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
          this.activeEvent = data;
          const index = this.events.findIndex((event) => event.id === eventId);
          if (index !== -1) {
            this.events[index] = data;
          }
          this.modifiedFields = {};
          this.pairingsChanged = false;
        })
        .catch((error) => console.error("Error updating event:", error))
        .finally(() => {
          this.loading = false;
          // this.viewEvent(eventId);
        });
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
