const BASE_URL = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com";

const display = document.querySelector("#display");
const displayTitle = document.querySelector("#displayTitle");
const searchInput = document.querySelector("#searchForm");
const searchButton = document.querySelector("#store_search_link");
const errorMsg = document.querySelector(".error-message");

/*----------------------Lấy dữ liệu----------------------------*/
async function getAllGames() {
  try {
    const res = await fetch(`${BASE_URL}/games`);
    if (res.ok) {
      const data = await res.json();
      const games = data["data"];
      return games;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getGameDetail(appid) {
  try {
    const res = await fetch(`${BASE_URL}/single-game/${appid}`);
    if (res.ok) {
      const data = await res.json();
      const gameDetail = data["data"];
      return gameDetail;
    }
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function getTrendingGame() {
  try {
    const res = await fetch(`${BASE_URL}/features`);
    if (res.ok) {
      const data = await res.json();
      const gamesfeature = data["data"];
      return gamesfeature;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

/*-----------------------Chạy dữ liệu----------------------*/
let allGames = [];

const showGames = async () => {
  errorMsg.textContent = "Loading all game...";
  allGames = await getAllGames();
  if (!allGames.length) {
    errorMsg.textContent = "No games";
    return;
  }
  errorMsg.textContent = "";

  displayTitle.innerHTML = "All Game";
  display.innerHTML = "";

  allGames.forEach((data) => {
    const newDiv = document.createElement("div");
    newDiv.innerHTML = `<div class="game_wrapper">
    <div class="cover" onClick="showGameDetail(${data.appid})">
    <img
    src="${data.header_image.replace(/\/\w+.jpg/, "/header.jpg")}" data-id="${
      data.appid
    }"
    />
    <div class="game_info">
    <p>${data.name}</p>
    <p>${data.price}</p>
    </div>
    </div>
    </div>`;
    display.appendChild(newDiv);
  });
  if (!history.state || history.state.page !== "games") {
    history.pushState({ page: "games" }, "", `#games`);
  }
};

const showGameDetail = async (appid) => {
  errorMsg.textContent = "Loading game detail...";
  const gameDetail = await getGameDetail(appid);
  if (!gameDetail) {
    errorMsg.textContent = "Game details not found";
    return;
  }
  errorMsg.textContent = "";

  const tagsHTML = gameDetail.steamspy_tags
    .slice(0, 10)
    .map((tag) => `<div class="tag"><a href="#">${tag}</a></div>`)
    .join("");

  displayTitle.innerHTML = `${gameDetail.name}`;
  display.innerHTML = `<div class="showing_game show_detail">
  <div class="title_contain ">
  <div class="title">${gameDetail.name}</div>
  <div class="price">${gameDetail.price}</div>
  </div>
  <div class="img_detail">
  <img
  src="${gameDetail.header_image}"
  alt="${gameDetail.name}"
  />
  <div class="game_details">
  <div class="game_description">${gameDetail.description}</div>
  <div class="game_informations">
  <p>REQUIRED AGE: ${gameDetail.required_age}</p>
  <p>POSITIVE RATING: ${gameDetail.positive_ratings}</p>
  <p>NEGATIVE RATING: ${gameDetail.negative_ratings}</p>
  <p>AVERAGE PLAYTIME: ${gameDetail.average_playtime}</p>
  <p>MEDIAN PLAYTIME: ${gameDetail.median_playtime}</p>
  <p>RELEASE DATE:  ${gameDetail.release_date}</p>
  <p>DEVELOPER:  <a href="${gameDetail.developer}">${gameDetail.developer}</a></p>
  <p>PLATFORMS:  <a href="${gameDetail.platforms}">${gameDetail.platforms}</a></p>
  </div>
  </div>
  </div>
  <div class="tags_contain">
  Popular user-defined tags for this product:
  <div class="tags">
  ${tagsHTML}
  </div>
  </div>
  </div>
  `;
  if (!history.state || history.state.page !== "detail") {
    history.pushState({ page: "detail", appid: appid }, "", `#${appid}`);
  }
};

const searchGames = () => {
  const searchTerm = searchInput.value.split("").join("").toLowerCase();
  const filteredGames = allGames.filter((game) =>
    game.name.split("").join("").toLowerCase().includes(searchTerm)
  );

  if (filteredGames.length === 0) {
    display.innerHTML = "";
    errorMsg.textContent = "No games found";
    return;
  } else {
    errorMsg.textContent = "";
    display.innerHTML = "";
    displayTitle.innerHTML = `Search Results for "${searchTerm}"`;

    filteredGames.forEach((data) => {
      const newDiv = document.createElement("div");
      newDiv.innerHTML = `<div class="game_wrapper">
    <div class="cover" onClick="showGameDetail(${data.appid})">
    <img
    src="${data.header_image.replace(/\/\w+.jpg/, "/header.jpg")}" data-id="${
        data.appid
      }"
    />
    <div class="game_info">
    <p>${data.name}</p>
    <p>${data.price}</p>
    </div>
    </div>
    </div>`;
      display.appendChild(newDiv);
    });
  }
  if (
    !history.state ||
    history.state.page !== "search" ||
    history.state.searchTerm !== searchTerm
  ) {
    history.pushState(
      { page: "search", searchTerm: searchTerm },
      "",
      `#search-${searchTerm}`
    );
  }
};

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  searchGames();
});

const showGamesByCategory = (category) => {
  const filteredGames = allGames.filter((game) =>
    game.steamspy_tags.includes(category)
  );

  display.innerHTML = "";
  if (filteredGames.length === 0) {
    errorMsg.textContent = `No games found for category "${category}".`;
  } else {
    errorMsg.textContent = "";
    displayTitle.innerHTML = `Game: ${category}`;

    // Hiển thị các trò chơi theo danh mục đã lọc
    filteredGames.forEach((data) => {
      const newDiv = document.createElement("div");
      newDiv.innerHTML = `<div class="game_wrapper">
        <div class="cover" onClick="showGameDetail(${data.appid})">
          <img src="${data.header_image.replace(
            /\/\w+.jpg/,
            "/header.jpg"
          )}" data-id="${data.appid}" />
          <div class="game_info">
            <p>${data.name}</p>
            <p>${data.price}</p>
          </div>
        </div>
      </div>`;
      display.appendChild(newDiv);
    });
  }

  if (
    !history.state ||
    history.state.page !== "category" ||
    history.state.category !== category
  ) {
    history.pushState(
      { page: "category", category: category },
      "",
      `#category-${category}`
    );
  }
};

document.querySelectorAll(".categoryGroup li").forEach((li) => {
  li.addEventListener("click", (e) => {
    const category = e.target.dataset.category;
    showGamesByCategory(category);
  });
});

const showGamesTrending = async () => {
  errorMsg.textContent = "Loading all game...";
  allGames = await getTrendingGame();
  if (!allGames.length) {
    errorMsg.textContent = "No games trending";
    return;
  }
  errorMsg.textContent = "";

  displayTitle.innerHTML = "Trending";
  display.innerHTML = "";

  allGames.forEach((data) => {
    const newDiv = document.createElement("div");
    newDiv.innerHTML = `<div class="game_wrapper">
    <div class="cover" onClick="showGameDetail(${data.appid})">
    <img
    src="${data.header_image.replace(/\/\w+.jpg/, "/header.jpg")}" data-id="${
      data.appid
    }"
    />
    <div class="game_info">
    <p>${data.name}</p>
    <p>${data.price}</p>
    </div>
    </div>
    </div>`;
    display.appendChild(newDiv);
  });
  if (!history.state || history.state.page !== "trending") {
    history.pushState({ page: "trending" }, "", `#trending`);
  }
};

document.querySelectorAll(".nav_links li").forEach((li) => {
  li.addEventListener("click", (e) => {
    const page = e.target.dataset.page;
    if (page === "trending") {
      showGamesTrending();
    } else {
      showGames();
    }
  });
});

/*-----------------------------Chức năng phụ---------------------- */
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchGames();
  }
});

window.addEventListener("popstate", (event) => {
  if (event.state) {
    if (event.state.page === "games") {
      showGames();
    } else if (event.state.page === "detail") {
      showGameDetail(event.state.appid);
    } else if (event.state.page === "search") {
      searchInput.value = event.state.searchTerm;
      searchGames();
    } else if (event.state.page === "category") {
      showGamesByCategory(event.state.category);
    } else if (event.state.page === "trending") {
      showGamesTrending();
    }
  } else {
    showGames();
  }
});
showGames();
