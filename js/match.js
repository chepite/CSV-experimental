{
  let matchData = ``;
  let economyData = ``;
  let playerData = ``;
  let team1 = [];
  let team2 = [];
  //fetch the element from the sessionstorage
  const $chart = document.getElementById("economy").getContext("2d");
  const $chart2 = document.getElementById("economy2").getContext("2d");
  //economy first half
  const firstteam1Economy = [];
  const firstteam2Economy = [];
  //economy second half
  const secondteam1Economy = [];
  const secondteam2Economy = [];
  let mapAbbr = ``;
  const getEconomyData = () => {
    //first half of the game
    for (i = 1; i < 16; i++) {
      let team1 = `${i}_t1`;
      // firstteam1Economy.push(parseInt(economyData[team1]));
      firstteam1Economy.push(economyData[team1]);

      let team2 = `${i}_t2`;
      firstteam2Economy.push(parseInt(economyData[team2]));
    }
    for (i = 16; i < 30; i++) {
      //check is only needed in the first half you can never win the game in first half fastest games are 16-0
      let team1 = `${i}_t1`;
      if (economyData[team1] !== "") {
        secondteam1Economy.push(parseInt(economyData[team1]));
      }
      let team2 = `${i}_t2`;
      if (economyData[team2] !== "") {
        secondteam2Economy.push(parseInt(economyData[team2]));
      }
    }
    console.log(firstteam1Economy);
    console.log(firstteam2Economy);
    console.log(secondteam1Economy);
    console.log(secondteam2Economy);
  };

  const handlePlayerData = () => {
    //divide the player data in teams
    const compareValue = matchData.team_1;
    console.log(`value: ${compareValue}`);
    playerData.filter((x) => {
      if (x.team === compareValue) {
        team1.push(x);
      }
    });
    console.log(team1);
    playerData.filter((x) => {
      if (x.team !== compareValue) {
        console.log(`true`);
        team2.push(x);
      }
    });
    console.log(team2);
  };
  const abbr = () => {
    //search which map is the clicked map --> weird structure in the kaggle file
    //each player has a match id but a match consists of 3 maps so every player has 3 maps
    //and the kill for each maps are labeled e.g. m3_deaths --> so we have to know which map
    //the clicked one is
    if (team1.length > 0) {
      console.log(team1[0]);
      //get the map abbr
      console.log()
      if (team1[0].map_1 !== "" && team1[0].map_1 === matchData._map) {
        mapAbbr = `m1`;
      } else if (team1[0].map_2 !== "" && team1[0].map_2 === matchData._map) {
        mapAbbr = `m2`;
      } else if ( team1[0].map_3 !== "" && team1[0].map_3 === matchData._map) {
        mapAbbr = `m3`;
      }
    }
    console.log(mapAbbr);
  };
  const makefirstChart = () => {
    if(matchData.team_1 === economyData.team_1 && matchData.team_2 === economyData.team_2){
    var firstchart = new Chart($chart, {
      type: "line",
      data: {
        labels: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ],
        datasets: [
          {
            label: economyData.team_1,
            fill: false,
            data: firstteam1Economy,
            //color dot
            backgroundColor: `#fff`,
            //color line
            borderColor: `#fff`,
            borderWidth: 1,
          },
          {
            label: economyData.team_2,
            fill: false,
            data: firstteam2Economy,
            //color dots
            backgroundColor: `#abc123`,
            //color line
            borderColor: `#abc123`,
            borderWidth: 1,
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "Economy First half",
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
    }
    else{
      const $economy = document.querySelector(`#economy`);
      const $title = document.querySelector(`.charts__title`);
      $title.style.display = 'none';
    }
  };
  const makesecondChart = () => {
    if(matchData.team_1 === economyData.team_1 && matchData.team_2 === economyData.team_2){
    var secondChart = new Chart($chart2, {
      type: "line",
      data: {
        labels: [
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
        ],
        datasets: [
          {
            label: economyData.team_1,
            fill: false,
            data: secondteam1Economy,
            //color dot
            backgroundColor: `#fff`,
            //color line
            borderColor: `#fff`,
            borderWidth: 1,
          },
          {
            label: economyData.team_2,
            fill: false,
            data: secondteam2Economy,
            //color dots
            backgroundColor: `#abc123`,
            //color line
            borderColor: `#abc123`,
            borderWidth: 1,
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "Economy Second half",
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }
  else{
    const $economy2 = document.querySelector(`#economy2`);
      $economy2.style.display= `none`
  }
  };

  const fillLeaderBoard = () => {
    const $team1 = document.querySelector(`.team_1`);
    $team1.textContent = matchData.team_1;
    const $team2 = document.querySelector(`.team_2`);
    $team2.textContent = matchData.team_2;
    //leaderboards
    const $leaderboard1 = document.querySelector(`.leaderboardTeam1`);
    const $leaderboard2 = document.querySelector(`.leaderboardTeam2`);
    //playernames
    const $team1Names = $leaderboard1.querySelectorAll(`.playerData`);
    const $team2Names = $leaderboard2.querySelectorAll(`.playerData`);
    console.log($team2Names);
    //og was $team1Names.lenght etc for the rest
    //some matches had errors e.g. player missing -> if structures for making sure the rest of the page loads properly
    for (i = 0; i < $team1Names.length; i++) {
      if (team1[i] !== undefined) {
        $team1Names[i].textContent = team1[i].player_name;
      }
    }
    for (i = 0; i < $team2Names.length; i++) {
      if (team2[i] !== undefined) {
        $team2Names[i].textContent = team2[i].player_name;
      } else {
        $team2Names[i].textContent = "Not found";
      }
    }


    //player kills
    const $team1Kills = $leaderboard1.querySelectorAll(`.killData`);
    const $team2Kills = $leaderboard2.querySelectorAll(`.killData`);
    for (i = 0; i < $team1Kills.length; i++) {
      if (team1[i] !== undefined) {
        $team1Kills[i].textContent = team1[i][`${mapAbbr}_kills`];
      } else {
        $team1Kills[i].textContent = "Not found";
      }
    }
    for (i = 0; i < $team2Kills.length; i++) {
      if (team2[i] !== undefined) {
        $team2Kills[i].textContent = team2[i][`${mapAbbr}_kills`];
      } else {
        $team2Kills[i].textContent = "Not found";
      }
    }
    //player assists
    const $team1Assists = $leaderboard1.querySelectorAll(`.assistData`);
    const $team2Assists = $leaderboard2.querySelectorAll(`.assistData`);
    for (i = 0; i < $team1Assists.length; i++) {
      if (team1[i] !== undefined) {
        $team1Assists[i].textContent = team1[i][`${mapAbbr}_assists`];
      } else {
        $team1Assists[i].textContent = "Not found";
      }
    }
    for (i = 0; i < $team2Assists.length; i++) {
      if (team2[i] !== undefined) {
        $team2Assists[i].textContent = team2[i][`${mapAbbr}_assists`];
      } else {
        $team2Assists[i].textContent = "Not found";
      }
    }
    //player deaths
    const $team1Deaths = $leaderboard1.querySelectorAll(`.deathData`);
    const $team2Deaths = $leaderboard2.querySelectorAll(`.deathData`);
    for (i = 0; i < $team1Deaths.length; i++) {
      if (team1[i] !== undefined) {
        $team1Deaths[i].textContent = team1[i][`${mapAbbr}_deaths`];
      } else {
        $team1Deaths[i].textContent = "Not found";
      }
    }
    for (i = 0; i < $team2Deaths.length; i++) {
      if (team2[i] !== undefined) {
        $team2Deaths[i].textContent = team2[i][`${mapAbbr}_deaths`];
      } else {
        $team2Deaths[i].textContent = "Not found";
      }
    }
    //player HS
    const $team1Hs = $leaderboard1.querySelectorAll(`.headshotData`);
    const $team2Hs = $leaderboard2.querySelectorAll(`.headshotData`);
    for (i = 0; i < $team1Hs.length; i++) {
      if (team1[i] !== undefined) {
        let hs =
          (team1[i][`${mapAbbr}_hs`] / team1[i][`${mapAbbr}_kills`]) * 100;
        $team1Hs[i].textContent = `${Math.round(hs)}%`;
      } else {
        $team1Hs[i].textContent = "Not found";
      }
    }
    for (i = 0; i < $team2Hs.length; i++) {
      if (team2[i] !== undefined) {
        let hs =
          (team2[i][`${mapAbbr}_hs`] / team2[i][`${mapAbbr}_kills`]) * 100;
        $team2Hs[i].textContent = `${Math.round(hs)}%`;
      } else {
        $team2Hs[i].textContent = "Not found";
      }
    }
  };

  const close = (e) => {
    e.preventDefault();
    window.close();
  };

  const banner = () => {
    const $article = document.querySelector(`.highlight__match`);
    $article.style.backgroundImage = `url(./assets/images/banners/de_${matchData._map}_banner.jpg)`;
    $article.innerHTML = ` 
  <div class="highlight__match">
    <div class="highlight__match--info">
      <h3 class="highlight__match--title">${matchData.team_1} vs ${matchData.team_2}</h3>
      <p class="highlight__match--map">${matchData._map}</p>
    </div>
    <div class="highlight__match--score">
      <!--teams vervangen door logo's ipv letters-->
      <p class="highlight__match--score t">${matchData.result_1}</p>
      <p>:</p>
      <p class="highlight__match--score ct">${matchData.result_2}</p>
    </div>
  </div>`;
  };
  const init = async () => {
    matchData = await JSON.parse(localStorage.getItem("matchData"));
    economyData = await JSON.parse(localStorage.getItem("economyData"));
    playerData = await JSON.parse(localStorage.getItem("playerData"));
    getEconomyData();
    console.log(economyData._map);
    banner();
    handlePlayerData();
    abbr();
    makefirstChart();
    makesecondChart();
    if (team1.length !== 0 && team2.length !== 0) {
      fillLeaderBoard();
      // await getData();
    } else {
      const $leaderboards = document.querySelector(`.leaderboards`);
      $leaderboards.style.display = `none`;
      const $error = document.querySelector(`.error p`);
      console.log($error);
      $error.textContent = `Players not found in database`;
    }
    //return button
    const $home = document.querySelector(`.return`);
    $home.addEventListener(`click`, close);
  };

  init();
}
