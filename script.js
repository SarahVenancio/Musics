document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const connectModeBtn = document.getElementById('connectModeBtn');
    const memoryModeBtn = document.getElementById('memoryModeBtn');
    const easyLevelText = document.getElementById('easyLevelText');
    const mediumLevelText = document.getElementById('mediumLevelText');
    const hardLevelText = document.getElementById('hardLevelText');

    // Elementos do Jogo de Ligar
    const songsList = document.getElementById('songsList');
    const artistsList = document.getElementById('artistsList');
    const checkBtn = document.getElementById('checkBtn');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const nextGameBtn = document.getElementById('nextGameBtn');
    const backToLevels = document.getElementById('backToLevels');
    const helpBtn = document.getElementById('helpBtn');
    const closeHelp = document.getElementById('closeHelp');
    const helpModal = document.getElementById('helpModal');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    const feedbackArea = document.getElementById('feedbackArea');
    const feedbackText = document.getElementById('feedbackText');
    const timerElement = document.getElementById('timer');
    const songsEmpty = document.getElementById('songsEmpty');
    const artistsEmpty = document.getElementById('artistsEmpty');
    const levelSelection = document.getElementById('levelSelection');
    const gameArea = document.getElementById('gameArea');
    const levelButtons = document.querySelectorAll('.level-btn');
    const levelDisplay = document.getElementById('levelDisplay');
    const currentLevelSpan = document.getElementById('currentLevel');
    const genreFiltersContainer = document.getElementById('genreFilters');
    const rankingArea = document.getElementById('rankingArea');
    const rankingTableBody = document.getElementById('rankingTableBody');
    const showRankingBtn = document.getElementById('showRankingBtn');
    const backToMenuBtn = document.getElementById('backToMenuBtn');
    const clearRankingBtn = document.getElementById('clearRankingBtn');

    // Elementos do modal de nome
    const nameModal = document.getElementById('nameModal');
    const playerNameInput = document.getElementById('playerNameInput');
    const submitNameBtn = document.getElementById('submitNameBtn');
    const cancelNameBtn = document.getElementById('cancelNameBtn');
    const finalScoreElement = document.getElementById('finalScore');
    const finalLevelElement = document.getElementById('finalLevel');
    const shareBtn = document.getElementById('shareBtn');

    // Elementos do Jogo da Memória
    const memoryGameArea = document.getElementById('memoryGameArea');
    const memoryGrid = document.getElementById('memoryGrid');
    const backToLevelsFromMemory = document.getElementById('backToLevelsFromMemory');
    const memoryTimerElement = document.getElementById('memoryTimer');
    const movesCountElement = document.getElementById('movesCount');
    const resetMemoryGameBtn = document.getElementById('resetMemoryGame');
    const memoryFeedbackArea = document.getElementById('memoryFeedbackArea');
    const memoryFeedbackText = document.getElementById('memoryFeedbackText');

    // Modal de "Zerar o Jogo"
    const gameBeatenModal = document.getElementById('gameBeatenModal');
    const gameBeatenPlayerNameInput = document.getElementById('gameBeatenPlayerNameInput');
    const submitGameBeatenNameBtn = document.getElementById('submitGameBeatenNameBtn');

    // Elementos das Conquistas
    const showAchievementsBtn = document.getElementById('showAchievementsBtn');
    const achievementsModal = document.getElementById('achievementsModal');
    const closeAchievementsModal = document.getElementById('closeAchievementsModal');
    const achievementsList = document.getElementById('achievementsList');

    // Elementos do Multiplayer
    const playerToggle = document.getElementById('playerToggle');
    const turnTransitionModal = document.getElementById('turnTransitionModal');
    const nextPlayerName = document.getElementById('nextPlayerName');
    const startNextTurnBtn = document.getElementById('startNextTurnBtn');
    const multiplayerResultsModal = document.getElementById('multiplayerResultsModal');
    const winnerAnnouncement = document.getElementById('winnerAnnouncement');
    const player1FinalScore = document.getElementById('player1FinalScore');
    const player2FinalScore = document.getElementById('player2FinalScore');
    const playAgainMultiplayerBtn = document.getElementById('playAgainMultiplayerBtn');
    const backToMenuMultiplayerBtn = document.getElementById('backToMenuMultiplayerBtn');


    // Estado do Jogo
    let currentGameMode = 'connect'; // 'connect' ou 'memory'
    let isMultiplayer = false;
    let currentPlayer = 1;
    let playerScores = { 1: 0, 2: 0 };
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let correctAnswers = {};
    let userAnswers = {};
    let countdown;
    let timeLeft;
    let currentLevel = 'easy';
    let pointsPerAnswer = 10;
    let selectedGenres = ['all'];
    let gameOver = false;
    let totalPairs;
    let isNewGameSession = true;
    let currentScoreToSave = 0;
    let playedSongIds = new Set();

    // Tradução dos nomes dos níveis
    const levelNames = {
        easy: "Fácil",
        medium: "Médio",
        hard: "Difícil"
    };

    // Estado do Jogo da Memória
    let memoryCards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let memoryTimer;
    let memoryTime = 0;
    let isChecking = false; // Previne cliques rápidos durante a verificação

    // Dados das músicas foram movidos para music-data.js

    const levelConfig = {
        easy: { count: 4, time: 90, points: 10 },
        medium: { count: 6, time: 120, points: 15 },
        hard: { count: 8, time: 150, points: 20 }
    };

    const memoryLevelConfig = {
        easy: { pairs: 4, grid: 'grid-cols-4', time: 60 },  // 8 cards
        medium: { pairs: 6, grid: 'grid-cols-4', time: 90 }, // 12 cards
        hard: { pairs: 8, grid: 'grid-cols-4', time: 120 }   // 16 cards
    };

    let multiplayerGameData = []; // Armazena as músicas/cartas do jogo multiplayer

    // Definições de Conquistas
    const achievements = [
        { id: 'hard_streak_10', title: 'Implacável', description: 'Acerte 10 jogos seguidos no modo Difícil.', icon: 'fa-fire' },
        { id: 'collect_pop', title: 'Magnata do Pop', description: 'Colete todas as músicas do gênero Pop.', icon: 'fa-music' },
        { id: 'collect_rock', title: 'Lenda do Rock', description: 'Colete todas as músicas do gênero Rock.', icon: 'fa-guitar' },
        { id: 'collect_sertanejo', title: 'Rei do Sertanejo', description: 'Colete todas as músicas do gênero Sertanejo.', icon: 'fa-hat-cowboy' },
        { id: 'collect_all', title: 'Mestre Musical', description: 'Colete TODAS as músicas do jogo.', icon: 'fa-trophy' },
        // NOVAS CONQUISTAS
        { id: 'first_win', title: 'Primeira Vitória', description: 'Complete seu primeiro jogo com sucesso.', icon: 'fa-star' },
        { id: 'memory_master', title: 'Mestre da Memória', description: 'Complete um jogo da memória sem errar nenhuma carta.', icon: 'fa-brain' },
        { id: 'speed_demon', title: 'Demônio da Velocidade', description: 'Complete um jogo em menos de 30 segundos.', icon: 'fa-bolt' },
        { id: 'multiplayer_king', title: 'Rei do Multiplayer', description: 'Vença 10 partidas multiplayer.', icon: 'fa-crown' },
        { id: 'genre_explorer', title: 'Explorador de Gêneros', description: 'Jogue em pelo menos 5 gêneros diferentes.', icon: 'fa-globe' },
        { id: 'perfect_game', title: 'Jogo Perfeito', description: 'Acerte todas as músicas em um jogo no nível Difícil.', icon: 'fa-gem' },
        { id: 'marathon_runner', title: 'Corredor de Maratona', description: 'Jogue 50 jogos no total.', icon: 'fa-running' }
    ];
    
    // Estado das Conquistas
    let unlockedAchievements = new Set();
    let hardModeStreak = 0;
    let correctlyAnsweredSongIds = new Set();
    // Adicione estas variáveis para rastrear as novas conquistas
    let gamesPlayed = 0;
    let multiplayerWins = 0;
    let playedGenres = new Set();
    let perfectGames = 0;


    // Inicialização
    initGame();

    function initGame() {
        // Reset high score for deployment
        localStorage.removeItem('highScore');
        highScore = 0;
        highScoreElement.textContent = highScore;

        loadAchievementProgress(); // Carrega o progresso das conquistas
        const allGenres = [...new Set(musicData.map(item => item.genre))];
        createGenreFilters(allGenres);
        setupEventListeners();
        resetGame();
        
        // Definir o nível inicial como "Fácil" nos displays
        updateLevelDisplay();
    }

    function loadAchievementProgress() {
        const savedUnlocked = localStorage.getItem('unlockedAchievements');
        if (savedUnlocked) {
            unlockedAchievements = new Set(JSON.parse(savedUnlocked));
        }

        hardModeStreak = parseInt(localStorage.getItem('hardModeStreak') || '0', 10);
        gamesPlayed = parseInt(localStorage.getItem('gamesPlayed') || '0', 10);
        multiplayerWins = parseInt(localStorage.getItem('multiplayerWins') || '0', 10);
        perfectGames = parseInt(localStorage.getItem('perfectGames') || '0', 10);

        const savedCorrectlyAnswered = localStorage.getItem('correctlyAnsweredSongIds');
        if (savedCorrectlyAnswered) {
            correctlyAnsweredSongIds = new Set(JSON.parse(savedCorrectlyAnswered));
        }

        const savedPlayedGenres = localStorage.getItem('playedGenres');
        if (savedPlayedGenres) {
            playedGenres = new Set(JSON.parse(savedPlayedGenres));
        }
    }

    function saveAchievementProgress() {
        localStorage.setItem('unlockedAchievements', JSON.stringify([...unlockedAchievements]));
        localStorage.setItem('hardModeStreak', hardModeStreak);
        localStorage.setItem('gamesPlayed', gamesPlayed);
        localStorage.setItem('multiplayerWins', multiplayerWins);
        localStorage.setItem('perfectGames', perfectGames);
        localStorage.setItem('correctlyAnsweredSongIds', JSON.stringify([...correctlyAnsweredSongIds]));
        localStorage.setItem('playedGenres', JSON.stringify([...playedGenres]));
    }

    function checkAndUnlockAchievements() {
        achievements.forEach(ach => {
            if (unlockedAchievements.has(ach.id)) return;

            let unlocked = false;
            switch (ach.id) {
                case 'hard_streak_10':
                    if (hardModeStreak >= 10) unlocked = true;
                    break;
                case 'collect_pop':
                case 'collect_rock':
                case 'collect_sertanejo':
                    const genre = ach.id.split('_')[1];
                    const genreSongs = musicData.filter(song => song.genre.toLowerCase() === genre);
                    const allCollected = genreSongs.every(song => correctlyAnsweredSongIds.has(song.id));
                    if (allCollected) unlocked = true;
                    break;
                case 'collect_all':
                    if (correctlyAnsweredSongIds.size >= musicData.length) unlocked = true;
                    break;
                // NOVAS CONQUISTAS
                case 'first_win':
                    if (gamesPlayed > 0) unlocked = true;
                    break;
                case 'memory_master':
                    // Esta conquista será desbloqueada na função endMemoryGame
                    break;
                case 'speed_demon':
                    if (timeLeft && (levelConfig[currentLevel].time - timeLeft) < 30) {
                        unlocked = true;
                    }
                    break;
                case 'multiplayer_king':
                    if (multiplayerWins >= 10) unlocked = true;
                    break;
                case 'genre_explorer':
                    if (playedGenres.size >= 5) unlocked = true;
                    break;
                case 'perfect_game':
                    if (perfectGames > 0) unlocked = true;
                    break;
                case 'marathon_runner':
                    if (gamesPlayed >= 50) unlocked = true;
                    break;
            }

            if (unlocked) {
                unlockedAchievements.add(ach.id);
                showAchievementNotification(ach);
            }
        });
    }
    
    function showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-toast';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${achievement.icon} fa-2x text-yellow-400 mr-4"></i>
                <div>
                    <h4 class="font-bold text-lg">Conquista Desbloqueada!</h4>
                    <p>${achievement.title}</p>
                </div>
            </div>
        `;
        document.body.appendChild(notification);
    
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 5000);
    }

    // Gerenciamento de UI
    function showElement(element) {
        element.classList.remove('hidden');
        setTimeout(() => {
            element.classList.add('opacity-100', 'scale-y-100');
        }, 10);
    }

    function hideElement(element, callback) {
        element.classList.remove('opacity-100', 'scale-y-100');
        element.classList.add('opacity-0', 'scale-y-0');
        setTimeout(() => {
            element.classList.add('hidden');
            if (callback) callback();
        }, 500);
    }

    function animateItems() {
        const items = document.querySelectorAll('.song-item, .artist-item');
        items.forEach((item, index) => {
            item.classList.add('fade-in');
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Função para atualizar o display do nível em todos os locais
    function updateLevelDisplay() {
        const levelText = levelNames[currentLevel];
        levelDisplay.textContent = levelText;
        currentLevelSpan.textContent = levelText;
    }

    // Funções para controlar o modal de nome
    function showNameModal(scoreToSave, level) {
        currentScoreToSave = scoreToSave;
        finalScoreElement.textContent = scoreToSave;
        finalLevelElement.textContent = levelNames[level];
        playerNameInput.value = '';
        
        nameModal.classList.remove('hidden');
        setTimeout(() => {
            nameModal.querySelector('div').classList.remove('scale-95', 'opacity-0');
            playerNameInput.focus();
        }, 10);
    }

    function hideNameModal() {
        const modalContent = nameModal.querySelector('div');
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            nameModal.classList.add('hidden');
        }, 300);
    }

    function showGameBeatenModal() {
        gameBeatenModal.classList.remove('hidden');
        setTimeout(() => {
            gameBeatenModal.querySelector('div').classList.remove('scale-95', 'opacity-0');
            gameBeatenPlayerNameInput.focus();
        }, 10);
    }

    function hideGameBeatenModal() {
        const modalContent = gameBeatenModal.querySelector('div');
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            gameBeatenModal.classList.add('hidden');
        }, 300);
    }

    // Lógica do jogo
    function resetGame() {
        gameOver = false;
        userAnswers = {};
        songsList.innerHTML = '';
        artistsList.innerHTML = '';
        songsList.appendChild(songsEmpty);
        artistsList.appendChild(artistsEmpty);
        songsEmpty.classList.remove('hidden');
        artistsEmpty.classList.remove('hidden');
        hideElement(feedbackArea);
        nextGameBtn.classList.add('hidden');
        tryAgainBtn.classList.add('hidden');
        checkBtn.classList.remove('hidden');
        stopCountdown();
        timerElement.textContent = levelConfig[currentLevel].time;
        timerElement.classList.remove('text-red-400');
    }

function resetMatchState() {
    isNewGameSession = true;
    score = 0;
    playerScores = { 1: 0, 2: 0 };
    currentPlayer = 1;
    multiplayerGameData = [];
    scoreElement.textContent = '0';
}

    function startNewGame() {
        stopAudio();
        resetGame();
        hideElement(rankingArea);

        // Atualizar o display do nível antes de iniciar o jogo
        updateLevelDisplay();

        const filteredData = musicData.filter(item => selectedGenres.includes('all') || selectedGenres.includes(item.genre));
        
        let availableSongs = filteredData.filter(song => !playedSongIds.has(song.id));

        hideElement(levelSelection, () => showElement(gameArea));
        
        let selectedData;
        if (isMultiplayer && currentPlayer === 2) {
            selectedData = multiplayerGameData; // Usa as mesmas músicas para o Jogador 2
        } else {
            // Turno do Jogador 1 ou modo de um jogador
            if (availableSongs.length < levelConfig[currentLevel].count) {
                showGameBeatenModal();
                return;
            }
            selectedData = shuffleArray([...availableSongs]).slice(0, levelConfig[currentLevel].count);
            if (isMultiplayer) {
                multiplayerGameData = selectedData; // Salva as músicas para o próximo jogador
            }
        }
        
        if (selectedData.length === 0) {
            showCustomAlert('Nenhuma música encontrada para os gêneros selecionados. Por favor, escolha outros gêneros.');
            showElement(levelSelection);
            hideElement(gameArea);
            return;
        }

        selectedData.forEach(song => playedSongIds.add(song.id));

        correctAnswers = {};
        selectedData.forEach(item => correctAnswers[item.song] = item.artist);
        totalPairs = selectedData.length;

        selectedData.forEach(item => {
            songsList.appendChild(createDraggableElement(item));
        });

        const artists = shuffleArray(selectedData.map(item => item.artist));
        artists.forEach(artist => {
            artistsList.appendChild(createDropZone(artist));
        });

        if (songsList.children.length > 1) songsEmpty.classList.add('hidden');
        if (artistsList.children.length > 1) artistsEmpty.classList.add('hidden');

        animateItems();
        startCountdown();
    }

    function checkAnswers() {
        if (gameOver) return;
        gameOver = true;
        stopCountdown();
        stopAudio();

        let correctCount = 0;
        let incorrectItems = [];

        const allSongs = Object.keys(correctAnswers);
        allSongs.forEach(song => {
            const songElement = document.querySelector(`[data-song="${song}"]`);
            const artistElement = document.querySelector(`[data-artist="${userAnswers[song]}"]`);

            if (userAnswers[song] && userAnswers[song] === correctAnswers[song]) {
                correctCount++;
                if (artistElement) artistElement.classList.add('correct');
                if (songElement) songElement.classList.add('correct');
            } else {
                if (songElement) {
                    songElement.classList.add('incorrect');
                    incorrectItems.push(songElement);
                }
                if (artistElement) {
                    artistElement.classList.add('incorrect');
                    incorrectItems.push(artistElement);
                }
            }
        });

        const roundScore = calculateScore(correctCount);

        // Atualiza o progresso das conquistas
        if (correctCount > 0) {
            allSongs.forEach(song => {
                if (userAnswers[song] && userAnswers[song] === correctAnswers[song]) {
                    const songData = musicData.find(item => item.song === song && item.artist === correctAnswers[song]);
                    if (songData) {
                        correctlyAnsweredSongIds.add(songData.id);
                    }
                }
            });
        }

        // Atualizar estatísticas para conquistas
        gamesPlayed++;
        
        // Registrar gêneros jogados
        selectedGenres.forEach(genre => {
            if (genre !== 'all') {
                playedGenres.add(genre);
            }
        });
        
        // Verificar se foi um jogo perfeito no nível difícil
        if (currentLevel === 'hard' && correctCount === totalPairs) {
            perfectGames++;
            hardModeStreak++;
        } else if (currentLevel === 'hard') {
            hardModeStreak = 0;
        }
        
        // Verificar conquista de velocidade
        if (timeLeft && (levelConfig[currentLevel].time - timeLeft) < 30) {
            checkAndUnlockAchievements();
        }
        
        checkAndUnlockAchievements();
        saveAchievementProgress();


        if (isMultiplayer) {
            playerScores[currentPlayer] = roundScore;
            scoreElement.textContent = roundScore; 

            if (currentPlayer === 1) {
                showTurnTransitionModal();
            } else {
                showMultiplayerResults();
            }
        } else {
            // Lógica para um jogador
            if (isNewGameSession) {
                score = roundScore;
                isNewGameSession = false;
            } else {
                score += roundScore;
            }
            
            scoreElement.textContent = score;
    
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('highScore', highScore);
            }
    
            if (correctCount === totalPairs) {
                showFeedback(`Parabéns! +${roundScore} pontos! Total: ${score} 🎉`, 'bg-green-600/70');
                nextGameBtn.classList.remove('hidden');
                checkBtn.classList.add('hidden');
                tryAgainBtn.classList.add('hidden');
            } else {
                showFeedback(`Você acertou ${correctCount} de ${totalPairs}. +${roundScore} pontos! Total: ${score}`, 'bg-blue-600/70');
                tryAgainBtn.classList.remove('hidden');
                checkBtn.classList.add('hidden');
                nextGameBtn.classList.add('hidden');
                saveScoreToRanking(score, currentLevel);
            }
        }
    }

    function calculateScore(correctCount) {
        let timeBonus = 0;
        if (timeLeft > 0) {
            timeBonus = Math.floor(timeLeft / 10);
        }
        return (correctCount * pointsPerAnswer) + timeBonus;
    }

    function resetIncorrectAnswers() {
        const incorrectItems = document.querySelectorAll('.incorrect');
        incorrectItems.forEach(item => {
            item.classList.remove('incorrect', 'shake', 'matched');
            if (item.dataset.song) {
                delete userAnswers[item.dataset.song];
                item.classList.add('bg-blue-700/50');
            } else if (item.dataset.artist) {
                item.classList.add('bg-purple-700/50');
                item.textContent = item.dataset.artist;
            }
        });
        gameOver = false;
        hideElement(feedbackArea);
        tryAgainBtn.classList.add('hidden');
        checkBtn.classList.remove('hidden');
        startCountdown();
    }

    // Gerenciamento de Ranking
    function getRanking() {
        const ranking = localStorage.getItem('ranking');
        return ranking ? JSON.parse(ranking) : [];
    }

    function saveScoreToRanking(scoreToSave, level) {
        showNameModal(scoreToSave, level);
    }

    function savePlayerScoreToRanking(playerName, scoreToSave, level) {
        const ranking = getRanking();
        ranking.push({
            name: playerName,
            score: scoreToSave,
            level: levelNames[level]
        });
        ranking.sort((a, b) => b.score - a.score);
        if (ranking.length > 10) {
            ranking.pop();
        }
        localStorage.setItem('ranking', JSON.stringify(ranking));
        displayRanking();
        
        isNewGameSession = true;
        score = 0;
        scoreElement.textContent = score;
    }

    function displayRanking() {
        const ranking = getRanking();
        rankingTableBody.innerHTML = '';
        if (ranking.length === 0) {
            rankingTableBody.innerHTML = `<tr><td colspan="4" class="p-3 text-center text-gray-400">Nenhuma pontuação registrada ainda.</td></tr>`;
            return;
        }

        ranking.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-700/50 hover:bg-white/5 transition-colors';
            row.innerHTML = `
                <td class="p-3 text-center font-bold">${index + 1}</td>
                <td class="p-3">${entry.name}</td>
                <td class="p-3 text-yellow-300 font-semibold">${entry.score}</td>
                <td class="p-3 capitalize">${entry.level}</td>
            `;
            rankingTableBody.appendChild(row);
        });
    }

    // Gerenciamento de Áudio
    let currentAudio = null;
    const previewCache = new Map();

    async function fetchPreviewUrl(song, artist) {
        const cacheKey = `${song}-${artist}`;
        if (previewCache.has(cacheKey)) {
            return previewCache.get(cacheKey);
        }

        const searchTerm = `${song} ${artist}`;
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&entity=song&limit=1`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('A resposta da rede não foi boa');
            }
            const data = await response.json();
            if (data.results.length > 0 && data.results[0].previewUrl) {
                const previewUrl = data.results[0].previewUrl;
                previewCache.set(cacheKey, previewUrl);
                return previewUrl;
            } else {
                previewCache.set(cacheKey, null); // Cache a falha para evitar novas tentativas
                return null;
            }
        } catch (error) {
            console.error('Falha ao buscar a pré-visualização da música:', error);
            previewCache.set(cacheKey, null);
            return null;
        }
    }

    async function playPreview(song, artist) {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        const previewUrl = await fetchPreviewUrl(song, artist);

        if (previewUrl) {
            currentAudio = new Audio(previewUrl);
            currentAudio.volume = 0.5;
            currentAudio.play().catch(e => console.error("Erro ao tocar áudio:", e));
        } else {
            showCustomAlert('Pré-visualização de áudio não disponível para esta música.');
        }
    }

    function stopAudio() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
    }

    function showCustomAlert(message) {
        const alertModal = document.createElement('div');
        alertModal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50';
        alertModal.innerHTML = `
            <div class="bg-gray-800 rounded-xl max-w-md w-full mx-4 p-6 shadow-2xl">
                <h2 class="text-xl font-bold mb-4 text-yellow-300">Aviso</h2>
                <p class="mb-6">${message}</p>
                <button id="closeAlert" class="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-medium transition-colors">
                    OK
                </button>
            </div>
        `;
        
        document.body.appendChild(alertModal);
        
        document.getElementById('closeAlert').addEventListener('click', () => {
            document.body.removeChild(alertModal);
        });
    }

    // Funções utilitárias
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function stopCountdown() {
        if (countdown) clearInterval(countdown);
        timerElement.classList.remove('pulse');
    }

    function startCountdown() {
        stopCountdown();
        timeLeft = levelConfig[currentLevel].time;
        timerElement.textContent = timeLeft;
        timerElement.classList.add('pulse');
        countdown = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if (timeLeft <= 10) {
                timerElement.classList.add('text-red-400');
            }
            if (timeLeft <= 0) {
                checkAnswers();
            }
        }, 1000);
    }

    function showFeedback(text, bgColor) {
        feedbackText.textContent = text;
        feedbackArea.className = `text-center py-4 px-6 rounded-lg mb-6 ${bgColor} transform scale-y-100 opacity-100 transition-all duration-300 origin-bottom`;
        feedbackArea.classList.remove('hidden');
    }

    // Criação de elementos dinâmicos
    function createGenreFilters(genres) {
        genreFiltersContainer.innerHTML = '';
        const allButton = document.createElement('button');
        allButton.className = 'genre-filter-btn bg-purple-600/50 hover:bg-purple-700/50 px-3 py-1 rounded-full text-sm transition-all active';
        allButton.dataset.genre = 'all';
        allButton.textContent = 'Todos';
        allButton.addEventListener('click', () => toggleGenreFilter('all'));
        genreFiltersContainer.appendChild(allButton);

        genres.forEach(genre => {
            const button = document.createElement('button');
            button.className = 'genre-filter-btn bg-purple-600/50 hover:bg-purple-700/50 px-3 py-1 rounded-full text-sm transition-all';
            button.dataset.genre = genre;
            button.textContent = genre;
            button.addEventListener('click', () => toggleGenreFilter(genre));
            genreFiltersContainer.appendChild(button);
        });
    }

    function createDraggableElement(item) {
        const li = document.createElement('li');
        li.className = `bg-blue-700/50 p-3 rounded cursor-grab song-item transition-transform flex justify-between items-center`;
        li.dataset.song = item.song;
        li.draggable = true;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'flex items-center space-x-2';

        const songText = document.createElement('span');
        songText.textContent = item.song;
        contentDiv.appendChild(songText);

        if (item.genre) {
            const genreSpan = document.createElement('span');
            genreSpan.className = 'genre-tag';
            genreSpan.textContent = item.genre;
            contentDiv.appendChild(genreSpan);
        }

        const playButton = document.createElement('button');
        playButton.className = 'text-blue-300 hover:text-blue-200 transition-colors';
        playButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        playButton.onclick = (e) => {
            e.stopPropagation();
            playPreview(item.song, item.artist);
        };

        li.appendChild(contentDiv);
        li.appendChild(playButton);

        // Desktop Drag & Drop
        li.addEventListener('dragstart', (e) => {
            if (gameOver) return;
            e.dataTransfer.setData('text/plain', item.song);
            li.classList.add('dragging');
        });
        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
        });

        // Mobile Touch Drag & Drop
        let clone = null;
        let startX, startY;
        let isDragging = false;

        function moveClone(x, y) {
            if (!clone) return;
            clone.style.left = x - (clone.offsetWidth / 2) + 'px';
            clone.style.top = y - (clone.offsetHeight / 2) + 'px';
        }

        li.addEventListener('touchstart', (e) => {
            if (gameOver) return;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            isDragging = false;
        }, { passive: true });

        li.addEventListener('touchmove', (e) => {
            if (gameOver) return;
            
            const touch = e.touches[0];
            const moveX = Math.abs(touch.clientX - startX);
            const moveY = Math.abs(touch.clientY - startY);

            if (!isDragging && (moveX > 5 || moveY > 5)) {
                isDragging = true;
                li.classList.add('dragging');
                clone = li.cloneNode(true);
                clone.style.position = 'absolute';
                clone.style.width = li.offsetWidth + 'px';
                clone.style.pointerEvents = 'none';
                clone.style.zIndex = '1000';
                document.body.appendChild(clone);
            }

            if (isDragging) {
                e.preventDefault();
                moveClone(touch.clientX, touch.clientY);
                
                clone.style.display = 'none';
                const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
                clone.style.display = 'block';

                document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
                if (elementUnder) {
                    const dropZone = elementUnder.closest('.artist-item');
                    if (dropZone && !dropZone.classList.contains('matched')) {
                        dropZone.classList.add('drag-over');
                    }
                }
            }
        }, { passive: false });

        li.addEventListener('touchend', (e) => {
            if (gameOver || !isDragging) {
                if (clone) {
                    document.body.removeChild(clone);
                    clone = null;
                }
                li.classList.remove('dragging');
                isDragging = false;
                return;
            }

            e.preventDefault();

            clone.style.display = 'none';
            const touch = e.changedTouches[0];
            const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
            
            document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

            if (elementUnder) {
                const dropZone = elementUnder.closest('.artist-item');
                if (dropZone && !dropZone.classList.contains('matched')) {
                    makeConnection(li, dropZone);
                }
            }
            
            li.classList.remove('dragging');
            document.body.removeChild(clone);
            clone = null;
            isDragging = false;
        });

        li.addEventListener('click', handleItemClick);
        return li;
    }

    function createDropZone(artist) {
        const li = document.createElement('li');
        li.className = `bg-purple-700/50 p-3 rounded artist-item transition-transform`;
        li.dataset.artist = artist;
        li.textContent = artist;

        li.addEventListener('dragover', (e) => {
            e.preventDefault();
            li.classList.add('drag-over');
        });
        li.addEventListener('dragleave', () => {
            li.classList.remove('drag-over');
        });
        li.addEventListener('drop', (e) => {
            e.preventDefault();
            li.classList.remove('drag-over');
            const droppedSong = e.dataTransfer.getData('text/plain');
            const droppedItem = document.querySelector(`[data-song="${droppedSong}"]`);
            makeConnection(droppedItem, li);
        });
        li.addEventListener('click', handleItemClick);
        return li;
    }

    function handleItemClick() {
        if (gameOver) return;

        const selectedSong = document.querySelector('.song-item.bg-yellow-500');
        const selectedArtist = document.querySelector('.artist-item.bg-yellow-500');

        if (this.dataset.song) {
            if (this.classList.contains('bg-yellow-500')) {
                this.classList.remove('bg-yellow-500', 'text-gray-900');
            } else {
                if (selectedSong) selectedSong.classList.remove('bg-yellow-500', 'text-gray-900');
                this.classList.add('bg-yellow-500', 'text-gray-900');
            }
            if (selectedArtist) {
                makeConnection(this, selectedArtist);
            }
        } else if (this.dataset.artist) {
            if (this.classList.contains('bg-yellow-500')) {
                this.classList.remove('bg-yellow-500', 'text-gray-900');
            } else {
                if (selectedArtist) selectedArtist.classList.remove('bg-yellow-500', 'text-gray-900');
                this.classList.add('bg-yellow-500', 'text-gray-900');
            }
            if (selectedSong) {
                makeConnection(selectedSong, this);
            }
        }
    }

    function makeConnection(songElement, artistElement) {
        const song = songElement.dataset.song;
        const artist = artistElement.dataset.artist;

        if (userAnswers[song]) {
            const oldArtistElement = document.querySelector(`[data-artist="${userAnswers[song]}"]`);
            if (oldArtistElement) {
                oldArtistElement.textContent = oldArtistElement.dataset.artist;
                oldArtistElement.classList.remove('matched');
                oldArtistElement.classList.add('bg-purple-700/50');
            }
        }

        userAnswers[song] = artist;
        artistElement.textContent = `${artist} (${song})`;
        artistElement.classList.add('matched');
        artistElement.classList.remove('bg-purple-700/50');

        songElement.classList.add('matched');
        songElement.classList.remove('bg-blue-700/50', 'bg-yellow-500', 'text-gray-900');
        artistElement.classList.remove('bg-yellow-500', 'text-gray-900');
    }

    // Gerenciamento de eventos - CORRIGIDO
    function setupEventListeners() {
        connectModeBtn.addEventListener('click', () => switchGameMode('connect'));
        memoryModeBtn.addEventListener('click', () => switchGameMode('memory'));

        levelButtons.forEach(button => {
            button.addEventListener('click', function() {
                resetMatchState(); // Centraliza o reinício do estado da partida

                currentLevel = this.dataset.level;
                levelButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                updateLevelDisplay();

                if (currentGameMode === 'connect') {
                    pointsPerAnswer = levelConfig[currentLevel].points;
                    setTimeout(startNewGame, 300);
                } else {
                    setTimeout(startMemoryGame, 300);
                }
            });
        });

        backToLevels.addEventListener('click', function() {
            hideElement(gameArea, () => showElement(levelSelection));
            stopCountdown();
            stopAudio();
            playedSongIds.clear();
        });

        backToLevelsFromMemory.addEventListener('click', function() {
            hideElement(memoryGameArea, () => showElement(levelSelection));
            resetMemoryGame(false);
        });

        resetMemoryGameBtn.addEventListener('click', () => resetMemoryGame(true));

        nextGameBtn.addEventListener('click', startNewGame);
        checkBtn.addEventListener('click', checkAnswers);
        tryAgainBtn.addEventListener('click', resetIncorrectAnswers);

        helpBtn.addEventListener('click', () => {
            const helpModalContent = helpModal.querySelector('div');
            helpModal.classList.remove('hidden');
            setTimeout(() => {
                helpModalContent.classList.remove('scale-95', 'opacity-0');
            }, 10);
        });

        closeHelp.addEventListener('click', () => {
            const helpModalContent = helpModal.querySelector('div');
            helpModalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                helpModal.classList.add('hidden');
            }, 300);
        });

        showRankingBtn.addEventListener('click', () => {
            hideElement(levelSelection, () => showElement(rankingArea));
            displayRanking();
        });

        backToMenuBtn.addEventListener('click', () => {
            hideElement(rankingArea, () => showElement(levelSelection));
        });

        clearRankingBtn.addEventListener('click', () => {
            const confirmModal = document.createElement('div');
            confirmModal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50';
            confirmModal.innerHTML = `
                <div class="bg-gray-800 rounded-xl max-w-md w-full mx-4 p-6 shadow-2xl">
                    <h2 class="text-xl font-bold mb-4 text-yellow-300">Limpar Ranking</h2>
                    <p class="mb-6">Tem certeza que deseja limpar o ranking? Esta ação não pode ser desfeita.</p>
                    <div class="flex gap-3">
                        <button id="confirmCancel" class="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-medium transition-colors">
                            Cancelar
                        </button>
                        <button id="confirmClear" class="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-medium transition-colors">
                            Limpar
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(confirmModal);
            
            document.getElementById('confirmClear').addEventListener('click', () => {
                localStorage.removeItem('ranking');
                displayRanking();
                document.body.removeChild(confirmModal);
            });
            
            document.getElementById('confirmCancel').addEventListener('click', () => {
                document.body.removeChild(confirmModal);
            });
        });

        submitNameBtn.addEventListener('click', function() {
            const playerName = playerNameInput.value.trim() || "Jogador";
            if (playerName) {
                savePlayerScoreToRanking(playerName, currentScoreToSave, currentLevel);
                hideNameModal();
                showFeedback(`Pontuação de ${playerName} salva no ranking!`, 'bg-green-600/70');
            }
        });

        cancelNameBtn.addEventListener('click', function() {
            hideNameModal();
        });

        playerNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitNameBtn.click();
            }
        });

        nameModal.addEventListener('click', function(e) {
            if (e.target === nameModal) {
                hideNameModal();
            }
        });

        shareBtn.addEventListener('click', shareResult);

        playerToggle.addEventListener('click', (e) => {
            const selectedOption = e.target.closest('.player-toggle-option');
            if (!selectedOption) return;

            const numPlayers = selectedOption.dataset.players;
            isMultiplayer = numPlayers === '2';

            document.querySelectorAll('.player-toggle-option').forEach(opt => opt.classList.remove('active'));
            selectedOption.classList.add('active');

            playerToggle.dataset.selected = numPlayers;
            
            const slider = playerToggle.querySelector('.player-toggle-slider');
            if (isMultiplayer) {
                slider.style.backgroundImage = 'linear-gradient(to right, #f97316, #ea580c)';
            } else {
                slider.style.backgroundImage = 'linear-gradient(to right, #0d9488, #0f766e)';
            }
        });

        startNextTurnBtn.addEventListener('click', () => {
            const modalContent = turnTransitionModal.querySelector('div');
            modalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                turnTransitionModal.classList.add('hidden');
                currentPlayer = 2;
                resetGame(); // Limpa o tabuleiro para o próximo jogador
                if (currentGameMode === 'connect') {
                    startNewGame();
                } else {
                    startMemoryGame();
                }
            }, 300);
        });
    
        playAgainMultiplayerBtn.addEventListener('click', () => {
            const modalContent = multiplayerResultsModal.querySelector('div');
            modalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                multiplayerResultsModal.classList.add('hidden');
                resetMatchState(); // Garante que a partida seja reiniciada
                resetGame();
                if (currentGameMode === 'connect') {
                    startNewGame();
                } else {
                    startMemoryGame();
                }
            }, 300);
        });
    
        backToMenuMultiplayerBtn.addEventListener('click', () => {
            const modalContent = multiplayerResultsModal.querySelector('div');
            modalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                multiplayerResultsModal.classList.add('hidden');
                resetGame();
                hideElement(gameArea, () => showElement(levelSelection));
                hideElement(memoryGameArea, () => showElement(levelSelection));
            }, 300);
        });

        showAchievementsBtn.addEventListener('click', () => {
            displayAchievements();
            achievementsModal.classList.remove('hidden');
            setTimeout(() => {
                achievementsModal.querySelector('div').classList.remove('scale-95', 'opacity-0');
            }, 10);
        });
    
        closeAchievementsModal.addEventListener('click', () => {
            const modalContent = achievementsModal.querySelector('div');
            modalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                achievementsModal.classList.add('hidden');
            }, 300);
        });

        submitGameBeatenNameBtn.addEventListener('click', function() {
            const playerName = gameBeatenPlayerNameInput.value.trim() || "Jogador";
            
            // Adicionar bônus
            score += 500;
            scoreElement.textContent = score;

            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('highScore', highScore);
            }
            
            savePlayerScoreToRanking(playerName, score, currentLevel);
            
            // Limpar músicas jogadas para o gênero atual
            const filteredData = musicData.filter(item => !selectedGenres.includes('all') && selectedGenres.includes(item.genre));
            if (selectedGenres.includes('all')) {
                playedSongIds.clear();
            } else {
                filteredData.forEach(song => playedSongIds.delete(song.id));
            }


            hideGameBeatenModal();
            showFeedback(`Bônus de 500 pontos coletado! Pontuação final de ${playerName} salva!`, 'bg-green-600/70');
            
            // Voltar para a tela de seleção
            hideElement(gameArea, () => showElement(levelSelection));
            hideElement(memoryGameArea, () => showElement(levelSelection));
        });
    }

    function showTurnTransitionModal() {
        nextPlayerName.textContent = 'Jogador 2';
        turnTransitionModal.classList.remove('hidden');
        setTimeout(() => {
            turnTransitionModal.querySelector('div').classList.remove('scale-95', 'opacity-0');
        }, 10);
    }
    
    function showMultiplayerResults() {
        player1FinalScore.textContent = playerScores[1];
        player2FinalScore.textContent = playerScores[2];
    
        let winnerText;
        if (playerScores[1] > playerScores[2]) {
            winnerText = 'Jogador 1 Venceu! 🎉';
            winnerAnnouncement.className = 'text-xl text-center mb-6 p-4 rounded-lg bg-teal-500/20 text-teal-300';
            multiplayerWins++;
        } else if (playerScores[2] > playerScores[1]) {
            winnerText = 'Jogador 2 Venceu! 🎉';
            winnerAnnouncement.className = 'text-xl text-center mb-6 p-4 rounded-lg bg-orange-500/20 text-orange-300';
            multiplayerWins++;
        } else {
            winnerText = 'Empate! 🤝';
            winnerAnnouncement.className = 'text-xl text-center mb-6 p-4 rounded-lg bg-gray-500/20 text-gray-300';
        }
        winnerAnnouncement.textContent = winnerText;
    
        multiplayerResultsModal.classList.remove('hidden');
        setTimeout(() => {
            multiplayerResultsModal.querySelector('div').classList.remove('scale-95', 'opacity-0');
        }, 10);
        
        saveAchievementProgress();
        checkAndUnlockAchievements();
    }

    function shareResult() {
        const scoreToShare = finalScoreElement.textContent;
        const levelToShare = finalLevelElement.textContent;
        const playerName = playerNameInput.value.trim() || "Eu";

        const shareText = `${playerName} fez ${scoreToShare} pontos no nível ${levelToShare} no jogo "Quem Canta Essa?"! Desafie seus amigos para ver quem consegue uma pontuação maior!`;
        const shareUrl = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: 'Olha o meu resultado no Quem Canta Essa?!',
                text: shareText,
                url: shareUrl,
            })
            .then(() => showCustomAlert('Resultado compartilhado com sucesso!'))
            .catch((error) => {
                console.error('Erro ao compartilhar:', error)
                showCustomAlert('Não foi possível compartilhar. Tente novamente.');
            });
        } else {
            const fullText = `${shareText}\nJogue também: ${shareUrl}`;
            navigator.clipboard.writeText(fullText).then(() => {
                showCustomAlert('Resultado copiado para a área de transferência!');
            }).catch(err => {
                console.error('Falha ao copiar o texto: ', err);
                showCustomAlert('Não foi possível copiar o resultado.');
            });
        }
    }

    function toggleGenreFilter(genre) {
        const button = document.querySelector(`[data-genre="${genre}"]`);
        if (genre === 'all') {
            selectedGenres = ['all'];
            document.querySelectorAll('.genre-filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        } else {
            if (selectedGenres.includes('all')) {
                selectedGenres = [];
                document.querySelector('[data-genre="all"]').classList.remove('active');
            }
            if (selectedGenres.includes(genre)) {
                selectedGenres = selectedGenres.filter(g => g !== genre);
                button.classList.remove('active');
            } else {
                selectedGenres.push(genre);
                button.classList.add('active');
            }
            if (selectedGenres.length === 0) {
                selectedGenres = ['all'];
                document.querySelector('[data-genre="all"]').classList.add('active');
            }
        }
    }

    // ===============================================
    // LÓGICA DO JOGO DA MEMÓRIA
    // ===============================================

    function startMemoryGame() {
        hideElement(levelSelection, () => showElement(memoryGameArea));
        resetMemoryGame(false);

        const config = memoryLevelConfig[currentLevel];
        let selectedData;

        if (isMultiplayer && currentPlayer === 2) {
            selectedData = multiplayerGameData;
        } else {
            const filteredData = musicData.filter(item => selectedGenres.includes('all') || selectedGenres.includes(item.genre));
            selectedData = shuffleArray([...filteredData]).slice(0, config.pairs);
            if (isMultiplayer) {
                multiplayerGameData = selectedData;
            }
        }

        if (selectedData.length < config.pairs) {
            showCustomAlert('Não há músicas suficientes para este nível com os filtros selecionados. Tente outros filtros.');
            hideElement(memoryGameArea, () => showElement(levelSelection));
            return;
        }

        memoryCards = [];
        selectedData.forEach(item => {
            memoryCards.push({ type: 'song', value: item.song, pairId: item.id });
            memoryCards.push({ type: 'artist', value: item.artist, pairId: item.id });
        });

        shuffleArray(memoryCards);

        memoryGrid.innerHTML = '';
        let gridClass = 'grid-cols-2 md:grid-cols-4'; // Padrão para fácil e difícil
        if (currentLevel === 'medium') {
            gridClass = 'grid-cols-2 md:grid-cols-6'; // 12 cartas, 2 linhas no mobile, 2 no desktop
        }
        memoryGrid.className = `grid ${gridClass} gap-2 md:gap-4`;

        memoryCards.forEach(cardData => {
            memoryGrid.appendChild(createMemoryCard(cardData));
        });
        
        startMemoryTimer();
    }

    function createMemoryCard(cardData) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.pairId = cardData.pairId;

        card.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-card-back">
                    <i class="fas fa-music text-3xl md:text-4xl"></i>
                </div>
                <div class="memory-card-front">
                    <span class="text-xs text-center md:text-sm p-1">${cardData.value}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => handleCardClick(card));
        return card;
    }

    function handleCardClick(card) {
        if (isChecking || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            updateMoves();
            isChecking = true;
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.pairId === card2.dataset.pairId) {
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedPairs++;
                if (matchedPairs === memoryLevelConfig[currentLevel].pairs) {
                    endMemoryGame();
                }
                flippedCards = [];
                isChecking = false;
            }, 500);
        } else {
            setTimeout(() => {
                unflipCards();
                flippedCards = [];
                isChecking = false;
            }, 1200);
        }
    }

    function unflipCards() {
        flippedCards.forEach(card => card.classList.remove('flipped'));
    }

    function updateMoves() {
        moves++;
        movesCountElement.textContent = moves;
    }

    function startMemoryTimer() {
        stopMemoryTimer();
        memoryTime = 0;
        memoryTimerElement.textContent = memoryTime;
        memoryTimer = setInterval(() => {
            memoryTime++;
            memoryTimerElement.textContent = memoryTime;
        }, 1000);
    }
    
    function stopMemoryTimer() {
        clearInterval(memoryTimer);
    }

    function resetMemoryGame(restart = true) {
        stopMemoryTimer();
        memoryTime = 0;
        moves = 0;
        matchedPairs = 0;
        flippedCards = [];
        isChecking = false;
        memoryGrid.innerHTML = '';
        movesCountElement.textContent = '0';
        memoryTimerElement.textContent = '0';
        hideElement(memoryFeedbackArea);
        if(restart) {
            startMemoryGame();
        }
    }

    function endMemoryGame() {
        stopMemoryTimer();
        const timeBonus = Math.max(0, (memoryLevelConfig[currentLevel].time * 2 - memoryTime) * 5);
        const movePenalty = moves * 10;
        const baseScore = memoryLevelConfig[currentLevel].pairs * 100;
        const finalScore = Math.max(10, baseScore + timeBonus - movePenalty);

        // Verificar se foi um jogo da memória perfeito (sem erros)
        const perfectMemoryGame = moves === memoryLevelConfig[currentLevel].pairs;
        if (perfectMemoryGame && !unlockedAchievements.has('memory_master')) {
            unlockedAchievements.add('memory_master');
            showAchievementNotification(achievements.find(ach => ach.id === 'memory_master'));
        }
    
        if (isMultiplayer) {
            playerScores[currentPlayer] = finalScore;
            scoreElement.textContent = finalScore;
    
            if (currentPlayer === 1) {
                showTurnTransitionModal();
            } else {
                showMultiplayerResults();
            }
        } else {
            score = finalScore;
            scoreElement.textContent = score;
    
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('highScore', highScore);
            }
    
            showMemoryFeedback(`Parabéns! Pontuação: ${finalScore}`, 'bg-green-600/70');
            saveScoreToRanking(score, currentLevel);
        }
    }

    function showMemoryFeedback(text, bgColor) {
        memoryFeedbackText.textContent = text;
        memoryFeedbackArea.className = `text-center py-4 px-6 rounded-lg mb-6 ${bgColor} transform scale-y-100 opacity-100 transition-all duration-300 origin-bottom mt-6`;
        memoryFeedbackArea.classList.remove('hidden');
    }

    function switchGameMode(mode) {
        if (currentGameMode === mode) return;
        currentGameMode = mode;

        if (mode === 'memory') {
            connectModeBtn.classList.remove('active');
            memoryModeBtn.classList.add('active');
            easyLevelText.textContent = `${memoryLevelConfig.easy.pairs * 2} cartas`;
            mediumLevelText.textContent = `${memoryLevelConfig.medium.pairs * 2} cartas`;
            hardLevelText.textContent = `${memoryLevelConfig.hard.pairs * 2} cartas`;
        } else { // connect
            memoryModeBtn.classList.remove('active');
            connectModeBtn.classList.add('active');
            easyLevelText.textContent = `${levelConfig.easy.count} músicas`;
            mediumLevelText.textContent = `${levelConfig.medium.count} músicas`;
            hardLevelText.textContent = `${levelConfig.hard.count} músicas`;
        }
    }

    function displayAchievements() {
        achievementsList.innerHTML = '';
        
        // Adicionar botão de reset no topo
        const resetButton = document.createElement('button');
        resetButton.className = 'w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold mb-6 transition-colors flex items-center justify-center';
        resetButton.innerHTML = '<i class="fas fa-trash-alt mr-2"></i>Resetar Todas as Conquistas';
        resetButton.addEventListener('click', resetAchievements);
        achievementsList.appendChild(resetButton);
        
        // Adicionar as conquistas
        achievements.forEach(ach => {
            const isUnlocked = unlockedAchievements.has(ach.id);
            const card = document.createElement('div');
            card.className = `p-4 rounded-lg flex items-center transition-all duration-300 ${isUnlocked ? 'bg-yellow-500/20 border-l-4 border-yellow-400' : 'bg-gray-700/50 opacity-60'}`;
            
            card.innerHTML = `
                <i class="fas ${ach.icon} fa-3x ${isUnlocked ? 'text-yellow-400' : 'text-gray-500'} mr-4"></i>
                <div class="flex-1">
                    <h4 class="font-bold text-lg ${isUnlocked ? 'text-white' : 'text-gray-400'}">${ach.title}</h4>
                    <p class="text-sm ${isUnlocked ? 'text-gray-300' : 'text-gray-500'}">${ach.description}</p>
                </div>
                ${isUnlocked ? `<button class="reset-single-achievement ml-2 text-red-400 hover:text-red-300 p-2 rounded-full transition-colors" data-achievement="${ach.id}"><i class="fas fa-times"></i></button>` : ''}
            `;
            achievementsList.appendChild(card);
            
            // Adicionar evento para resetar conquista individual
            if (isUnlocked) {
                const resetBtn = card.querySelector('.reset-single-achievement');
                resetBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    resetSingleAchievement(ach.id);
                });
            }
        });
    }

    // Adicione esta função para resetar as conquistas
    function resetAchievements() {
        const confirmModal = document.createElement('div');
        confirmModal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50';
        confirmModal.innerHTML = `
            <div class="bg-gray-800 rounded-xl max-w-md w-full mx-4 p-6 shadow-2xl">
                <h2 class="text-xl font-bold mb-4 text-red-300">Resetar Conquistas</h2>
                <p class="mb-6">Tem certeza que deseja resetar TODAS as suas conquistas? Esta ação não pode ser desfeita e você perderá todo o seu progresso.</p>
                <div class="flex gap-3">
                    <button id="confirmCancelReset" class="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-medium transition-colors">
                        Cancelar
                    </button>
                    <button id="confirmReset" class="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-medium transition-colors">
                        Resetar Tudo
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmModal);
        
        document.getElementById('confirmReset').addEventListener('click', () => {
            // Resetar todas as variáveis de progresso
            unlockedAchievements.clear();
            hardModeStreak = 0;
            gamesPlayed = 0;
            multiplayerWins = 0;
            perfectGames = 0;
            correctlyAnsweredSongIds.clear();
            playedGenres.clear();
            
            // Salvar o estado resetado
            saveAchievementProgress();
            
            // Recarregar a exibição das conquistas
            displayAchievements();
            
            document.body.removeChild(confirmModal);
            showCustomAlert('Todas as conquistas foram resetadas!');
        });
        
        document.getElementById('confirmCancelReset').addEventListener('click', () => {
            document.body.removeChild(confirmModal);
        });
    }

    // Adicione esta função para resetar conquista individual
    function resetSingleAchievement(achievementId) {
        const confirmModal = document.createElement('div');
        confirmModal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50';
        confirmModal.innerHTML = `
            <div class="bg-gray-800 rounded-xl max-w-md w-full mx-4 p-6 shadow-2xl">
                <h2 class="text-xl font-bold mb-4 text-red-300">Resetar Conquista</h2>
                <p class="mb-6">Tem certeza que deseja resetar esta conquista? Você perderá o progresso relacionado a ela.</p>
                <div class="flex gap-3">
                    <button id="confirmCancelSingle" class="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-medium transition-colors">
                        Cancelar
                    </button>
                    <button id="confirmResetSingle" class="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-medium transition-colors">
                        Resetar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmModal);
        
        document.getElementById('confirmResetSingle').addEventListener('click', () => {
            unlockedAchievements.delete(achievementId);
            saveAchievementProgress();
            displayAchievements();
            document.body.removeChild(confirmModal);
            showCustomAlert('Conquista resetada!');
        });
        
        document.getElementById('confirmCancelSingle').addEventListener('click', () => {
            document.body.removeChild(confirmModal);
        });
    }
});
