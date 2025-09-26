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

    // Elementos do Jogo da Memória
    const memoryGameArea = document.getElementById('memoryGameArea');
    const memoryGrid = document.getElementById('memoryGrid');
    const backToLevelsFromMemory = document.getElementById('backToLevelsFromMemory');
    const memoryTimerElement = document.getElementById('memoryTimer');
    const movesCountElement = document.getElementById('movesCount');
    const resetMemoryGameBtn = document.getElementById('resetMemoryGame');
    const memoryFeedbackArea = document.getElementById('memoryFeedbackArea');
    const memoryFeedbackText = document.getElementById('memoryFeedbackText');


    // Estado do Jogo
    let currentGameMode = 'connect'; // 'connect' ou 'memory'
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

    // Dados das músicas (você pode adicionar depois)
    const musicData = [
        {id: 1, song: "Diva", artist: "Beyoncé", genre: "Pop", preview: ""},
        {id: 2, song: "Shape of You", artist: "Ed Sheeran", genre: "Pop", preview: ""},
        {id: 3, song: "Bad Guy", artist: "Billie Eilish", genre: "Pop", preview: ""},
        {id: 4, song: "Levitating", artist: "Dua Lipa", genre: "Pop", preview: ""},
        {id: 5, song: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", genre: "Pop", preview: ""},
        {id: 6, song: "Rolling in the Deep", artist: "Adele", genre: "Pop", preview: ""},
        {id: 7, song: "Shallow", artist: "Lady Gaga & Bradley Cooper", genre: "Pop", preview: ""},
        {id: 8, song: "Don't Start Now", artist: "Dua Lipa", genre: "Pop", preview: ""},
        {id: 9, song: "Baby One More Time", artist: "Britney Spears", genre: "Pop", preview: ""},
        {id: 10, song: "Dance Monkey", artist: "Tones and I", genre: "Pop", preview: ""},
        {id: 11, song: "Believer", artist: "Imagine Dragons", genre: "Pop", preview: ""},
        {id: 12, song: "Smooth Criminal", artist: "Michael Jackson", genre: "Pop", preview: ""},
        {id: 13, song: "The Winner Takes It All", artist: "ABBA", genre: "Pop", preview: ""},
        {id: 14, song: "Havana", artist: "Camila Cabello", genre: "Pop", preview: ""},
        {id: 15, song: "Senorita", artist: "Shawn Mendes & Camila Cabello", genre: "Pop", preview: ""},
        {id: 16, song: "Someone Like You", artist: "Adele", genre: "Pop", preview: ""},
        {id: 17, song: "Poker Face", artist: "Lady Gaga", genre: "Pop", preview: ""},
        {id: 18, song: "Happy", artist: "Pharrell Williams", genre: "Pop", preview: ""},
        {id: 19, song: "Firework", artist: "Katy Perry", genre: "Pop", preview: ""},
        {id: 20, song: "Call Me Maybe", artist: "Carly Rae Jepsen", genre: "Pop", preview: ""},
        {id: 21, song: "Royals", artist: "Lorde", genre: "Pop", preview: ""},
        {id: 22, song: "Toxic", artist: "Britney Spears", genre: "Pop", preview: ""},
        {id: 23, song: "Shake It Off", artist: "Taylor Swift", genre: "Pop", preview: ""},
        {id: 24, song: "Bad Romance", artist: "Lady Gaga", genre: "Pop", preview: ""},
        {id: 25, song: "Clocks", artist: "Coldplay", genre: "Pop", preview: ""},

        {id: 26, song: "Bohemian Rhapsody", artist: "Queen", genre: "Rock", preview: ""},
        {id: 27, song: "Smells Like Teen Spirit", artist: "Nirvana", genre: "Rock", preview: ""},
        {id: 28, song: "Hotel California", artist: "Eagles", genre: "Rock", preview: ""},
        {id: 29, song: "Sweet Child O'Mine", artist: "Guns N' Roses", genre: "Rock", preview: ""},
        {id: 30, song: "Wonderwall", artist: "Oasis", genre: "Rock", preview: ""},
        {id: 31, song: "Californication", artist: "Red Hot Chili Peppers", genre: "Rock", preview: ""},
        {id: 32, song: "Yellow", artist: "Coldplay", genre: "Rock", preview: ""},
        {id: 33, song: "In the End", artist: "Linkin Park", genre: "Rock", preview: ""},
        {id: 34, song: "Thunderstruck", artist: "AC/DC", genre: "Rock", preview: ""},
        {id: 35, song: "Livin' on a Prayer", artist: "Bon Jovi", genre: "Rock", preview: ""},
        {id: 36, song: "Highway to Hell", artist: "AC/DC", genre: "Rock", preview: ""},
        {id: 37, song: "Eye of the Tiger", artist: "Survivor", genre: "Rock", preview: ""},
        {id: 38, song: "Paint It Black", artist: "The Rolling Stones", genre: "Rock", preview: ""},
        {id: 39, song: "Enter Sandman", artist: "Metallica", genre: "Rock", preview: ""},
        {id: 40, song: "Back In Black", artist: "AC/DC", genre: "Rock", preview: ""},
        {id: 41, song: "Sweet Home Alabama", artist: "Lynyrd Skynyrd", genre: "Rock", preview: ""},
        {id: 42, song: "Paranoid", artist: "Black Sabbath", genre: "Rock", preview: ""},
        {id: 43, song: "Smoke on the Water", artist: "Deep Purple", genre: "Rock", preview: ""},
        {id: 44, song: "Nothing Else Matters", artist: "Metallica", genre: "Rock", preview: ""},
        {id: 45, song: "Dream On", artist: "Aerosmith", genre: "Rock", preview: ""},
        {id: 46, song: "November Rain", artist: "Guns N' Roses", genre: "Rock", preview: ""},
        {id: 47, song: "Whole Lotta Love", artist: "Led Zeppelin", genre: "Rock", preview: ""},
        {id: 48, song: "Stairway to Heaven", artist: "Led Zeppelin", genre: "Rock", preview: ""},
        {id: 49, song: "Come Together", artist: "The Beatles", genre: "Rock", preview: ""},
        {id: 50, song: "Another Brick in the Wall", artist: "Pink Floyd", genre: "Rock", preview: ""},
        
	    {id: 51, song: "Lose Yourself", artist: "Eminem", genre: "Hip Hop", preview: ""},
        {id: 52, song: "Sicko Mode", artist: "Travis Scott", genre: "Hip Hop", preview: ""},
        {id: 53, song: "HUMBLE.", artist: "Kendrick Lamar", genre: "Hip Hop", preview: ""},
        {id: 54, song: "God's Plan", artist: "Drake", genre: "Hip Hop", preview: ""},
        {id: 55, song: "Old Town Road", artist: "Lil Nas X", genre: "Hip Hop", preview: ""},
        {id: 56, song: "In Da Club", artist: "50 Cent", genre: "Hip Hop", preview: ""},
        {id: 57, song: "Juicy", artist: "Notorious B.I.G.", genre: "Hip Hop", preview: ""},
        {id: 58, song: "N.Y. State of Mind", artist: "Nas", genre: "Hip Hop", preview: ""},
        {id: 59, song: "Empire State of Mind", artist: "Jay-Z ft. Alicia Keys", genre: "Hip Hop", preview: ""},
        {id: 60, song: "Hotline Bling", artist: "Drake", genre: "Hip Hop", preview: ""},
        {id: 61, song: "California Love", artist: "2Pac ft. Dr. Dre", genre: "Hip Hop", preview: ""},
        {id: 62, song: "Mo Money Mo Problems", artist: "Notorious B.I.G.", genre: "Hip Hop", preview: ""},
        {id: 63, song: "All of the Lights", artist: "Kanye West", genre: "Hip Hop", preview: ""},
        {id: 64, song: "Lose Control", artist: "Missy Elliott", genre: "Hip Hop", preview: ""},
        {id: 65, song: "Rockstar", artist: "Post Malone", genre: "Hip Hop", preview: ""},
        {id: 66, song: "Mask Off", artist: "Future", genre: "Hip Hop", preview: ""},
        {id: 67, song: "Suge", artist: "DaBaby", genre: "Hip Hop", preview: ""},
        {id: 68, song: "Money Trees", artist: "Kendrick Lamar", genre: "Hip Hop", preview: ""},
        {id: 69, song: "Work It", artist: "Missy Elliott", genre: "Hip Hop", preview: ""},
        {id: 70, song: "Ruff Ryders' Anthem", artist: "DMX", genre: "Hip Hop", preview: ""},
        {id: 71, song: "XO TOUR Llif3", artist: "Lil Uzi Vert", genre: "Hip Hop", preview: ""},
        {id: 72, song: "Lucid Dreams", artist: "Juice WRLD", genre: "Hip Hop", preview: ""},
        {id: 73, song: "Hustlin'", artist: "Rick Ross", genre: "Hip Hop", preview: ""},
        {id: 74, song: "Goosebumps", artist: "Travis Scott", genre: "Hip Hop", preview: ""},
        {id: 75, song: "Bodak Yellow", artist: "Cardi B", genre: "Hip Hop", preview: ""},

        {id: 76, song: "Evidências", artist: "Chitãozinho & Xororó", genre: "Sertanejo", preview: ""},
        {id: 77, song: "Fio de Cabelo", artist: "Chico Rey & Paraná", genre: "Sertanejo", preview: ""},
        {id: 78, song: "Ai Se Eu Te Pego", artist: "Michel Teló", genre: "Sertanejo", preview: ""},
        {id: 79, song: "Amei Te Ver", artist: "Tiago Iorc", genre: "Sertanejo", preview: ""},
        {id: 80, song: "Largado às Traças", artist: "Zé Neto & Cristiano", genre: "Sertanejo", preview: ""},
        {id: 81, song: "Camaro Amarelo", artist: "Munhoz & Mariano", genre: "Sertanejo", preview: ""},
        {id: 82, song: "Que Sorte a Nossa", artist: "Matheus & Kauan", genre: "Sertanejo", preview: ""},
        {id: 83, song: "Propaganda", artist: "Jorge & Mateus", genre: "Sertanejo", preview: ""},
        {id: 84, song: "Vidinha de Balada", artist: "Henrique & Juliano", genre: "Sertanejo", preview: ""},
        {id: 85, song: "Te Amo Cada Vez Mais", artist: "Victor & Leo", genre: "Sertanejo", preview: ""},
        {id: 86, song: "Maus Bocados", artist: "Marcos & Belutti", genre: "Sertanejo", preview: ""},
        {id: 87, song: "Sosseguei", artist: "Michel Teló", genre: "Sertanejo", preview: ""},
        {id: 88, song: "Deixa Acontecer", artist: "Mau & Ricky", genre: "Sertanejo", preview: ""},
        {id: 89, song: "Na Hora da Raiva", artist: "Gusttavo Lima", genre: "Sertanejo", preview: ""},
        {id: 90, song: "Pense em Mim", artist: "Leandro & Leonardo", genre: "Sertanejo", preview: ""},
        {id: 91, song: "Ciumeira", artist: "Marília Mendonça", genre: "Sertanejo", preview: ""},
        {id: 92, song: "Infiel", artist: "Marília Mendonça", genre: "Sertanejo", preview: ""},
        {id: 93, song: "Cheirosa", artist: "Gusttavo Lima", genre: "Sertanejo", preview: ""},
        {id: 94, song: "Loucura", artist: "Jads & Jadson", genre: "Sertanejo", preview: ""},
        {id: 95, song: "Atrasadinha", artist: "Felipe Araújo & Ferrugem", genre: "Sertanejo", preview: ""},
        {id: 96, song: "Zé da Recaída", artist: "Gusttavo Lima", genre: "Sertanejo", preview: ""},
        {id: 97, song: "Te Assumi pro Brasil", artist: "Matheus & Kauan", genre: "Sertanejo", preview: ""},
        {id: 98, song: "Amor Falso", artist: "Aldair Playboy", genre: "Sertanejo", preview: ""},
        {id: 99, song: "Lindo Não É", artist: "Henrique & Juliano", genre: "Sertanejo", preview: ""},
        {id: 100, song: "Vidinha", artist: "Zezé Di Camargo & Luciano", genre: "Sertanejo", preview: ""},

        {id: 101, song: "Wake Me Up", artist: "Avicii", genre: "Eletrônica", preview: ""},
        {id: 102, song: "Animals", artist: "Martin Garrix", genre: "Eletrônica", preview: ""},
        {id: 103, song: "Titanium", artist: "David Guetta ft. Sia", genre: "Eletrônica", preview: ""},
        {id: 104, song: "Lean On", artist: "Major Lazer & DJ Snake", genre: "Eletrônica", preview: ""},
        {id: 105, song: "Closer", artist: "The Chainsmokers", genre: "Eletrônica", preview: ""},
        {id: 106, song: "Faded", artist: "Alan Walker", genre: "Eletrônica", preview: ""},
        {id: 107, song: "Don't You Worry Child", artist: "Swedish House Mafia", genre: "Eletrônica", preview: ""},
        {id: 108, song: "Spectrum", artist: "Zedd ft. Matthew Koma", genre: "Eletrônica", preview: ""},
        {id: 109, song: "Heroes (We Could Be)", artist: "Alesso ft. Tove Lo", genre: "Eletrônica", preview: ""},
        {id: 110, song: "Waiting For Love", artist: "Avicii", genre: "Eletrônica", preview: ""},
        {id: 111, song: "Calling (Lose My Mind)", artist: "Sebastian Ingrosso & Alesso", genre: "Eletrônica", preview: ""},
        {id: 112, song: "Reload", artist: "Sebastian Ingrosso & Tommy Trash", genre: "Eletrônica", preview: ""},
        {id: 113, song: "This Is What It Feels Like", artist: "Armin van Buuren", genre: "Eletrônica", preview: ""},
        {id: 114, song: "Turn Up the Speakers", artist: "Afrojack & Martin Garrix", genre: "Eletrônica", preview: ""},
        {id: 115, song: "Cannonball", artist: "Showtek & Justin Prime", genre: "Eletrônica", preview: ""},
        {id: 116, song: "Tsunami", artist: "DVBBS & Borgeous", genre: "Eletrônica", preview: ""},
        {id: 117, song: "Booyah", artist: "Showtek", genre: "Eletrônica", preview: ""},
        {id: 118, song: "Ping Pong", artist: "Armin van Buuren", genre: "Eletrônica", preview: ""},
        {id: 119, song: "Gold Skies", artist: "Martin Garrix", genre: "Eletrônica", preview: ""},
        {id: 120, song: "Spectrum", artist: "Zedd ft. Matthew Koma", genre: "Eletrônica", preview: ""},
        {id: 121, song: "Sweet Nothing", artist: "Calvin Harris ft. Florence Welch", genre: "Eletrônica", preview: ""},
        {id: 122, song: "Feel So Close", artist: "Calvin Harris", genre: "Eletrônica", preview: ""},
        {id: 123, song: "Reload", artist: "Sebastian Ingrosso & Tommy Trash", genre: "Eletrônica", preview: ""},
        {id: 124, song: "Greyhound", artist: "Swedish House Mafia", genre: "Eletrônica", preview: ""},
        {id: 125, song: "Adagio for Strings", artist: "Tiesto", genre: "Eletrônica", preview: ""},

        {id: 126, song: "Águas de Março", artist: "Tom Jobim & Elis Regina", genre: "MPB", preview: ""},
        {id: 127, song: "Garota de Ipanema", artist: "Tom Jobim & Vinícius de Moraes", genre: "MPB", preview: ""},
        {id: 128, song: "Tocando em Frente", artist: "Almir Sater", genre: "MPB", preview: ""},
        {id: 129, song: "O Leãozinho", artist: "Caetano Veloso", genre: "MPB", preview: ""},
        {id: 130, song: "Por Onde Andei", artist: "Nando Reis", genre: "MPB", preview: ""},
        {id: 131, song: "Homem Com H", artist: "Ney Matogrosso", genre: "MPB", preview: ""},
        {id: 132, song: "Romaria", artist: "Renato Teixeira", genre: "MPB", preview: ""},
        {id: 133, song: "Construção", artist: "Chico Buarque", genre: "MPB", preview: ""},
        {id: 134, song: "Apesar de Você", artist: "Chico Buarque", genre: "MPB", preview: ""},
        {id: 135, song: "Do Seu Lado", artist: "Jota Quest", genre: "MPB", preview: ""},
        {id: 136, song: "Travessia", artist: "Milton Nascimento", genre: "MPB", preview: ""},
        {id: 137, song: "Naquela Estação", artist: "Marisa Monte", genre: "MPB", preview: ""},
        {id: 138, song: "Ainda Bem", artist: "Marisa Monte", genre: "MPB", preview: ""},
        {id: 139, song: "É Você", artist: "Tribalistas", genre: "MPB", preview: ""},
        {id: 140, song: "Já Sei Namorar", artist: "Tribalistas", genre: "MPB", preview: ""},
        {id: 141, song: "Você é Linda", artist: "Caetano Veloso", genre: "MPB", preview: ""},
        {id: 142, song: "Coração Vagabundo", artist: "Caetano Veloso", genre: "MPB", preview: ""},
        {id: 143, song: "Palavras no Corpo", artist: "Gal Costa", genre: "MPB", preview: ""},
        {id: 144, song: "Meu Nome é Gal", artist: "Gal Costa", genre: "MPB", preview: ""},
        {id: 145, song: "Feliz, Alegre e Forte", artist: "Marisa Monte", genre: "MPB", preview: ""},
        {id: 146, song: "Asa Branca", artist: "Luiz Gonzaga", genre: "MPB", preview: ""},
        {id: 147, song: "Xote das Meninas", artist: "Luiz Gonzaga", genre: "MPB", preview: ""},
        {id: 148, song: "Não Deixe O Samba Morrer", artist: "Alcione", genre: "MPB", preview: ""},
        {id: 149, song: "Tiro Ao Álvaro", artist: "Elis Regina", genre: "MPB", preview: ""},
        {id: 150, song: "Ainda Gosto Dela", artist: "Skank", genre: "MPB", preview: ""},

        {id: 151, song: "Blame It", artist: "Jamie Foxx ft. T-Pain", genre: "R&B", preview: ""},
        {id: 152, song: "We Belong Together", artist: "Mariah Carey", genre: "R&B", preview: ""},
        {id: 153, song: "No Scrubs", artist: "TLC", genre: "R&B", preview: ""},
        {id: 154, song: "Ignition (Remix)", artist: "R. Kelly", genre: "R&B", preview: ""},
        {id: 155, song: "Adorn", artist: "Miguel", genre: "R&B", preview: ""},
        {id: 156, song: "Earned It", artist: "The Weeknd", genre: "R&B", preview: ""},
        {id: 157, song: "Confessions Part II", artist: "Usher", genre: "R&B", preview: ""},
        {id: 158, song: "Love on Top", artist: "Beyoncé", genre: "R&B", preview: ""},
        {id: 159, song: "Dilemma", artist: "Nelly ft. Kelly Rowland", genre: "R&B", preview: ""},
        {id: 160, song: "Pony", artist: "Ginuwine", genre: "R&B", preview: ""},
        {id: 161, song: "That's What I Like", artist: "Bruno Mars", genre: "R&B", preview: ""},
        {id: 162, song: "Finesse", artist: "Bruno Mars ft. Cardi B", genre: "R&B", preview: ""},
        {id: 163, song: "Can We Talk", artist: "Tevin Campbell", genre: "R&B", preview: ""},
        {id: 164, song: "Back at One", artist: "Brian McKnight", genre: "R&B", preview: ""},
        {id: 165, song: "If I Ain't Got You", artist: "Alicia Keys", genre: "R&B", preview: ""},
        {id: 166, song: "No One", artist: "Alicia Keys", genre: "R&B", preview: ""},
        {id: 167, song: "Say My Name", artist: "Destiny's Child", genre: "R&B", preview: ""},
        {id: 168, song: "Rock with You", artist: "Michael Jackson", genre: "R&B", preview: ""},
        {id: 169, song: "Can't Help But Wait", artist: "Trey Songz", genre: "R&B", preview: ""},
        {id: 170, song: "We Found Love", artist: "Rihanna ft. Calvin Harris", genre: "R&B", preview: ""},
        {id: 171, song: "Umbrella", artist: "Rihanna ft. Jay-Z", genre: "R&B", preview: ""},
        {id: 172, song: "Boo'd Up", artist: "Ella Mai", genre: "R&B", preview: ""},
        {id: 173, song: "Say So", artist: "Doja Cat", genre: "R&B", preview: ""},
        {id: 174, song: "Best Part", artist: "Daniel Caesar ft. H.E.R.", genre: "R&B", preview: ""},
        {id: 175, song: "Blinding Lights", artist: "The Weeknd", genre: "R&B", preview: ""},

        {id: 176, song: "No Woman No Cry", artist: "Bob Marley", genre: "Reggae", preview: ""},
        {id: 177, song: "One Love", artist: "Bob Marley", genre: "Reggae", preview: ""},
        {id: 178, song: "Red Red Wine", artist: "UB40", genre: "Reggae", preview: ""},
        {id: 179, song: "Sweat (A La La La La Long)", artist: "Inner Circle", genre: "Reggae", preview: ""},
        {id: 180, song: "Bad Boys", artist: "Inner Circle", genre: "Reggae", preview: ""},
        {id: 181, song: "Could You Be Loved", artist: "Bob Marley", genre: "Reggae", preview: ""},
        {id: 182, song: "Three Little Birds", artist: "Bob Marley", genre: "Reggae", preview: ""},
        {id: 183, song: "I Can See Clearly Now", artist: "Johnny Nash", genre: "Reggae", preview: ""},
        {id: 184, song: "King Without A Crown", artist: "Matisyahu", genre: "Reggae", preview: ""},
        {id: 185, song: "Welcome to Jamrock", artist: "Damian Marley", genre: "Reggae", preview: ""},
        {id: 186, song: "It Wasn't Me", artist: "Shaggy ft. RikRok", genre: "Reggae", preview: ""},
        {id: 187, song: "Angel", artist: "Shaggy", genre: "Reggae", preview: ""},
        {id: 188, song: "Electric Avenue", artist: "Eddy Grant", genre: "Reggae", preview: ""},
        {id: 189, song: "Stir It Up", artist: "Bob Marley", genre: "Reggae", preview: ""},
        {id: 190, song: "Get Up, Stand Up", artist: "Bob Marley", genre: "Reggae", preview: ""},
        {id: 191, song: "Buffalo Soldier", artist: "Bob Marley", genre: "Reggae", preview: ""},
        {id: 192, song: "Could You Be Loved", artist: "Bob Marley", genre: "Reggae", preview: ""},
        {id: 193, song: "Jamming", artist: "Bob Marley", genre: "Reggae", preview: ""},
        {id: 194, song: "Exodus", artist: "Bob Marley", genre: "Reggae", preview: ""},
        {id: 195, song: "Iron Lion Zion", artist: "Bob Marley", genre: "Reggae", preview: ""},
        {id: 196, song: "Turn Your Lights Down Low", artist: "Bob Marley", genre: "Reggae", preview: ""},
        {id: 197, song: "One Drop", artist: "Bob Marley", genre: "Reggae", preview: ""},
        {id: 198, song: "Rivers of Babylon", artist: "Boney M.", genre: "Reggae", preview: ""},
        {id: 199, song: "Waiting in Vain", artist: "Bob Marley", genre: "Reggae", preview: ""},
        {id: 200, song: "Natural Mystic", artist: "Bob Marley", genre: "Reggae", preview: ""},

        {id: 201, song: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", genre: "Latino", preview: ""},
        {id: 202, song: "Bailando", artist: "Enrique Iglesias", genre: "Latino", preview: ""},
        {id: 203, song: "Vivir Mi Vida", artist: "Marc Anthony", genre: "Latino", preview: ""},
        {id: 204, song: "Danza Kuduro", artist: "Don Omar", genre: "Latino", preview: ""},
        {id: 205, song: "La Bicicleta", artist: "Shakira & Carlos Vives", genre: "Latino", preview: ""},
        {id: 206, song: "Mi Gente", artist: "J Balvin & Willy William", genre: "Latino", preview: ""},
        {id: 207, song: "Felices los 4", artist: "Maluma", genre: "Latino", preview: ""},
        {id: 208, song: "Hips Don't Lie", artist: "Shakira ft. Wyclef Jean", genre: "Latino", preview: ""},
        {id: 209, song: "DeBÍ TiRAR MáS FOToS", artist: "Bad Bunny", genre: "Latino", preview: ""},
        {id: 210, song: "Chantaje", artist: "Shakira ft. Maluma", genre: "Latino", preview: ""},
        {id: 211, song: "Súbeme la Radio", artist: "Enrique Iglesias", genre: "Latino", preview: ""},
        {id: 212, song: "El Perdón", artist: "Nicky Jam & Enrique Iglesias", genre: "Latino", preview: ""},
        {id: 213, song: "Vente Pa' Ca", artist: "Ricky Martin ft. Maluma", genre: "Latino", preview: ""},
        {id: 214, song: "Me Enamora", artist: "Juanes", genre: "Latino", preview: ""},
        {id: 215, song: "La Tortura", artist: "Shakira ft. Alejandro Sanz", genre: "Latino", preview: ""},
        {id: 216, song: "Quando Me Enamoro", artist: "Juan Luis Guerra & Prince Royce", genre: "Latino", preview: ""},
        {id: 217, song: "Corazón", artist: "Maluma ft. Nego do Borel", genre: "Latino", preview: ""},
        {id: 218, song: "Te Boté", artist: "Nio García, Casper Mágico, Darell", genre: "Latino", preview: ""},
        {id: 219, song: "Duele el Corazón", artist: "Enrique Iglesias ft. Wisin", genre: "Latino", preview: ""},
        {id: 220, song: "Taki Taki", artist: "DJ Snake ft. Selena Gomez, Ozuna & Cardi B", genre: "Latino", preview: ""},
        {id: 221, song: "Borro Cassette", artist: "Maluma", genre: "Latino", preview: ""},
        {id: 222, song: "Safari", artist: "J Balvin ft. Pharrell Williams", genre: "Latino", preview: ""},
        {id: 223, song: "Me Gusta", artist: "Anitta ft. Cardi B & Myke Towers", genre: "Latino", preview: ""},
        {id: 224, song: "Criminal", artist: "Natti Natasha & Ozuna", genre: "Latino", preview: ""},
        {id: 225, song: "Reggaetón Lento", artist: "CNCO", genre: "Latino", preview: ""},

        {id: 226, song: "Defying Gravity", artist: "Wicked Cast", genre: "Musicais", preview: ""},
        {id: 227, song: "Lady Marmalade", artist: "Moulin Rouge Cast", genre: "Musicais", preview: ""},
        {id: 228, song: "From Now On", artist: "The Greatest Showman Cast", genre: "Musicais", preview: ""},
        {id: 229, song: "Seasons of Love", artist: "Rent Cast", genre: "Musicais", preview: ""},
        {id: 230, song: "All That Jazz", artist: "Chicago Cast", genre: "Musicais", preview: ""},
        {id: 231, song: "Hopelessly Devoted To You", artist: "Grease Cast", genre: "Musicais", preview: ""},
        {id: 232, song: "City Of Stars", artist: "La La Land Cast", genre: "Musicais", preview: ""},
        {id: 233, song: "Tomorrow", artist: "Annie Cast", genre: "Musicais", preview: ""},
        {id: 234, song: "I Dreamed a Dream", artist: "Les Misérables Cast", genre: "Musicais", preview: ""},
        {id: 235, song: "Supercalifragilisticexpialidocious", artist: "Mary Poppins Cast", genre: "Musicais", preview: ""},
        {id: 236, song: "Does Your Mother Know", artist: "Mamma Mia Cast", genre: "Musicais", preview: ""},
        {id: 237, song: "Say My Name", artist: "Beetlejuice Cast", genre: "Musicais", preview: ""},
        {id: 238, song: "Popular", artist: "Wicked Cast", genre: "Musicais", preview: ""},
        {id: 239, song: "Good Morning Baltimore", artist: "Hairspray Cast", genre: "Musicais", preview: ""},
        {id: 240, song: "Santa Fe", artist: "Newsies Cast", genre: "Musicais", preview: ""},
        {id: 241, song: "Seventeen", artist: "Heathers Cast", genre: "Musicais", preview: ""},
        {id: 242, song: "Somewhere", artist: "West Side Story Cast", genre: "Musicais", preview: ""},
        {id: 243, song: "Revolting Children", artist: "Matilda Cast", genre: "Musicais", preview: ""},
        {id: 244, song: "I'm Not That Girl", artist: "Wicked Cast", genre: "Musicais", preview: ""},
        {id: 245, song: "For Good", artist: "Wicked Cast", genre: "Musicais", preview: ""},
        {id: 246, song: "The Room Where It Happens", artist: "Hamilton Cast", genre: "Musicais", preview: ""},
        {id: 247, song: "There! Right There!", artist: "Legally Blonde Cast", genre: "Musicais", preview: ""},
        {id: 248, song: "Waving Through A Window", artist: "Dear Evan Hansen Cast", genre: "Musicais", preview: ""},
        {id: 249, song: "Agony", artist: "Into The Woods Cast", genre: "Musicais", preview: ""},
        {id: 250, song: "No One Is Alone", artist: "Into The Woods Cast", genre: "Musicais", preview: ""},

      	{id: 251, song: "Ciclo Sem Fim", artist: "O Rei Leão", genre: "Disney", preview: ""},
        {id: 252, song: "Vejo Enfim A Luz Brihar", artist: "Enrolados", genre: "Disney", preview: ""},
        {id: 253, song: "Um Mundo Ideal", artist: "Aladdin", genre: "Disney", preview: ""},
        {id: 254, song: "O Céu Eu Vou Tocar", artist: "Valente", genre: "Disney", preview: ""},
        {id: 255, song: "Aqui No Mar", artist: "A Pequena Sereia", genre: "Disney", preview: ""},
        {id: 256, song: "Quase Lá", artist: "A Princesa e o Sapo", genre: "Disney", preview: ""},
        {id: 257, song: "Space Between", artist: "Descendentes 2", genre: "Disney", preview: ""},
        {id: 258, song: "Did I Mention", artist: "Descendentes", genre: "Disney", preview: ""},
        {id: 259, song: "Se Encontrar", artist: "Frozen 2", genre: "Disney", preview: ""},
        {id: 260, song: "Sentimentos São", artist: "A Bela e a Fera", genre: "Disney", preview: ""},
        {id: 261, song: "Homem Ser", artist: "Mulan", genre: "Disney", preview: ""},
        {id: 262, song: "No Meu Coração Você Vai Sempre Estar", artist: "Tarzan", genre: "Disney", preview: ""},
        {id: 263, song: "Por Uma Vez Na Eternidade", artist: "Frozen", genre: "Disney", preview: ""},
        {id: 264, song: "Como Ela Sabe Que A Ama", artist: "Encantada", genre: "Disney", preview: ""},
        {id: 265, song: "Seu Lugar", artist: "Moana", genre: "Disney", preview: ""},
        {id: 266, song: "Não Falamos Do Bruno", artist: "Encanto", genre: "Disney", preview: ""},
        {id: 267, song: "This Is Me", artist: "Camp Rock", genre: "Disney", preview: ""},
        {id: 268, song: "A Divisão", artist: "Tinker Bell", genre: "Disney", preview: ""},
        {id: 269, song: "Era Uma Vez No Sonho", artist: "A Bela Adormecida", genre: "Disney", preview: ""},
        {id: 270, song: "Lembre De Mim", artist: "Viva - A Vida É Uma Festa", genre: "Disney", preview: ""},
        {id: 271, song: "Sua Mãe Sabe Mais", artist: "Enrolados", genre: "Disney", preview: ""},
        {id: 272, song: "De Zero a Herói", artist: "Hércules", genre: "Disney", preview: ""},
        {id: 273, song: "Amigos Do Outro Lado", artist: "A Princesa e o Sapo", genre: "Disney", preview: ""},
        {id: 274, song: "Se Preparem", artist: "O Rei Leão", genre: "Disney", preview: ""},
        {id: 275, song: "Dos Oruguitas", artist: "Encanto", genre: "Disney", preview: ""},
    ];

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

    // Inicialização
    initGame();

    function initGame() {
        highScoreElement.textContent = highScore;
        const allGenres = [...new Set(musicData.map(item => item.genre))];
        createGenreFilters(allGenres);
        setupEventListeners();
        resetGame();
        
        // Definir o nível inicial como "Fácil" nos displays
        updateLevelDisplay();
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

    function startNewGame() {
        resetGame();
        hideElement(levelSelection, () => showElement(gameArea));
        hideElement(rankingArea);

        // Atualizar o display do nível antes de iniciar o jogo
        updateLevelDisplay();

        const filteredData = musicData.filter(item => selectedGenres.includes('all') || selectedGenres.includes(item.genre));
        const selectedData = shuffleArray([...filteredData]).slice(0, levelConfig[currentLevel].count);
        if (selectedData.length === 0) {
            showCustomAlert('Nenhuma música encontrada para os gêneros selecionados. Por favor, escolha outros gêneros.');
            showElement(levelSelection);
            hideElement(gameArea);
            return;
        }

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
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }
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
        resetMemoryGame(false); // Não reiniciar o jogo ao iniciar

        const config = memoryLevelConfig[currentLevel];
        const filteredData = musicData.filter(item => selectedGenres.includes('all') || selectedGenres.includes(item.genre));
        const selectedData = shuffleArray([...filteredData]).slice(0, config.pairs);
        
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
        let gridClass = config.grid;
        if (currentLevel === 'medium') gridClass = 'grid-cols-4 md:grid-cols-6';
        if (currentLevel === 'hard') gridClass = 'grid-cols-4';
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
});
