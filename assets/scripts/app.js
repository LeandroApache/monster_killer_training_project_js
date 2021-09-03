const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 20;
const ATTACK_MONSTER_VALUE = 13;
const HEAL_VALUE = 15;
const ATTACK_MODE = 0;
const STRONG_ATTACK_MODE = 1;

const LOG_EVENT_PLAYER_ATTACK = "Player attack"; // for writeToLog();
const LOG_EVENT_PLAYER_STRONG_ATTACK = "Player strong attack";
const LOG_EVENT_MONSTER_ATTACK = "Monster attack";
const LOG_EVENT_PLAYER_HEAL = "Player heal";
const LOG_EVENT_GAME_OVER = "Game over!";
let battleLog = [];

function getMaxLifeValues() {
  const enteredNumber = prompt("Enter the max life of the montser", "100");
  const parsedValue = parseInt(enteredNumber);
  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { message: "Inavalid user input, not a number", name: "Own value" };
  }
  return parsedValue;
}

let chosenMaxLife;

try {
  chosenMaxLife = getMaxLifeValues();
} catch (error) {
  console.log(error);
  chosenMaxLife = 97;
}

let currentMonsterLife = chosenMaxLife;
let currentPlayerLife = chosenMaxLife;
let isBonusLife = true;

adjustHealthBars(chosenMaxLife);

function reset() {
  currentMonsterLife = chosenMaxLife;
  currentPlayerLife = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function writeToLog(event, value, currentMonsterLife, currentPlayerLife) {
  if (
    event !== LOG_EVENT_PLAYER_ATTACK &&
    event !== LOG_EVENT_PLAYER_STRONG_ATTACK &&
    event !== LOG_EVENT_MONSTER_ATTACK &&
    event !== LOG_EVENT_PLAYER_HEAL &&
    event !== LOG_EVENT_GAME_OVER
  ) {
    return;
  }
  let entryLog = {
    event: event,
    value: value,
    currentMonsterLife: currentMonsterLife,
    currentPlayerLife: currentPlayerLife,
  };
  if (event === LOG_EVENT_PLAYER_ATTACK) {
    entryLog.target = "Monster";
  } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    entryLog.target = "Monster";
  } else if (event === LOG_EVENT_MONSTER_ATTACK) {
    entryLog.target = "Player";
  } else if (event === LOG_EVENT_PLAYER_HEAL) {
    entryLog.target = "Player";
  } else if (event === LOG_EVENT_GAME_OVER) {
  }
  battleLog.push(entryLog);
}

function endRound() {
  const initialPlayerLife = currentPlayerLife;
  const playerDamage = dealPlayerDamage(ATTACK_MONSTER_VALUE);
  currentPlayerLife -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterLife,
    currentPlayerLife
  );

  if (currentPlayerLife <= 0 && isBonusLife) {
    isBonusLife = false;
    removeBonusLife();
    currentPlayerLife = initialPlayerLife;
    alert("You should be died, but you saved by bonus life.");
    setPlayerHealth(initialPlayerLife);
  }

  if (currentMonsterLife <= 0 && currentPlayerLife > 0) {
    alert("You won!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "Player won",
      currentMonsterLife,
      currentPlayerLife
    );
  } else if (currentPlayerLife <= 0 && currentMonsterLife > 0) {
    alert("You lose!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "Monster won",
      currentMonsterLife,
      currentPlayerLife
    );
  } else if (currentPlayerLife <= 0 && currentMonsterLife <= 0) {
    alert("You have a draw");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "It is a draw",
      currentMonsterLife,
      currentPlayerLife
    );
  }

  if (currentMonsterLife <= 0 || currentPlayerLife <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  let maxDamage = mode === ATTACK_MODE ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  let logEventMode =
    mode === ATTACK_MODE
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;
  /*   if (mode === ATTACK_MODE) {
    maxDamage = ATTACK_VALUE;
    logEventMode = LOG_EVENT_PLAYER_ATTACK;
  } else if (mode === STRONG_ATTACK_MODE) {
    maxDamage = STRONG_ATTACK_VALUE;
    logEventMode = LOG_EVENT_PLAYER_STRONG_ATTACK;
  } */
  const monsterDamage = dealMonsterDamage(maxDamage);
  currentMonsterLife -= monsterDamage;
  writeToLog(
    logEventMode,
    monsterDamage,
    currentMonsterLife,
    currentPlayerLife
  );
  endRound();
}

function attackHandler() {
  attackMonster(0);
}

function strongAttackHandler() {
  attackMonster(1);
}

function healHandler() {
  let healValue;
  if (currentPlayerLife >= chosenMaxLife - HEAL_VALUE) {
    alert("You can`t heal more than your initial health");
    healValue = chosenMaxLife - currentPlayerLife;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(HEAL_VALUE);
  currentPlayerLife += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterLife,
    currentPlayerLife
  );
  endRound();
}

function printLogHandler() {
  /*   for (let i = 0; i < battleLog.length; i++) {
    console.log(battleLog[i]);
  } */
  let i = 0;
  for (const logElement of battleLog) {
    console.log(`#${i}`);
    for (const key in logElement) {
      console.log(`${key} => ${logElement[key]}`);
    }
    i++;
  }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healHandler);
logBtn.addEventListener("click", printLogHandler);
