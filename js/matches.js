{
  let matchesData;
  let playersData;
  let EconomyData;
  const $loading = document.getElementById("loading");
  const $loadingText = $loading.querySelector(".loading__text");
  const $loadingProgress = $loading.querySelector(".loading__progress");
  const $loadingSentence = document.querySelector(`.loading__sentence`);
  const $result = document.querySelector(`.content`);
  let sentenceCounter = -1;
  let detailList = [];
  const pass = async (e) => {
    e.preventDefault();
    const $target = e.currentTarget;
    let id = $target.id;

    //pass all the data of games' players and match_id in the sessionstorage
    let match = id.split(`_`);
    await matchesData.find((element) => {
      if (match[0] == element.match_id && match[1] == element._map) {
        localStorage.setItem("matchData", JSON.stringify(element));
      }
    });

    await EconomyData.find((element) => {
      if (match[0] == element.match_id && match[1] == element._map) {
        console.log(element);
        localStorage.setItem("economyData", JSON.stringify(element));
      }
    });

    const playerArray=[];
    await playersData.filter(x=>{if(x.match_id == match[0] && playerArray.length <=10){
      console.log(`current match id: ${x.match_id}`);
      playerArray.push(x);
    }})

    console.log(playerArray);
    localStorage.setItem("playerData", JSON.stringify(playerArray));
    
    window.open("match.html");
 
  };

  const randomSentence = () => {
    const sentences = [
      "Headshotting bots...",
      "Rushing B...",
      "Flashing Mid...",
      "Watching Heaven...",
      "Holding Long...",
      "T-bagging enemies...",
      "Peeking Mid...",
    ];
    $loadingSentence.textContent = sentences[sentenceCounter];
    sentenceCounter++;
    return sentences[sentenceCounter];
  };
  const getParsedCSV = async (url) => {
    console.log(`Load: ${url}`);
    const response = await axios.get(url, {
      onDownloadProgress: (progressEvent) => {
        const progress = progressEvent.loaded / progressEvent.total;
        const percentage = Math.floor(progress * 100);
        //random sentence
        $loadingProgress.textContent = `${percentage}%`;
      },
    });

    const text = response.data;
    return new Promise((resolve) => {
      const rows = [];
      Papa.parse(text, {
        header: true,
        worker: true,
        step: (row) => rows.push(row.data),
        complete: () => resolve(rows),
      });
    });
  };

  const getData = async () => {
    console.log(`Start loading the file`);
    const parsedRows = await getParsedCSV(`assets/data/results.csv`);
    const parsedPlayers = await getParsedCSV(`assets/data/players.csv`);
    const parsedEconomy = await getParsedCSV(`assets/data/economy.csv`);
    matchesData = parsedRows;
    playersData = parsedPlayers;
    EconomyData = parsedEconomy;
  };

  const FilterTeams = async () => {
    const filteredArray = [];
    matchesData.forEach((element) => {
      if (filteredArray.includes(element.team_1) === false) {
        filteredArray.push(element.team_1);
      }
    });
    return filteredArray;
  };

  const FilterEvents = async () => {
    const filteredArray = [];
    const objectArray = [];
    playersData.forEach((element) => {
      if (filteredArray.includes(element.event_id) === false) {
        let object = { id: element.event_id, name: element.event_name };
        filteredArray.push(element.event_id);
        objectArray.push(object);
      }
    });
    console.log(filteredArray);
    return objectArray;
  };

  const fillSelect = async () => {
    const teams = await FilterTeams();
    teams.sort();
    const $teamSelect = document.querySelector(`.matchesForm__teams--list`);
    $teamSelect.innerHTML = teams
      .map((team) => `<option value="${team}">${team}</option>`)
      .join(``);
    $teamSelect.innerHTML =
      `<option value="default" >select a team</option>` + $teamSelect.innerHTML;
    const events = await FilterEvents();
    events.sort();
    const $eventSelect = document.querySelector(`.matchesForm__events--list`);
    $eventSelect.innerHTML = events
      .map((event) => `<option value="${event.id}">${event.name}</option>`)
      .join(``);
    $eventSelect.innerHTML =
      `<option value="0">select an event</option>` + $eventSelect.innerHTML;
  };

  function getArraysIntersection(a1, a2) {
    return a1.filter(function (n) {
      return a2.indexOf(n) !== -1;
    });
  }

  const makeList = (team, event) => {
    const teamsArray = [];
    const eventArray = [];
    if (team.length !== 0 && event.length !== 0) {
      matchesData.forEach((obj) => {
        if ((obj.team_1 === team) | (obj.team_2 === team)) {
          teamsArray.push(obj);
        }
      });
      teamsArray.sort();
      console.log(teamsArray.length);
      matchesData.forEach((obj) => {
        if (obj.event_id === event) {
          eventArray.push(obj);
        }
      });
      eventArray.sort();
      console.log(eventArray.length);
      const returnArray = getArraysIntersection(teamsArray, eventArray);
      console.log(returnArray);
      return returnArray;
    } else if (team.length === 0) {
      console.log(`team is null`);
      matchesData.forEach((obj) => {
        if (obj.event_id === event) {
          eventArray.push(obj);
        }
      });
      eventArray.sort();
      const filteredArray = [];
      eventArray.forEach((element) => {
        if (!filteredArray.includes(element)) {
          filteredArray.push(element);
        }
      });
      console.log(
        `first array: ${eventArray.length}, filtered: ${filteredArray.length}`
      );
      const returnArray = filteredArray;
      return returnArray;
    } else if (event.length === 0) {
      console.log(`event is null`);
      matchesData.forEach((obj) => {
        if ((obj.team_1 === team) | (obj.team_2 === team)) {
          teamsArray.push(obj);
        }
      });
      teamsArray.sort();
      const filteredArray = [];
      teamsArray.forEach((element) => {
        if (!filteredArray.includes(element)) {
          filteredArray.push(element);
        }
      });
      console.log(
        `first array: ${teamsArray.length}, filtered: ${filteredArray.length}`
      );
      const returnArray = filteredArray;
      return returnArray;
    }
  };

  const appendList = (list) => {
    if (list.length !== 0) {
      let filteredidList = [];
      list.forEach((element) => {
        if (!filteredidList.includes(element.match_id)) {
          filteredidList.push(element.match_id);
        }
      });
      let result = [];
      for (i = 0; i < filteredidList.length; i++) {
        let object = matchesData.find((obj) => {
          if (obj.match_id === filteredidList[i]) {
            result.push(obj);
          }
        });
      }
      const $location = document.querySelector(`.matches__list`);
      $location.innerHTML = ``;
      console.log(result);
      const resultHTML = result.map(function (element) {
        const $article = document.createElement(`article`);
        $article.classList.add(`highlight__match`);
        $article.style.backgroundImage = `url(./assets/images/banners/de_${element._map}_banner.jpg)`;
        $article.setAttribute(`id`, `${element.match_id}_${element._map}`);
        $article.innerHTML = ` 
      <div class="highlight__match">
        <div class="highlight__match--info">
          <h3 class="highlight__match--title">${element.team_1} vs ${element.team_2}</h3>
          <p class="highlight__match--map">${element._map}</p>
        </div>
        <div class="highlight__match--score">
          <!--teams vervangen door logo's ipv letters-->
          <p class="highlight__match--score t">${element.result_1}</p>
          <p>:</p>
          <p class="highlight__match--score ct">${element.result_2}</p>
        </div>
      </div>
    `;
        return $article;
      });
      console.log(resultHTML);
      resultHTML.forEach((element) => $location.appendChild(element));
    } else {
      const $location = document.querySelector(`.matches__list`);
      $location.innerHTML = `<li><p>No Result were found</p></li>`;
    }

    //add eventlisteners
    const $articles = document.querySelectorAll(`.highlight__match`);
    $articles.forEach((element) => {
      element.addEventListener(`click`, pass);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const team = document.getElementById(`teams`).value;
    console.log(team);
    const event = document.getElementById(`events`).value;
    console.log(event);
    detailList = makeList(team, event);
    appendList(detailList);
  };

  const init = async () => {
    setInterval(randomSentence, 5000);
    $result.style.display = "none";
    $loading.style.display = "block";
    console.log(`Start the Application`);
    await getData();
    await fillSelect();
    const $form = document.querySelector(`.matchesForm`);
    $form.addEventListener(`submit`, handleSubmit);
    $result.style.display = "block";
    $loading.style.display = "none";
    console.log(`init() is done`);
  };

  init();
}
