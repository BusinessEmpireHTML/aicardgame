// Global game data and settings
const gameData = {
    player: {
      name: "Collector",
      coins: 1000,
      gems: 50,
      region: "Mystic Vale",
      collection: [], // player-owned cards
      deck: [] // current deck (max 30 cards)
    },
    cardPool: [] // all available cards
  };
  
  // Sample card definitions (in practice, load from a JSON file or database)
  gameData.cardPool = [
    {
      id: 1,
      name: "Arcanist Mage",
      type: "Mage",
      faction: "Arcane Order",
      rarity: "Rare",
      stats: { attack: 5, defense: 3, speed: 4, magic: 8 },
      abilities: { active: "Arcane Blast", passive: "Mana Shield" },
      flavor: "A master of the mystic arts, wielding raw magical power.",
      art: "assets/cards/arcanist_mage.png"
    },
    {
      id: 2,
      name: "Swordmaster Warrior",
      type: "Warrior",
      faction: "Iron Legion",
      rarity: "Common",
      stats: { attack: 7, defense: 6, speed: 5, magic: 2 },
      abilities: { active: "Blade Fury", passive: "Battle Hardened" },
      flavor: "A fierce warrior trained in the art of swordsmanship.",
      art: "assets/cards/swordmaster_warrior.png"
    },
    // … add more cards with various rarities and types
  ];
  
  // Utility: Random integer in a range
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  // Card class representing individual cards
  class Card {
    constructor(data) {
      this.id = data.id;
      this.name = data.name;
      this.type = data.type;
      this.faction = data.faction;
      this.rarity = data.rarity;
      this.stats = data.stats;
      this.abilities = data.abilities;
      this.flavor = data.flavor;
      this.art = data.art;
      this.level = 1; // for upgrades/evolution
    }
  }
  
  // Deck class for handling deck-related operations
  class Deck {
    constructor() {
      this.cards = [];
      this.maxCards = 30;
    }
    addCard(card) {
      // Enforce deck-building rules (e.g., no more than 3 duplicates)
      const count = this.cards.filter(c => c.id === card.id).length;
      if (count < 3 && this.cards.length < this.maxCards) {
        this.cards.push(card);
      } else {
        alert("Cannot add more copies of this card or deck is full.");
      }
    }
    removeCard(cardId) {
      this.cards = this.cards.filter(c => c.id !== cardId);
    }
  }
  
  // Player class to manage player data and progression
  class Player {
    constructor(data) {
      this.name = data.name;
      this.coins = data.coins;
      this.gems = data.gems;
      this.region = data.region;
      this.collection = data.collection; // array of Card objects
      this.deck = new Deck();
    }
  
    addCardToCollection(card) {
      this.collection.push(card);
    }
  
    spendCoins(amount) {
      if (this.coins >= amount) {
        this.coins -= amount;
        return true;
      }
      return false;
    }
  }
  
  // Battle system for turn-based combat
  class Battle {
    constructor(playerDeck, aiDeck) {
      this.playerDeck = playerDeck;
      this.aiDeck = aiDeck;
      this.turn = 0;
      this.battleLog = [];
    }
  
    calculateDamage(attacker, defender) {
      // Simple damage calculation (can be expanded to include abilities)
      let damage = attacker.stats.attack - defender.stats.defense * 0.5;
      return Math.max(0, Math.floor(damage));
    }
  
    performTurn() {
      // Alternate turns between player and AI
      const attacker = (this.turn % 2 === 0) ? this.playerDeck[getRandomInt(0, this.playerDeck.length)] : this.aiDeck[getRandomInt(0, this.aiDeck.length)];
      const defender = (this.turn % 2 === 0) ? this.aiDeck[getRandomInt(0, this.aiDeck.length)] : this.playerDeck[getRandomInt(0, this.playerDeck.length)];
  
      const damage = this.calculateDamage(attacker, defender);
      const logEntry = `${attacker.name} attacks ${defender.name} for ${damage} damage.`;
      this.battleLog.push(logEntry);
      this.turn++;
      return logEntry;
    }
  }
  
  // Initialize player
  const player = new Player(gameData.player);
  
  // UI Helpers
  function updateDashboard() {
    document.getElementById("player-info").textContent = `Player: ${player.name}`;
    document.getElementById("currency").textContent = `Coins: ${player.coins} | Gems: ${player.gems}`;
    document.getElementById("progress").textContent = `Region: ${player.region}`;
  }
  
  function renderCollection() {
    const container = document.getElementById("card-collection");
    container.innerHTML = "";
    player.collection.forEach(card => {
      const cardElem = document.createElement("div");
      cardElem.className = "card";
      cardElem.innerHTML = `
        <img src="${card.art}" alt="${card.name}">
        <div class="card-info">
          <h3>${card.name}</h3>
          <p>${card.flavor}</p>
        </div>
      `;
      // Animation on click to simulate card flip
      cardElem.addEventListener("click", () => {
        cardElem.classList.add("flipping");
        setTimeout(() => cardElem.classList.remove("flipping"), 500);
      });
      container.appendChild(cardElem);
    });
  }
  
  function renderDeck() {
    const container = document.getElementById("deck-cards");
    container.innerHTML = "";
    player.deck.cards.forEach(card => {
      const cardElem = document.createElement("div");
      cardElem.className = "card";
      cardElem.innerHTML = `
        <img src="${card.art}" alt="${card.name}">
        <div class="card-info">
          <h3>${card.name}</h3>
          <p>Lvl: ${card.level}</p>
        </div>
      `;
      container.appendChild(cardElem);
    });
  }
  
  // Simulate opening a booster pack and awarding a random card from the pool
  function openBoosterPack() {
    const packCost = 200;
    if (!player.spendCoins(packCost)) {
      alert("Not enough coins!");
      return;
    }
    // Define rarity probabilities (simplified)
    const probabilities = {
      Common: 0.6,
      Rare: 0.3,
      Epic: 0.09,
      Legendary: 0.01
    };
  
    // Filter cards by rarity based on random roll
    const roll = Math.random();
    let selectedRarity = "Common";
    if (roll > 0.99) selectedRarity = "Legendary";
    else if (roll > 0.9) selectedRarity = "Epic";
    else if (roll > 0.6) selectedRarity = "Rare";
  
    const candidates = gameData.cardPool.filter(card => card.rarity === selectedRarity);
    const cardData = candidates[getRandomInt(0, candidates.length)];
    if (cardData) {
      const newCard = new Card(cardData);
      player.addCardToCollection(newCard);
      updateDashboard();
      renderCollection();
      alert(`You obtained: ${newCard.name} (${newCard.rarity})`);
    }
  }
  
  // Simulate a battle round (player vs simple AI)
  function startBattle() {
    // For demo, create a temporary AI deck by randomly selecting cards from the pool
    const aiDeck = [];
    for (let i = 0; i < 5; i++) {
      const cardData = gameData.cardPool[getRandomInt(0, gameData.cardPool.length)];
      aiDeck.push(new Card(cardData));
    }
    // Use player's deck if available, otherwise use a few cards from the collection.
    const playerDeck = (player.deck.cards.length > 0) ? player.deck.cards : player.collection.slice(0, 5);
    if (playerDeck.length === 0) {
      alert("No cards available for battle! Build your deck or open booster packs.");
      return;
    }
    const battle = new Battle(playerDeck, aiDeck);
    const battleLogContainer = document.getElementById("battle-log");
    battleLogContainer.innerHTML = "";
    // Simulate 5 turns
    for (let i = 0; i < 5; i++) {
      const log = battle.performTurn();
      const p = document.createElement("p");
      p.textContent = log;
      battleLogContainer.appendChild(p);
    }
  }
  
  // Navigation between views
  document.getElementById("btn-collection").addEventListener("click", () => {
    document.querySelectorAll(".game-view").forEach(view => view.classList.add("hidden"));
    document.getElementById("collection-view").classList.remove("hidden");
  });
  
  document.getElementById("btn-deckbuilder").addEventListener("click", () => {
    document.querySelectorAll(".game-view").forEach(view => view.classList.add("hidden"));
    document.getElementById("deckbuilder-view").classList.remove("hidden");
    renderDeck();
  });
  
  document.getElementById("btn-battle").addEventListener("click", () => {
    document.querySelectorAll(".game-view").forEach(view => view.classList.add("hidden"));
    document.getElementById("battle-view").classList.remove("hidden");
  });
  
  document.getElementById("btn-store").addEventListener("click", () => {
    document.querySelectorAll(".game-view").forEach(view => view.classList.add("hidden"));
    document.getElementById("store-view").classList.remove("hidden");
  });
  
  // Button events
  document.getElementById("buy-pack").addEventListener("click", openBoosterPack);
  document.getElementById("start-battle").addEventListener("click", startBattle);
  document.getElementById("save-deck").addEventListener("click", () => {
    alert("Deck saved!");
    // Persist deck configuration via localStorage or backend
    localStorage.setItem("playerDeck", JSON.stringify(player.deck.cards));
  });
  
  // Audio toggle (dummy implementation; integrate with actual audio API as needed)
  document.getElementById("toggle-sound").addEventListener("click", () => {
    alert("Sound toggled!");
  });
  
  // Initial setup
  updateDashboard();
  
  // For demonstration, auto-open a booster pack to start with some cards
  if (player.collection.length === 0) {
    openBoosterPack();
  }  