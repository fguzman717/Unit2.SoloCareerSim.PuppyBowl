// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2406-FTB-MT-WEB-PT";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

// Reference variables
const mainContainer = document.querySelector("main");
const formContainer = document.querySelector("form");

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    // We use the fetch function to send a request to our API_URL variable which is used to access our player data. The await keyword ensures that the function pauses until the fetch operation is complete and the response is received.
    const response = await fetch(`${API_URL}/players`);
    // The code will be converted into JSON format. The await keyword ensures that the function waits until this conversion is complete before proceeding.
    const result = await response.json();
    // We then extract the data property from the result and return it
    return result.data.players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
// This function will takes one parameter, playerId.
const fetchSinglePlayer = async (playerId) => {
  try {
    // We will use the fetch method to send a request to our API_URL, combined with the provided playerId, to access data for a specific player.
    const response = await fetch(`${API_URL}/players/${playerId}`);
    // We will then convert it to JSON format
    const result = await response.json();
    // Finally, we extract the data property from the result and return it
    return result.data;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */

// The function will takes one parameter, playerObj
const addNewPlayer = async (playerObj) => {
  try {
    // We will use the fetch method to send a POST request to the API_URL
    const response = await fetch(`${API_URL}/players`, {
      // Specifies that this is a POST request
      method: "POST",
      // Converts the playerObj parameter into a JSON string
      body: JSON.stringify(playerObj),
      // Sets the request header to indicate that the body of the request is in JSON format
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    // Returns result, which contains information about the newly created player or the result of the operation.
    return result;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */

// The function takes one parameter, playerId
const removePlayer = async (playerId) => {
  try {
    // The function uses the fetch method to send a DELETE request to the API_URL using the specific playerId
    const response = await fetch(`${API_URL}/players/${playerId}`, {
      // Specifies that this is a DELETE request
      method: "DELETE",
    });
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */

// The function takes a single parameter named playerList.
const renderAllPlayers = (playerList) => {
  // Extracts the list of player objects from the playerList parameter

  // Checks if playerList is either null or undefined, or if playerList is an empty array.
  if (!playerList || playerList.length === 0) {
    mainContainer.innerHTML = `<h3>No Players Found!</h3>`;
    return;
  }

  // If there are players, it clears any existing content inside the mainContainer element
  mainContainer.innerHTML = "";

  // Loops through each player in the playerObjectList array.
  playerList.forEach((player) => {
    // Creates a new <div> element for each player.
    const playerElement = document.createElement("div");
    playerElement.classList.add("player-card");
    // Sets the HTML content to display the appropriate player info
    playerElement.innerHTML = `
      <h4>${player.name}</h4>
      <p>${player.id}</p>
      <img src=${player.imageUrl} alt=${player.name}/>
      <button class="remove-button" data-id="${player.id}">Remove from Roster</button>
      <button class="detail-button">See Details</button>
    `;
    // Appends to the mainContainer element.
    mainContainer.appendChild(playerElement);

    // Removes the selected player
    let removeButton = playerElement.querySelector(".remove-button");
    removeButton.addEventListener("click", async (event) => {
      event.preventDefault();
      removePlayer(player.id);
    });

    // Displays player info of the selected player
    let detailButton = playerElement.querySelector(".detail-button");
    detailButton.addEventListener("click", (event) => {
      event.preventDefault();
      renderSinglePlayer(player);
    });
  });
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  // Checks if the player parameter is either null or undefined
  if (!player) {
    mainContainer.innerHTML = `<h3>No Player Found!</h3>`;
    return;
  }

  // If a valid player is provided, the player's info is added to page
  mainContainer.innerHTML = `
    <div class="single-player">
      <div>
        <h4>${player.name}</h4>
        <p>${player.id}</p>
        <p>${player.breed}</p>
        <img src=${player.imageUrl} alt=${player.name}/>
      </div>
      <button class="back-button">Back to all Players</button>
    </div>
  `;

  let backButton = mainContainer.querySelector(".back-button");
  backButton.addEventListener("click", async (event) => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
  });
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */

const renderNewPlayerForm = () => {
  try {
    // Sets the HTML content of formContainer to include input fields
    formContainer.innerHTML = `
      <input type="text" id="name" name="name" placeholder="Name" />
      <input type="text" id="breed" name="breed" placeholder="Breed" />
      <input type="text" id="imageUrl" name="imageUrl" placeholder="Image Url" />
      <button type="submit">Submit</button>
    `;
    formContainer.addEventListener("submit", async (event) => {
      event.preventDefault();
      // Collects the values entered into the form fields and creates an object called playerData with these values.
      const playerData = {
        name: formContainer.name.value,
        breed: formContainer.breed.value,
        imageUrl: formContainer.imageUrl.value,
      };
      // Add the new player using the playerData as the parameter
      await addNewPlayer(playerData);

      // After adding the new player, it fetches the updated list, then calls renderAllPlayers to update the displayed list of players.
      const players = await fetchAllPlayers();
      renderAllPlayers(players);

      // Clears the input fields in the form
      formContainer.name.value = "";
      formContainer.breed.value = "";
      formContainer.imageUrl.value = "";
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
