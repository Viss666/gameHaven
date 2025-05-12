import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const App = {
  data() {
    return {
      currentPage: "home",
      menuOpen: false,
      isDarkMode: false,
      showCalendarTab: false,

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
        maxPlayers: null,
        iconUrl: "",
        eventFee: "",
      },
      activeEvent: {
        _id: null, // Or a default ID if applicable
        eventTitle: "",
        eventGame: "",
        eventDescription: "",
        eventOrganizer: "",
        organizerContactInfo: "",
        eventDate: null,
        eventDay: "",
        eventTime: "",
        maxPlayers: null,
        eventFee: null,
        isPublished: false,
        matches: [],
        iconUrl: "",
      },
      checkedInEvents: [],
      selectedPlayers: [],
      pairedPlayers: [],
      pairingsChanged: false,

      modifiedFields: {},
      maxPlayersOptions: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        39, 40,
      ],
      validationErrors: {},
      loading: false,
      boardgames: [],
      selectedGame: "All Games",

      templates: [],
      activeTemplate: [],

      error: null,
      featuredDeals: [
        {
          title: "Base Game Sale!",
          description: "Buy one base game get ANY expansion 25% off!",
          iconUrl: "images/boardgame.webp",
          goodUntil: "July",
        },
        // {
        //   title: "Dice Discount",
        //   description: "20% off all dice!",
        //   iconUrl: "images/dice.webp",
        //   goodUntil: "April",
        // },
        // {
        //   title: "Card Game Sale",
        //   description: "Buy two card games, get the third 50% off!",
        //   iconUrl: "images/cards.webp",
        //   goodUntil: "May",
        // },
        // {
        //   title: "Free Shipping on Orders Over $50",
        //   description: "Get free shipping on any in-store order over $50!",
        //   iconUrl: "images/boardgame.webp", // Or a more generic icon
        //   goodUntil: "June",
        // },
      ],
      gamesToBuy: [
        {
          title: "Settlers of Catan",
          price: "$49.99",
          recommended_players: "3-4",
          imgURL: "images/catan.webp",
          year: "1995",
        },
        {
          title: "Klask",
          price: "$59.99",
          recommended_players: "2",
          imgURL: "images/klask.webp",
          year: "2014",
        },
        {
          title: "Ticket to Ride",
          price: "$49.99",
          recommended_players: "2-5",
          imgURL: "images/ticketToRide.webp",
          year: "2004",
        },
        {
          title: "Zombicide: Black Plague",
          price: "$87.99",
          recommended_players: "1-6",
          imgURL: "images/zombicide.webp",
          year: "2015",
        },
        {
          title: "Twilight Imperium",
          price: "$129.99",
          recommended_players: "3-6",
          imgURL: "images/twilightImperium.webp",
          year: "2017",
        },
        {
          title: "Scythe",
          price: "$79.99",
          recommended_players: "1-7",
          imgURL: "images/scythe.webp",
          year: "2016",
        },
        {
          title: "Azul",
          price: "$29.99",
          recommended_players: "2-4",
          imgURL: "images/azul.webp",
          year: "2017",
        },
        {
          title: "Dungeons and Dragons: Player's Handbook",
          price: "$59.99",
          recommended_players: "2-4",
          imgURL: "images/dndHandbook.webp",
          year: "2024",
        },
        {
          title: "Dungeons and Dragons: Monster Manual",
          price: "$59.99",
          recommended_players: "2-4",
          imgURL: "images/dndMonster.webp",
          year: "2024",
        },
        {
          title: "Dungeons and Dragons: Dungeon Master's Guide",
          price: "$59.99",
          recommended_players: "2-4",
          imgURL: "images/dndMaster.webp",
          year: "2024",
        },
        {
          title: "Escape the Dark Sector",
          price: "$49.95",
          recommended_players: "1-4",
          imgURL: "images/darksector.webp",
          year: "2020",
        },
        {
          title: "Halo Flashpoint Spartan Edition",
          price: "$89.99",
          recommended_players: "2",
          imgURL: "images/flashpoint.webp",
          year: "2024",
        },
      ],
      tcgs: [
        {
          name: "TCG General",
          link: "https://gamehavenstgeorge.tcgplayerpro.com/",
          imageUrl: "images/tcgplayerlogo.webp",
        },
        {
          name: "Magic: The Gathering",
          link: "https://gamehavenstgeorge.tcgplayerpro.com/search/products?productLineName=Magic:+The+Gathering",
          imageUrl: "images/mtg-logo.webp",
        },
        {
          name: "Pokemon",
          link: "https://gamehavenstgeorge.tcgplayerpro.com/search/products?productLineName=Pokemon",
          imageUrl: "images/pokemon.webp",
        },
        {
          name: "Flesh and Blood",
          link: "https://gamehavenstgeorge.tcgplayerpro.com/search/products?productLineName=Flesh+and+Blood+TCG",
          imageUrl: "images/fleshandblood.webp",
        },
        {
          name: "Star Wars: Unlimited",
          link: "https://gamehavenstgeorge.tcgplayerpro.com/search/products?productLineName=Star+Wars:+Unlimited",
          imageUrl: "images/starwarsunlimited.webp",
        },
        {
          name: "Cardfight Vanguard",
          link: "https://gamehavenstgeorge.tcgplayerpro.com/search/products?productLineName=Cardfight+Vanguard",
          imageUrl: "images/vanguard.webp",
        },
      ],
      iconSelection: [
        {
          name: "Dice",
          imageUrl: "images/dice.webp",
        },
        {
          name: "Cards",
          imageUrl: "images/cards.webp",
        },
        {
          name: "Board Game",
          imageUrl: "images/boardgame.webp",
        },
      ],
      selectedIconUrl: "",
      hasReservedGame: false,
      showRentalDetail: false,
      selectedGameEvent: "All Games",
      showPhoneNumberInput: false,
      userPhoneNumber: "",
      isWideScreen: window.innerWidth >= 2040, // Only checked once on load
      calendar: null,
    };
  },

  computed: {
    formattedEvents() {
      return this.formatEvents(this.events);
    },
    gamesToDisplay() {
      const is4K = window.innerWidth >= 2040;
      return this.gamesToBuy.slice(0, is4K ? 4 : 3);
    },

    visibleEvents() {
      return this.filteredEvents.slice(0, this.isWideScreen ? 4 : 3);
    },

    saveButtonDisabled() {
      return (
        Object.keys(this.modifiedFields).length === 0 && !this.pairingsChanged
      );
    },
    pairedPlayerIds() {
      const ids = new Set();
      if (this.activeEvent && this.activeEvent.matches) {
        this.activeEvent.matches.forEach((match) => {
          if (match.player1?._id) ids.add(match.player1._id);
          if (match.player2?._id) ids.add(match.player2._id);
        });
      }
      return ids;
    },
    saveButtonDisabled() {
      return !this.pairingsChanged;
    },
    gameOptions() {
      const uniqueGames = new Set();
      this.events.forEach((event) => {
        uniqueGames.add(event.eventGame);
      });
      return ["All Games", ...uniqueGames];
    },
    filteredEvents() {
      let filtered = this.events;

      if (this.selectedGameEvent !== "All Games") {
        filtered = filtered.filter(
          (event) => event.eventGame === this.selectedGameEvent
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
    this.checkInitialUrl();
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode === "true") {
      this.isDarkMode = true;
    }
    // this.initializeCalendar();
    console.log("FullCalendar version:", window.FullCalendar.version);
    console.log("Available plugins:", Object.keys(window.FullCalendar));
    // console.log(this.events);
  },
  beforeUnmount() {
    const mainContent = document.getElementById("main");
    mainContent.removeEventListener("touchstart", this.closeMenuOnClickOutside);
    mainContent.removeEventListener("click", this.closeMenuOnClickOutside);
  },

  watch: {
    showCalendarTab(newValue, oldValue) {
      if (newValue) {
        // Wait for the DOM to update after the v-if becomes true
        this.$nextTick(() => {
          this.initializeCalendar();
        });
      } else if (this.calendar) {
        // Optionally destroy the calendar if the tab is hidden
        this.calendar.destroy();
        this.calendar = null;
      }
    },

    formattedEvents(newEvents) {
      if (this.calendar && this.showCalendarTab) {
        this.calendar.removeAllEvents();
        this.calendar.addEventSource(newEvents);
      }
    },
  },

  methods: {
    parseEventDate(dateString) {
      // If your dates are already in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
      if (typeof dateString === "string" && dateString.includes("T")) {
        return dateString;
      }

      // If your dates are in a different format, parse them here
      // Example for "MM/DD/YYYY" format:
      if (typeof dateString === "string" && dateString.includes("/")) {
        const [month, day, year] = dateString.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }

      // Fallback to current date if invalid
      console.warn("Invalid date format:", dateString);
      return new Date().toISOString();
    },
    initializeCalendar() {
      // Destroy existing calendar if it exists
      if (this.calendar) {
        this.calendar.destroy();
        this.calendar = null;
      }

      const formattedEvents = this.formatEvents(this.events); // If you have a separate formatting function
      console.log("Formatted events for calendar:", formattedEvents);

      const calendarEl = document.getElementById("calendar");
      if (!calendarEl) {
        console.error("Calendar element not found!");
        return;
      }

      try {
        // First verify FullCalendar and plugins are available
        if (!window.FullCalendar) {
          throw new Error("FullCalendar not loaded");
        }

        console.log(
          "Available FullCalendar plugins:",
          Object.keys(window.FullCalendar)
        );

        this.calendar = new window.FullCalendar.Calendar(calendarEl, {
          initialView: "dayGridMonth",

          events: this.formattedEvents,
          eventClick: (info) => {
            console.log("Clicked event:", info.event);
            // this.handleEventClick(info.event);
            this.viewEvent(info.event._def.publicId);
          },
          // Optional: customize event appearance
          eventContent: (arg) => {
            return {
              html: `<div class="fc-event-title">${arg.event.title}</div>`,
            };
          },
          headerToolbar: {
            // Configure the toolbar
            left: "prev,next", // Buttons on the left: previous, next, today
            center: "title", // Title in the center (current month/year)
            right: "dayGridMonth", // Buttons on the right for view selection
          },
        });

        this.calendar.render();
      } catch (error) {
        console.error("Failed to initialize calendar:", error);
        // Fallback to basic calendar if plugins fail
        this.calendar = new window.FullCalendar.Calendar(calendarEl, {
          initialView: "dayGridMonth",
          events: [],
        });
        this.calendar.render();
      }
    },
    toggleCalendar() {
      if (this.showCalendarTab == true) {
        this.showCalendarTab = false;
      } else {
        this.showCalendarTab = true;
      }
    },
    handleEventClick(info) {
      console.log("Clicked event info:", info.event);

      const eventId = info.event?.id;

      if (!eventId) {
        console.error("No event ID found in:", info.event);
        return;
      }

      this.viewEvent(eventId);
    },
    formattedEvents() {
      try {
        const events = this.formatEvents(this.events);
        return Array.isArray(events) ? events : [];
      } catch (error) {
        console.error("Error formatting events:", error);
        return [];
      }
    },
    formatEvents(rawEvents) {
      if (!Array.isArray(rawEvents)) return [];

      return rawEvents.map((event) => {
        let startDate = event.eventDate; // Assuming eventDate holds the date
        let startTime = event.eventTime; // Assuming eventTime holds the time
        let start = null;

        if (startDate) {
          startDate = startDate.split("T")[0]; // Basic date part extraction
          if (startTime) {
            start =
              startDate + "T" + this.convertToStandardTime(startTime) + ":00Z";
          } else {
            start = startDate; // Just the date if no time
          }
        }

        return {
          id: event._id,
          title: event.eventTitle || "No title",
          start: start,
          // ... other properties
        };
      });
    },
    validateEvent(event) {
      return event && typeof event === "object" && event.title && event.start;
    },
    closeRentalDetail(game) {
      let rentalDetail = document.querySelector(".rental-detail-container"); //this.$refs.rentalDetailContainer;
      this.showRentalDetail = false;
      this.showPhoneNumberInput = false;
      this.userPhoneNumber = "";
      game.userRentalButtonClicks = 0;
      //console.log("rental detail ref: ", rentalDetail);
      rentalDetail.style.animation = "slideDownAnimation 1.5s";
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
    toggleRentalDetail(game, isUnreserve, isWaitlisted) {
      if (isUnreserve) {
        let unreserveButton = document.getElementById("unreserve-button-id");
        unreserveButton.innerHTML = "Reserve";
        game.isReserved = false;
        game.isWaitlisted = false;
        game.userRentalButtonClicks = 0;
        game.copies += 1;
        return;
      }
      if (isWaitlisted) {
        let unwaitlistButton = document.getElementById("unwaitlist-button-id");
        unwaitlistButton.innerHTML = "Waitlist";
        game.isReserved = false;
        game.isWaitlisted = false;
        game.userRentalButtonClicks = 0;
        return;
      }
      this.selectedGame =
        this.selectedGame && this.selectedGame.id === game.id ? null : game;
      if (this.selectedGame == null) {
        return;
      }
      this.fetchBoardGameInfo(game);
    },
    isValidPhoneNumber(num) {
      const phoneRegex = /^\d{10}$/;
      return phoneRegex.test(num);
    },
    actualRentalButton(game, isReserve) {
      //use the hasReservedGame variable to check if the user has already reserved a game
      //if they already have, they can't do mulitple
      //do the shake animation if the user has already
      //reserved but are trying to do 2
      //also change the inner html of the outer button
      // to reflect if the user has already reserved it, also
      // subtract one from copies
      let theGame = this.boardgames.find((obj) => obj.id === game.id);
      let reserveButton = document.getElementById("rentalReserveButton");
      if (game.isReserved == true && theGame.userRentalButtonClicks < 2) {
        reserveButton.innerHTML = "Unreserve";
        theGame.isWaitlisted = false;
      }
      if (game.isReserved == true && theGame.userRentalButtonClicks >= 2) {
        reserveButton.innerHTML = "Unreserve";
        theGame.copies += 1;
        theGame.isReserved = false;
        theGame.reservedPhoneNumber = "";
        theGame.isWaitlisted = false;
      }

      console.log("game: ", theGame);
      theGame.userRentalButtonClicks += 1;
      let waitlistButton = document.getElementById("rentalWaitlistButton");
      theGame.isWaitlisted = false;

      let description = document.getElementById("detail-description-div");
      description.style.height = "20%";
      this.showPhoneNumberInput = true;

      if (isReserve && theGame.userRentalButtonClicks < 2) {
        reserveButton.innerHTML = "Submit";
        theGame.isWaitlisted = false;
      }
      if (!isReserve && theGame.userRentalButtonClicks < 2) {
        waitlistButton.innerHTML = "Submit";
        theGame.isWaitlisted = false;
      }

      if (isReserve && theGame.userRentalButtonClicks >= 2) {
        if (
          this.userPhoneNumber != "" &&
          this.isValidPhoneNumber(this.userPhoneNumber)
        ) {
          theGame.copies -= 1;
          reserveButton.innerHTML = "Reserved";
          theGame.isReserved = true;
          theGame.isWaitlisted = false;
          theGame.reservedPhoneNumber = this.userPhoneNumber;
          this.showPhoneNumberInput = false;
        } else {
          reserveButton.classList.add("shake");
          setTimeout(() => {
            reserveButton.classList.remove("shake");
          }, 300);
          return;
        }
      }
      if (!isReserve && theGame.userRentalButtonClicks >= 2) {
        if (
          this.userPhoneNumber != "" &&
          this.isValidPhoneNumber(this.userPhoneNumber)
        ) {
          waitlistButton.innerHTML = "Waitlisted";
          theGame.isWaitlisted = true;
          theGame.waitlistPhoneNumber = this.userPhoneNumber;
          this.showPhoneNumberInput = false;
        } else {
          waitlistButton.classList.add("shake");
          setTimeout(() => {
            waitlistButton.classList.remove("shake");
          }, 300);
          return;
        }
      }
    },
    getRandomCopiesAmount() {
      const min = Math.ceil(1);
      const max = Math.floor(6);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    fetchBoardGames() {
      fetch("https://boardgamegeek.com/xmlapi2/hot?type=boardgame")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((str) => {
          const parser = new DOMParser();
          const xml = parser.parseFromString(str, "application/xml");
          const items = xml.querySelectorAll("item");

          this.boardgames = Array.from(items)
            .slice(0, 48)
            .map((item) => ({
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
              isReserved: false,
              reservedPhoneNumber: "",
              userRentalButtonClicks: 0,
              isWaitlisted: false,
              waitlistPhoneNumber: "",
            }));

          this.loading = false;
          console.log("boardgames from api: ", this.boardgames);
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
      this.selectedGame.description = (
        item.querySelector("description")?.textContent || ""
      ) //.split("&#")[0].trim();
        // .split("&#")[0]
        .split("&mdash;description")[0]
        .replace(/&lsquo;/g, '"')
        .replace(/&rsquo;/g, '"')
        .replace(/&#10;/g, " ")
        .replace(/&ndash;/g, "-")
        .replace(/&mdash;/g, "— ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&gt;/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
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
          // console.log(gameInfo);
          // console.log(this.selectedGame);
          //console.log(xmlDoc);
          //this.selectedGame.description = xmlDoc.querySelector('description').textContent;
        })
        .catch((error) => {
          console.error(`There was a problem with the fetch operation:`, error);
        });
    },
    clearInput() {
      this.searchInput = "";
      this.selectedGameEvent = "All Games";
    },
    convertToStandardTime(time12h) {
      if (!time12h) return null;
      const [time, modifier] = time12h.split(" ");
      let [hours, minutes] = time.split(":");

      if (hours === "12") {
        hours = "00";
      }

      if (modifier === "PM") {
        hours = parseInt(hours, 10) + 12;
      }

      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
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
    handleEnter(event) {
      this.$nextTick(() => {
        const descriptionDiv = this.$refs.description;
        if (!descriptionDiv) {
          console.warn("Description ref not available.");
          return;
        }

        // Save the current selection
        const selection = window.getSelection();
        let range;
        if (selection.rangeCount > 0) {
          range = selection.getRangeAt(0).cloneRange();
        }

        // Save the current scroll position
        const scrollTop = descriptionDiv.scrollTop;

        // Perform the insertion
        if (range) {
          range.deleteContents();
          const newline = document.createTextNode("\n");
          range.insertNode(newline);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }

        const updatedDescription = descriptionDiv.innerHTML;
        this.updateActiveEvent("eventDescription", updatedDescription);

        // Restore the scroll position
        descriptionDiv.scrollTop = scrollTop;
      });
      event.preventDefault();
    },
    checkInitialUrl() {
      const pathSegments = window.location.pathname.split("/");
      if (pathSegments[1] === "events" && pathSegments[2]) {
        const eventIdFromUrl = pathSegments[2];
        this.viewEvent(eventIdFromUrl);
        this.currentPage = "viewEvent"; // Set the current page
      }
    },

    togglePlayerSelection(playerId) {
      const playerIndex = this.selectedPlayers.indexOf(playerId);
      // console.log("playerindex: ", playerIndex);
      // console.log("player id: ", playerId);
      if (playerIndex === -1) {
        this.selectedPlayers.push(playerId);
        // console.log(this.selectedPlayers);
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
          const newPair = {
            player1: { ...player1 },
            player2: { ...player2 },
          };
          this.activeEvent.matches.push(newPair);
          this.pairedPlayers.push(newPair);
          this.pairingsChanged = true;
        }
        this.selectedPlayers = [];
        this.updatePairButtonState();
      }
    },

    giveBye() {
      if (this.selectedPlayers.length === 1) {
        const playerId = this.selectedPlayers[0];
        const player1 = this.activeEvent.playerList.find(
          (p) => p._id === playerId
        );
        if (player1) {
          this.activeEvent.matches.push({
            player1: { ...player1 },
            player2: null,
            isBye: true,
          });
          this.pairingsChanged = true;
        }
        this.selectedPlayers = [];
      }
    },

    removePair(index) {
      this.activeEvent.matches.splice(index, 1);
      this.pairingsChanged = true;
    },

    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem("darkMode", this.isDarkMode);
    },

    // Explanatory
    navigatePage(page) {
      this.validationErrors = {};
      if (page === "events" || page === "home") {
        this.getEvents();
        this.activeEvent = null;

        const newPath = page === "home" ? "/" : "/events";

        if (window.location.pathname !== newPath) {
          history.pushState(null, "Game Haven STG Events", newPath);
        }
      } else {
        if (window.location.pathname !== `/${page}`) {
          history.pushState(null, "", `/${page}`);
        }
        this.activeEvent = null;
      }
      if (page === "events") {
        this.showCalendarTab = true;
        this.$nextTick(() => {
          // Small timeout to ensure DOM is fully ready
          setTimeout(() => this.initializeCalendar(), 50);
        });
      } else {
        this.showCalendarTab = false;
        // Clean up calendar when leaving events page
        if (this.calendar) {
          this.calendar.destroy();
          this.calendar = null;
        }
      }
      this.currentPage = page;

      Object.keys(this.dropdowns).forEach(
        (key) => (this.dropdowns[key] = false)
      );
      if (this.menuOpen) this.menuOpen = false;

      this.mobileSubmenuOpen = null;
      this.scrollToTop();
    },

    verifyAdmin() {
      const lol = "R0gyMDI1";
      const password = atob(lol);
      const enteredPassword = this.adminPassword;

      if (enteredPassword === password) {
        this.isAdmin = true;
        this.currentPage = "events";
      } else {
        alert("Incorrect password, try again");
        this.adminPassword = "";
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

    redirectTo(link) {
      window.open(link, "_blank");
    },

    viewEvent(eventId) {
      // this.loading = true;
      this.startLoading();
      this.scrollToTop();
      // console.log("i am clicked");
      fetch(`https://gamehavenstg.com/api/events/${eventId}`)
        .then((response) => response.json())
        .then((eventFromServer) => {
          let formattedDate = eventFromServer.eventDate;

          let formattedTime = this.convertToStandardTime(
            eventFromServer.eventTime
          );

          if (formattedDate) {
            formattedDate = formattedDate.split("T")[0];
          } else {
            formattedDate = "";
          }

          const eventUrl = `https://gamehavenstg.com/events/${eventFromServer._id}`;

          this.activeEvent = {
            _id: eventFromServer._id,
            eventTitle: eventFromServer.eventTitle,
            eventGame: eventFromServer.eventGame,
            eventType: eventFromServer.eventType,
            eventDescription: eventFromServer.eventDescription,
            eventOrganizer: eventFromServer.eventOrganizer,
            organizerContactInfo: eventFromServer.organizerContactInfo,
            playerList: eventFromServer.playerList.map((player) => ({
              playerName: player.playerName,
              playerDiscordID: player.playerDiscordID,
              _id: player._id,
            })),
            eventDay: eventFromServer.eventDay,
            eventDate: formattedDate,
            eventTime: formattedTime,
            matches: eventFromServer.matches,
            isPublished: eventFromServer.isPublished,
            maxPlayers: eventFromServer.maxPlayers,
            iconUrl: eventFromServer.iconUrl,
            eventUrl: eventUrl,
            eventFee: eventFromServer.eventFee,
          };
          //console.log("activeEvent:", this.activeEvent);

          this.pairedPlayers = eventFromServer.matches.map((match) => ({
            player1: match.player1
              ? {
                  playerName: match.player1.playerName,
                  _id: match.player1._id,
                }
              : null,
            player2: match.player2
              ? {
                  playerName: match.player2.playerName,
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
          history.pushState(
            { eventId: eventFromServer._id },
            eventFromServer.eventTitle,
            `/events/${eventFromServer._id}`
          );
        })
        .catch((error) => console.error("Error fetching single event:", error))
        .finally(() => {
          this.stopLoading();
          // console.log("viewed event: ", this.activeEvent.id);
        });
    },
    openCheckIn() {
      this.showCheckInForm = true;
    },
    closeCheckIn() {
      this.showCheckInForm = false;
    },
    submitCheckIn(eventId) {
      this.startLoading();

      if (this.firstName == "") {
        this.stopLoading();
        alert("Please enter your first name and last initial");
      }

      if (!eventId || typeof eventId !== "string") {
        console.error("Invalid event ID:", eventId);
        this.stopLoading();
        return;
      }

      if (this.checkedInEvents.includes(eventId)) {
        alert("You are already checked in to this event.");
        this.stopLoading();
        return;
      }

      if (this.firstName) {
        Cookies.set("firstName", this.firstName, { expires: 999 });
        if (this.discordId) {
          Cookies.set("discordId", this.discordId, { expires: 999 });
        } else {
          this.discordId = "";
        }

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
            // **Update the cookie ONLY on successful check-in.**
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
                playerName: this.firstName,
                playerDiscordID: this.discordId,
              });
            } else {
              console.warn(
                "activeEvent or playerList is not properly initialized."
              );
            }

            return this.getEvents();
          })
          .then(() => {
            return this.viewEvent(eventId);
          })
          .catch((error) => {
            console.error("Error during check-in:", error);
            alert("Failed to check in. Please try again.");
            this.stopLoading();
          });
      } else {
        this.stopLoading();
      }
    },

    // submitCheckIn(eventId) {
    //   this.startLoading();

    //   if (!eventId || typeof eventId !== "string") {
    //     console.error("Invalid event ID:", eventId);
    //     this.stopLoading();
    //     return;
    //   }
    //   const now = new Date();
    //   // console.log(now);

    //   if (this.checkedInEvents.includes(eventId)) {
    //     alert("You are already checked in to this event.");
    //     this.stopLoading();
    //     return;
    //   }

    //   // console.log("first name and discord id:", this.firstName, this.discordId);

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
    //         // console.log("Check-in successful:", data);

    //         if (!Array.isArray(this.checkedInEvents)) {
    //           this.checkedInEvents = [];
    //         }

    //         this.checkedInEvents = [...this.checkedInEvents, eventId];
    //         Cookies.set(
    //           "checkedInEvents",
    //           JSON.stringify(this.checkedInEvents),
    //           { expires: 999 }
    //         );

    //         this.isCheckedIn = true;
    //         this.showCheckInForm = false;

    //         if (
    //           this.activeEvent &&
    //           Array.isArray(this.activeEvent.playerList)
    //         ) {
    //           this.activeEvent.playerList.push({
    //             playerName: this.firstName,
    //             playerDiscordID: this.discordId,
    //           });
    //         } else {
    //           console.warn(
    //             "activeEvent or playerList is not properly initialized."
    //           );
    //         }

    //         return this.getEvents();
    //       })
    //       .then(() => {
    //         return this.viewEvent(eventId);
    //       })
    //       .catch((error) => {
    //         console.error("Error during check-in:", error);
    //         alert("Failed to check in. Please try again.");
    //         // this.loading = false;
    //         this.stopLoading();
    //       });
    //   } else {
    //     alert("Please enter both your name and Discord ID.");
    //     // this.loading = false;
    //     this.stopLoading();
    //   }
    // },

    getMonth(dateString) {
      const date = new Date(dateString);
      const options = { month: "short" };
      return new Intl.DateTimeFormat("en-US", options).format(date);
    },
    getDay(dateString) {
      const date = new Date(dateString);
      return date.getUTCDate();
    },

    // submitCheckOut(eventId) {
    //   this.startLoading();
    //   if (!eventId || typeof eventId !== "string") {
    //     console.error("Invalid event ID:", eventId);
    //     return;
    //   }

    //   // **No need to check this global array here.**
    //   // if (!this.checkedInEvents.includes(eventId)) {
    //   //   alert("You are not checked in to this event.");
    //   //   return;
    //   // }

    //   const player = this.activeEvent.playerList.find(
    //     (p) => p.playerDiscordID === this.discordId
    //   );

    //   if (!player) {
    //     alert("Player not found in this event.");
    //     return;
    //   }

    //   fetch(`https://gamehavenstg.com/events/${eventId}/remove-player`, {
    //     method: "DELETE",
    //     credentials: "include",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ playerId: player._id }),
    //   })
    //     .then((response) => {
    //       if (!response.ok) throw new Error("Failed to check out.");
    //       return response.json();
    //     })
    //     .then((data) => {
    //       // console.log("Check-out successful:", data);

    //       // **Only update the checkedInEvents array if the checkout was successful for THIS event.**
    //       const index = this.checkedInEvents.indexOf(eventId);
    //       if (index > -1) {
    //         this.checkedInEvents.splice(index, 1);
    //         Cookies.set(
    //           "checkedInEvents",
    //           JSON.stringify(this.checkedInEvents),
    //           { expires: 999 }
    //         );
    //       }

    //       // **Update isCheckedIn based on whether the user is still in the playerList of the current event.**
    //       this.isCheckedIn = this.activeEvent.playerList.some(
    //         (p) => p.playerDiscordID === this.discordId
    //       );
    //     })
    //     .catch((error) => {
    //       console.error("Error during check-out:", error);
    //       alert("Failed to check out. Please try again.");
    //     })
    //     .finally(() => {
    //       this.stopLoading();
    //       this.viewEvent(eventId);
    //     });
    // },

    submitCheckOut(eventId) {
      this.startLoading();

      // Validate eventId
      if (!eventId || typeof eventId !== "string") {
        console.error("Invalid event ID:", eventId);
        this.stopLoading();
        return;
      }

      // Find player in current event
      const player = this.activeEvent.playerList.find(
        (p) => p.playerDiscordID === this.discordId
      );

      if (!player) {
        alert("Player not found in this event.");
        this.stopLoading();
        return;
      }

      fetch(`https://gamehavenstg.com/events/${eventId}/remove-player`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: player._id }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to check out.");
          }
          return response.json();
        })
        .then((data) => {
          // Update checkedInEvents by filtering out just this event
          const updatedCheckedInEvents = this.checkedInEvents.filter(
            (id) => id !== eventId
          );

          // Update both component state and cookie
          this.checkedInEvents = updatedCheckedInEvents;
          Cookies.set(
            "checkedInEvents",
            JSON.stringify(updatedCheckedInEvents),
            { expires: 999 }
          );

          // Update isCheckedIn status for the current event
          this.isCheckedIn = false;

          // Update the activeEvent's playerList locally
          if (this.activeEvent && Array.isArray(this.activeEvent.playerList)) {
            const playerIndex = this.activeEvent.playerList.findIndex(
              (p) => p.playerDiscordID === this.discordId
            );
            if (playerIndex > -1) {
              this.activeEvent.playerList.splice(playerIndex, 1);
            }
          }
        })
        .catch((error) => {
          console.error("Error during check-out:", error);
          alert("Failed to check out. Please try again.");
        })
        .finally(() => {
          this.stopLoading();
          // Refresh the event view
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
          (p) => p.playerDiscordID === this.discordId
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
        const event = this.events.find((e) => e._id === eventId);
        return event?.playerList.some((p) => p._id === playerId);
      });

      Cookies.set("checkedInEvents", JSON.stringify(this.checkedInEvents), {
        expires: 999,
      });

      // console.log("Updated checked-in events:", this.checkedInEvents);
    },

    removePlayerFromEvent(eventId, playerId) {
      fetch(`https://gamehavenstg.com/events/${eventId}/admin-remove-player`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to remove player");
          return response.json();
        })
        .then((data) => {
          // console.log("Successfully removed player", data);
          this.getEvents().then(() => {
            const updatedEvent = this.events.find(
              (event) => event._id === eventId
            );
            if (updatedEvent) {
              this.activeEvent = updatedEvent;
            }
          });
          this.currentPage = "edit";
        })
        .catch((error) => console.error("Error removing player:", error));
    },
    copyToClipboard(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("Event link copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    },
    copyActiveEventLink() {
      if (this.$refs.eventUrlInput) {
        this.$refs.eventUrlInput.select();
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        alert("Event link copied to clipboard!");
      } else {
        this.copyToClipboard(this.activeEvent.eventUrl);
      }
    },

    getEvents() {
      return fetch("https://gamehavenstg.com/api/events")
        .then((response) => response.json())
        .then((eventsFromServer) => {
          // console.log("events from server: ", eventsFromServer);

          this.events = eventsFromServer
            .map((event) => {
              let formattedDate = event.eventDate;
              let formattedTime = this.convertToStandardTime(event.eventTime); // Converted time is in formattedTime

              if (formattedDate) {
                formattedDate = formattedDate.split("T")[0];
              }

              const eventUrl = `https://gamehavenstg.com/events/${event._id}`;

              let start = null;
              if (formattedDate && formattedTime) {
                // Use formattedTime here
                start = `${formattedDate}T${formattedTime}:00Z`; // Assuming UTC, adjust 'Z' if needed
              } else if (formattedDate) {
                start = formattedDate; // Just the date if no time
              }

              return {
                _id: event._id,
                start: start,
                eventTitle: event.eventTitle,
                eventGame: event.eventGame,
                eventType: event.eventType,
                eventDescription: event.eventDescription,
                eventOrganizer: event.eventOrganizer,
                organizerContactInfo: event.organizerContactInfo,
                playerList:
                  event.playerList.map((player) => ({
                    playerName: player.playerName,
                    playerDiscordID: player.playerDiscordID,
                    _id: player._id,
                  })) || [],
                eventDay: event.eventDay,
                eventDate: formattedDate,
                eventTime: formattedTime,
                matches: event.matches,
                isPublished: event.isPublished,
                maxPlayers: event.maxPlayers,
                iconUrl: event.iconUrl,
                eventUrl: eventUrl,
                eventFee: event.eventFee,
              };
            })
            .sort((a, b) => {
              // Convert to Date objects for proper comparison
              const dateA = new Date(a.eventDate);
              const dateB = new Date(b.eventDate);
              return dateA - dateB; // Ascending order
            });

          this.$nextTick(() => {
            // this.updateCheckedInEvents();
            // console.log(this.events);
            console.log("this.events:", this.events);
          });
        })
        .catch((error) => console.error("Error fetching events:", error));
    },

    getTemplates() {
      const templatesUrl = "https://gamehavenstg.com/templates";

      // console.log("Fetching templates from:", templatesUrl);

      return fetch(templatesUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `HTTP error fetching templates! status: ${response.status}`
            );
          }
          return response.json();
        })
        .then((templatesFromServer) => {
          // console.log("Raw templates from server: ", templatesFromServer);

          this.templates = templatesFromServer.map((template) => {
            return {
              id: template._id,
              eventTitle: template.eventTitle,
              eventGame: template.eventGame,
              eventDescription: template.eventDescription,
              iconUrl: template.iconUrl,
              maxPlayers: template.maxPlayers,
              eventFee: template.eventFee,
            };
          });
        })
        .catch((error) => {
          console.error("Error fetching templates:", error);
        });
    },
    createEvent() {
      this.activeEvent = {
        eventTitle: "",
        eventGame: "",
        eventType: "",
        eventDescription: "",
        eventOrganizer: "",
        organizerContactInfo: "",
        eventDay: "",
        eventDate: "",
        eventTime: "",
        maxPlayers: null,
        iconUrl: "",
        eventFee: "",
      };
      this.navigatePage("creation");
      // console.log(this.activeTemplate);
    },

    loadTemplate(selectedTemplateId) {
      // console.log("hello");
      // console.log("selected template id", selectedTemplateId);

      const selectedTemplate = this.templates.find(
        (template) => template.id === selectedTemplateId
      );

      // console.log(selectedTemplate);

      if (selectedTemplate) {
        this.newEvent = {
          eventTitle: selectedTemplate.eventTitle,
          eventGame: selectedTemplate.eventGame,
          eventDescription: selectedTemplate.eventDescription,
          iconUrl: selectedTemplate.iconUrl,
          maxPlayers: selectedTemplate.maxPlayers,
          eventDay: selectedTemplate.eventDay,
          eventTime: selectedTemplate.eventTime,
          eventFee: selectedTemplate.eventFee,
        };
        this.activeTemplate = selectedTemplate;

        // console.log("active template", this.activeTemplate);
        // console.log("template id", activeTemplate._id);
      } else {
        this.newEvent = {
          eventTitle: "",
          eventGame: "",
          eventDescription: "",
          iconUrl: "",
          maxPlayers: null,
          eventDay: "",
          eventTime: "",
          eventFee: "",
        };
        // this.activeTemplate = null; // Reset activeTemplate if no template is found
      }
    },

    editTemplate() {
      if (!this.activeTemplate) {
        alert("Please select a template to edit.");
        return;
      }

      const updatedTemplate = {
        eventTitle: this.newEvent.eventTitle,
        eventGame: this.newEvent.eventGame,
        eventDescription: this.newEvent.eventDescription,
        iconUrl: this.newEvent.iconUrl,
        maxPlayers: this.newEvent.maxPlayers,
        eventDay: this.newEvent.eventDay,
        eventTime: this.newEvent.eventTime,
        eventFee: this.newEvent.eventFee,
      };

      fetch(`https://gamehavenstg.com/templates/${this.activeTemplate.id}`, {
        method: "PUT", // Or PATCH, depending on your API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTemplate),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // console.log("Template updated:", data);
          this.getTemplates();
        })
        .catch((error) => {
          console.error("Error updating template:", error);
          // Optionally display an error message to the user
        });
    },

    async createTemplate() {
      this.newTemplate = {
        eventTitle: this.newEvent.eventTitle,
        eventGame: this.newEvent.eventGame,
        eventDescription: this.newEvent.eventDescription,
        iconUrl: this.newEvent.iconUrl,
        maxPlayers: this.newEvent.maxPlayers,
        eventDay: this.newEvent.eventDay,
        eventTime: this.newEvent.eventTime,
        eventFee: this.newEvent.eventFee,
      };
      try {
        const response = await fetch("https://gamehavenstg.com/templates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.newTemplate),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.newEvent = {
          eventTitle: "",
          eventGame: "",
          eventDescription: "",
          iconUrl: "",
          maxPlayers: null,
          eventDay: "",
          eventTime: "",
          eventFee: "",
        };
        this.getTemplates();
      } catch (error) {
        console.error("Error creating template:", error);
      }
    },
    deleteTemplate() {
      // console.log("active template before check:", this.activeTemplate);
      // if (this.activeTemplate) {
      // console.log("active template: ", this.activeTemplate.id);
      if (confirm("Are you sure you want to delete this template?")) {
        fetch(`https://gamehavenstg.com/templates/${this.activeTemplate.id}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            this.getTemplates();
            this.activeTemplate = null;
            this.newEvent = {
              eventTitle: "",
              eventGame: "",
              eventDescription: "",
              iconUrl: "",
              maxPlayers: null,
              eventDay: "",
              eventTime: "",
              eventFee: "",
            };
          })
          .catch((error) => {
            console.error("Error deleting template:", error);
          });
      }
    },
    linkify(text) {
      const urlRegex = /(https?:\/\/)(www\.)?([^\s]+)/g;
      return text.replace(urlRegex, (match, protocol, www, restOfUrl) => {
        const cleanUrl = match.replace(/<\/?[^>]+(>|$)/g, ""); // Avoid tag injection
        const displayedUrl = restOfUrl; // Display everything after https:// or https://www.
        return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${displayedUrl}</a>`;
      });
    },
    sanitizeAndLinkify(text) {
      return DOMPurify.sanitize(this.linkify(text));
    },

    pushEvent() {
      this.scrollToTop();

      const errors = {};

      if (!this.newEvent.eventTitle) {
        errors.eventTitle = "Event Title is required.";
      }
      if (!this.newEvent.eventGame) {
        errors.eventGame = "Game is required.";
      }
      if (!this.newEvent.eventDescription) {
        errors.eventDescription = "Description is required.";
      }
      if (!this.newEvent.eventOrganizer) {
        errors.eventOrganizer = "Organizer Name is required.";
      }
      if (!this.newEvent.organizerContactInfo) {
        errors.organizerContactInfo = "Contact Info is required.";
      }
      if (!this.newEvent.eventDate) {
        errors.eventDate = "Date is required.";
      }
      if (!this.newEvent.eventDay) {
        errors.eventDay = "Day is required.";
      }
      if (!this.newEvent.eventTime) {
        errors.eventTime = "Time is required.";
      }
      if (!this.newEvent.maxPlayers || this.newEvent.maxPlayers < 1) {
        errors.maxPlayers = "Maximum Players must be at least 1.";
      }

      if (this.newEvent.eventFee && isNaN(parseFloat(this.newEvent.eventFee))) {
        errors.eventFee = "Event Fee must be a number.";
      }

      if (Object.keys(errors).length > 0) {
        this.validationErrors = errors;
        console.error("Validation errors:", errors);
        return;
      }

      this.newEvent.eventDescription = this.sanitizeAndLinkify(
        this.newEvent.eventDescription
      );

      this.validationErrors = {};

      Cookies.set("organizerName", this.newEvent.eventOrganizer, {
        expires: 999,
      });
      Cookies.set("organizerContact", this.newEvent.organizerContactInfo, {
        expires: 999,
      });

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
        maxPlayers: parseInt(this.newEvent.maxPlayers, 10),
        iconUrl: this.newEvent.iconUrl,
        eventFee: parseFloat(this.newEvent.eventFee) || 0,
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

          this.events.push({
            _id: createdEvent._id,
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
            maxPlayers: createdEvent.maxPlayers,
            iconUrl: createdEvent.iconUrl,
            eventFee: createdEvent.eventFee,
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
            maxPlayers: 1,
            iconUrl: "",
            eventFee: "",
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
      this.scrollToTop();
      this.activeEvent = this.events.find((event) => event._id === eventId) || {
        eventDescription: "",
      }; // Ensure activeEvent is not undefined
      // console.log("active event: ", this.activeEvent);
      // this.viewEvent(eventId);
    },
    deleteEvent(eventId) {
      if (confirm("Are you sure you want to delete this event?")) {
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
          .finally(() => {
            this.getEvents();
          })
          .catch((error) => console.error("Error deleting event:", error));
      } else {
        return;
      }
    },
    togglePublish(eventId) {
      // console.log("togglePublish called with eventId:", eventId);

      // Toggle the isPublished state
      this.activeEvent.isPublished = !this.activeEvent.isPublished;
      this.modifiedFields.isPublished = this.activeEvent.isPublished;

      // console.log("modifiedFields before saveEvent:", this.modifiedFields);
      //this.saveEvent(eventId);
    },
    saveEvent(eventId) {
      this.scrollToTop();
      this.startLoading();

      const errors = {};

      if (!this.activeEvent.eventTitle) {
        errors.eventTitle = "Title is required.";
      }
      if (!this.activeEvent.eventGame) {
        errors.eventGame = "Game is required.";
      }
      if (!this.activeEvent.eventDescription) {
        errors.eventDescription = "Description is required.";
      }
      if (!this.activeEvent.eventOrganizer) {
        errors.eventOrganizer = "Organizer is required.";
      }
      if (!this.activeEvent.organizerContactInfo) {
        errors.organizerContactInfo = "Organizer Contact Info is required.";
      }
      if (!this.activeEvent.eventDate) {
        errors.eventDate = "Date is required.";
      }
      if (!this.activeEvent.eventDay) {
        errors.eventDay = "Day is required.";
      }
      if (!this.activeEvent.eventTime) {
        errors.eventTime = "Time is required.";
      }
      if (
        this.activeEvent.maxPlayers === null ||
        this.activeEvent.maxPlayers < 1
      ) {
        errors.maxPlayers = "Maximum Players must be at least 1 or Unlimited.";
      }

      if (
        this.activeEvent.eventFee !== null &&
        isNaN(parseFloat(this.activeEvent.eventFee))
      ) {
        errors.eventFee = "Event Fee must be a number.";
      } else if (this.activeEvent.eventFee < 0) {
        errors.eventFee = "Event Fee cannot be negative.";
      }

      if (Object.keys(errors).length > 0) {
        this.validationErrors = errors;
        console.error("Validation errors:", errors);
        this.stopLoading();
        return Promise.reject();
      }

      this.validationErrors = {};

      this.modifiedFields = this.modifiedFields || {};

      const cleanDescription = this.sanitizeAndLinkify(
        this.activeEvent.eventDescription
      );
      this.activeEvent.eventDescription = cleanDescription;
      this.modifiedFields.eventDescription = cleanDescription;

      const matchesToSend = this.activeEvent.matches.map((pair) => ({
        player1:
          typeof pair.player1 === "object" ? pair.player1._id : pair.player1,
        player2: pair.player2
          ? typeof pair.player2 === "object"
            ? pair.player2._id
            : pair.player2
          : null,
      }));
      this.modifiedFields.matches = matchesToSend;

      // Add other modified fields
      this.modifiedFields.iconUrl = this.activeEvent.iconUrl;
      this.modifiedFields.maxPlayers = this.activeEvent.maxPlayers;
      this.modifiedFields.eventFee = this.activeEvent.eventFee;
      this.modifiedFields.isPublished = this.activeEvent.isPublished;

      console.log(this.activeEvent);

      return fetch(`https://gamehavenstg.com/events/${eventId}`, {
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
          console.log("saved event: ", data);

          data.playerList = data.playerList.map((player) => ({
            playerName: player.playerName,
            playerDiscordID: player.playerDiscordID,
            _id: player._id,
          }));

          data.matches = data.matches.map((pair) => ({
            player1:
              typeof pair.player1 === "object"
                ? pair.player1
                : { _id: pair.player1 },
            player2: pair.player2
              ? typeof pair.player2 === "object"
                ? pair.player2
                : { _id: pair.player2 }
              : null,
          }));

          data.id = data._id;
          data.eventTime = this.convertToStandardTime(data.eventTime);
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
          return new Promise((resolve) => {
            setTimeout(() => {
              this.stopLoading();
              resolve();
            }, 500);
          });
        });
    },

    sendEventToBot() {
      if (confirm("Are you sure you want to send this event to the discord")) {
        this.startLoading();

        console.log("sending event to bot:", this.activeEvent);

        const eventToSend = { ...this.activeEvent };

        return fetch(
          "https://gamehavenbot-production.up.railway.app/publish_event",

          {
            // Use the bot's endpoint
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventToSend),
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Failed to send event to bot: ${response.status} - ${response.statusText}`
              );
            }
            return response.json();
          })
          .then((data) => {
            // console.log("Bot response:", data);
          })
          .catch((error) => {
            console.error("Error sending event to bot:", error);
          })
          .finally(() => {
            this.stopLoading();
          });
      } else {
        return;
      }
    },

    startLoading() {
      this.loading = true;
      document.body.style.overflow = "hidden"; // Lock scroll
    },
    stopLoading() {
      this.loading = false;
      document.body.style.overflow = ""; // Restore scroll
    },
  },
  created: function () {
    this.getEvents();
    this.getTemplates();
    if (this.events.length > 0) {
      this.activeEvent = this.events[0];
    }
    this.firstName = this.getCookie("firstName") || "";
    this.discordId = this.getCookie("discordId") || "";
    this.newEvent.eventOrganizer = this.getCookie("organizerName") || "";
    this.newEvent.organizerContactInfo =
      this.getCookie("organizerContact") || "";
    this.checkedInEvents = JSON.parse(
      this.getCookie("checkedInEvents") || "[]"
    );
  },
};

createApp(App).mount("#app");
