// The Database Engine
// t1 = Team 1, t2 = Team 2, nextId = where the winner goes next.
const bracketData = {
    mens: [
        { id: 'm_r1_1', round: 'Round of 64', t1: '1 Arizona', t2: '16 Long Island', winner: null, nextId: 'm_r2_1', nextSlot: 't1' },
        { id: 'm_r1_2', round: 'Round of 64', t1: '8 Villanova', t2: '9 Utah St.', winner: null, nextId: 'm_r2_1', nextSlot: 't2' },
        { id: 'm_r2_1', round: 'Round of 32', t1: 'TBD', t2: 'TBD', winner: null, nextId: 'm_r3_1', nextSlot: 't1' },
        // Add the rest of the 63 games here following this pattern
    ],
    womens: [
        { id: 'w_r1_1', round: 'Round of 64', t1: '1 UConn', t2: '16 UTSA', winner: null, nextId: 'w_r2_1', nextSlot: 't1' },
        { id: 'w_r1_2', round: 'Round of 64', t1: '8 Iowa St.', t2: '9 Syracuse', winner: null, nextId: 'w_r2_1', nextSlot: 't2' },
        { id: 'w_r2_1', round: 'Round of 32', t1: 'TBD', t2: 'TBD', winner: null, nextId: 'w_r3_1', nextSlot: 't1' },
        // Add the rest of the 63 games here following this pattern
    ]
};

let currentDivision = 'mens';

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderBracket();
    setupForm();
});

function switchBracket(division) {
    currentDivision = division;
    document.getElementById('btn-mens').classList.remove('active');
    document.getElementById('btn-womens').classList.remove('active');
    document.getElementById(`btn-${division}`).classList.add('active');
    document.getElementById('current-division-title').innerText = division === 'mens' ? "Men's Division Candidates" : "Women's Division Candidates";
    renderBracket();
}

function renderBracket() {
    const container = document.getElementById('bracket-container');
    container.innerHTML = ''; // Clear current

    const games = bracketData[currentDivision];
    
    // Group games by round for display
    const rounds = [...new Set(games.map(g => g.round))];

    rounds.forEach(roundName => {
        const roundDiv = document.createElement('div');
        roundDiv.className = 'round-section';
        roundDiv.innerHTML = `<h3>${roundName}</h3>`;

        const roundGames = games.filter(g => g.round === roundName);
        
        roundGames.forEach(game => {
            const isTBD1 = game.t1 === 'TBD';
            const isTBD2 = game.t2 === 'TBD';
            
            roundDiv.innerHTML += `
                <div class="matchup" id="${game.id}">
                    <div class="team-option ${game.winner === game.t1 ? 'selected' : ''} ${isTBD1 ? 'disabled' : ''}" 
                         onclick="selectWinner('${game.id}', '${game.t1}')">
                        ${game.t1}
                    </div>
                    <span>vs</span>
                    <div class="team-option ${game.winner === game.t2 ? 'selected' : ''} ${isTBD2 ? 'disabled' : ''}" 
                         onclick="selectWinner('${game.id}', '${game.t2}')">
                        ${game.t2}
                    </div>
                </div>
            `;
        });
        container.appendChild(roundDiv);
    });
}

function selectWinner(gameId, winningTeam) {
    if (winningTeam === 'TBD') return;

    const games = bracketData[currentDivision];
    const game = games.find(g => g.id === gameId);
    
    // Update winner
    game.winner = winningTeam;

    // Push winner to the next round
    if (game.nextId) {
        const nextGame = games.find(g => g.id === game.nextId);
        if (nextGame) {
            nextGame[game.nextSlot] = winningTeam;
            // If the next game already had a winner, we need to reset it because the matchup changed
            nextGame.winner = null; 
        }
    }
    
    renderBracket();
}

// PDF Generation using html2pdf
function downloadPDF() {
    const element = document.getElementById('pdf-content');
    const opt = {
        margin:       0.5,
        filename:     `TPS_Report_${currentDivision}_2026.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

// Form Submission to Google Sheets
function setupForm() {
    const form = document.getElementById('tps-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('submit-btn');
        btn.textContent = "Processing...";
        btn.disabled = true;

        // Flatten data to send to Google Sheets
        const payload = {
            name: document.getElementById('username').value,
            email: document.getElementById('email').value,
            division: currentDivision
        };

        // Add all winners to payload
        bracketData[currentDivision].forEach(game => {
            payload[game.id] = game.winner || "No Pick";
        });

        // YOUR GOOGLE SCRIPT URL GOES HERE
        const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE'; 

        fetch(scriptURL, { 
            method: 'POST', 
            body: JSON.stringify(payload),
            headers: { "Content-Type": "text/plain;charset=utf-8" },
        })
        .then(() => {
            document.querySelector('.user-info').style.display = 'none';
            document.getElementById('success-message').style.display = 'block';
            window.scrollTo(0, document.body.scrollHeight);
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert("Network Error. Please try again.");
            btn.textContent = "Submit to Management";
            btn.disabled = false;
        });
    });
}// JavaScript Document