// 1. THE TEAM LISTS (Your only homework is filling these in!)
// List the 64 teams in bracket matchup order (1 vs 16, 8 vs 9, 5 vs 12, etc.)

const mensTeams = [
    // Region 1 (East)
    "1 Duke", "16 Siena", "8 Ohio St.", "9 TCU", 
    "5 St. John's", "12 Northern Iowa", "4 Kansas", "13 Cal Baptist",
    "6 Louisville", "11 South Florida", "3 Michigan St.", "14 North Dakota St.", 
    "7 UCLA", "10 UCF", "2 UConn", "15 Furman",
    
    // Region 2 (South)
    "1 Florida", "16 Lehigh/PVAMU", "8 Clemson", "9 Iowa", 
    "5 Vanderbilt", "12 McNeese", "4 Nebraska", "13 Troy",
    "6 North Carolina", "11 VCU", "3 Illinois", "14 Penn", 
    "7 Saint Mary's", "10 Texas A&M", "2 Houston", "15 Idaho",
    
    // Region 3 (West)
    "1 Arizona", "16 Long Island", "8 Villanova", "9 Utah St.", 
    "5 Wisconsin", "12 High Point", "4 Arkansas", "13 Hawaii",
    "6 BYU", "11 NC State/Texas", "3 Gonzaga", "14 Kennesaw St.", 
    "7 Miami (FL)", "10 Missouri", "2 Purdue", "15 Queens (N.C.)",
    
    // Region 4 (Midwest)
    "1 Michigan", "16 Howard/UMBC", "8 Georgia", "9 Saint Louis", 
    "5 Texas Tech", "12 Akron", "4 Alabama", "13 Hofstra",
    "6 Tennessee", "11 SMU/Miami (OH)", "3 Virginia", "14 Wright St.", 
    "7 Kentucky", "10 Santa Clara", "2 Iowa St.", "15 Tennessee St."
];

const womensTeams = [
    // Region 1 (Storrs)
    "1 UConn", "16 UTSA", "8 Iowa St.", "9 Syracuse", 
    "5 Maryland", "12 Murray St.", "4 North Carolina", "13 Western Ill.",
    "6 Notre Dame", "11 Fairfield", "3 Ohio St.", "14 Howard", 
    "7 Illinois", "10 Colorado", "2 Vanderbilt", "15 High Point",
    
    // Region 2 (Columbia)
    "1 South Carolina", "16 Southern U./Samford", "8 Clemson", "9 Southern California", 
    "5 Michigan St.", "12 Colorado St.", "4 Oklahoma", "13 Idaho",
    "6 Washington", "11 South Dakota St.", "3 TCU", "14 UC San Diego", 
    "7 Georgia", "10 Virginia/Arizona St.", "2 Iowa", "15 FDU",
    
    // Region 3 (Los Angeles)
    "1 UCLA", "16 California Baptist", "8 Oklahoma St.", "9 Princeton", 
    "5 Ole Miss", "12 Gonzaga", "4 Minnesota", "13 Green Bay",
    "6 Baylor", "11 Nebraska/Richmond", "3 Duke", "14 Col. of Charleston", 
    "7 Texas Tech", "10 Villanova", "2 LSU", "15 Jacksonville",
    
    // Region 4 (Austin)
    "1 Texas", "16 Missouri St./SFA", "8 Oregon", "9 Virginia Tech", 
    "5 Kentucky", "12 James Madison", "4 West Virginia", "13 Miami (OH)",
    "6 Alabama", "11 Rhode Island", "3 Louisville", "14 Vermont", 
    "7 NC State", "10 Tennessee", "2 Michigan", "15 Holy Cross"
];
// 2. THE AUTO-GENERATOR ENGINE
function generateBracket(prefix, teams) {
    let games = [];
    
    // Round 1 (32 games)
    for (let i = 0; i < 32; i++) {
        games.push({
            id: `${prefix}_r1_${i+1}`, round: 'Round of 64',
            t1: teams[i*2], t2: teams[i*2+1], winner: null,
            nextId: `${prefix}_r2_${Math.floor(i/2)+1}`,
            nextSlot: i % 2 === 0 ? 't1' : 't2'
        });
    }
    // Round 2 (16 games)
    for (let i = 0; i < 16; i++) {
        games.push({ id: `${prefix}_r2_${i+1}`, round: 'Round of 32', t1: 'TBD', t2: 'TBD', winner: null, nextId: `${prefix}_r3_${Math.floor(i/2)+1}`, nextSlot: i % 2 === 0 ? 't1' : 't2' });
    }
    // Round 3 (8 games)
    for (let i = 0; i < 8; i++) {
        games.push({ id: `${prefix}_r3_${i+1}`, round: 'Sweet 16', t1: 'TBD', t2: 'TBD', winner: null, nextId: `${prefix}_r4_${Math.floor(i/2)+1}`, nextSlot: i % 2 === 0 ? 't1' : 't2' });
    }
    // Round 4 (4 games)
    for (let i = 0; i < 4; i++) {
        games.push({ id: `${prefix}_r4_${i+1}`, round: 'Elite 8', t1: 'TBD', t2: 'TBD', winner: null, nextId: `${prefix}_r5_${Math.floor(i/2)+1}`, nextSlot: i % 2 === 0 ? 't1' : 't2' });
    }
    // Round 5 (2 games)
    for (let i = 0; i < 2; i++) {
        games.push({ id: `${prefix}_r5_${i+1}`, round: 'Final Four', t1: 'TBD', t2: 'TBD', winner: null, nextId: `${prefix}_r6_1`, nextSlot: i % 2 === 0 ? 't1' : 't2' });
    }
    // Round 6 (1 game)
    games.push({ id: `${prefix}_r6_1`, round: 'National Championship', t1: 'TBD', t2: 'TBD', winner: null, nextId: null, nextSlot: null });
    
    return games;
}

const bracketData = {
    mens: generateBracket('m', mensTeams),
    womens: generateBracket('w', womensTeams)
};

let currentDivision = 'mens';

// 3. PAGE INITIALIZATION & LOGIC
document.addEventListener('DOMContentLoaded', () => {
    try {
        renderBracket();
        setupForm();
    } catch (error) {
        document.getElementById('bracket-container').innerHTML = `<p style="color:red; padding: 20px;">System Error: ${error.message}</p>`;
    }
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
    container.innerHTML = ''; 

    const games = bracketData[currentDivision];
    const rounds = [...new Set(games.map(g => g.round))];

    rounds.forEach(roundName => {
        const roundDiv = document.createElement('div');
        roundDiv.className = 'round-section';
        roundDiv.innerHTML = `<h3 style="color: var(--primary); border-bottom: 2px solid var(--accent); padding-bottom: 5px;">${roundName}</h3>`;

        const roundGames = games.filter(g => g.round === roundName);
        
        roundGames.forEach(game => {
            const isTBD1 = game.t1 === 'TBD';
            const isTBD2 = game.t2 === 'TBD';
            
            // Escape apostrophes in team names (like St. John's) so they don't break the code
            const safeT1 = game.t1.replace(/'/g, "\\'");
            const safeT2 = game.t2.replace(/'/g, "\\'");

            roundDiv.innerHTML += `
                <div class="matchup" id="${game.id}">
                    <div class="team-option ${game.winner === game.t1 ? 'selected' : ''} ${isTBD1 ? 'disabled' : ''}" 
                         onclick="selectWinner('${game.id}', '${safeT1}')">
                        ${game.t1}
                    </div>
                    <span style="color: #888; font-size: 0.9rem; margin: 0 10px;">vs</span>
                    <div class="team-option ${game.winner === game.t2 ? 'selected' : ''} ${isTBD2 ? 'disabled' : ''}" 
                         onclick="selectWinner('${game.id}', '${safeT2}')">
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
    
    game.winner = winningTeam;

    if (game.nextId) {
        const nextGame = games.find(g => g.id === game.nextId);
        if (nextGame) {
            nextGame[game.nextSlot] = winningTeam;
            // Clear future cascading picks if a user changes their mind
            clearFutureRounds(game.nextId, nextGame.winner);
            nextGame.winner = null; 
        }
    }
    renderBracket();
}

function clearFutureRounds(startId, oldWinner) {
    if (!oldWinner) return;
    const games = bracketData[currentDivision];
    let currentGame = games.find(g => g.id === startId);
    
    while (currentGame && currentGame.nextId) {
        let nextGame = games.find(g => g.id === currentGame.nextId);
        if (nextGame && nextGame.winner === oldWinner) {
            nextGame.winner = null;
            if(nextGame.t1 === oldWinner) nextGame.t1 = 'TBD';
            if(nextGame.t2 === oldWinner) nextGame.t2 = 'TBD';
            currentGame = nextGame;
        } else if (nextGame) {
            if(nextGame.t1 === oldWinner) nextGame.t1 = 'TBD';
            if(nextGame.t2 === oldWinner) nextGame.t2 = 'TBD';
            break;
        } else {
            break;
        }
    }
}

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

function setupForm() {
    const form = document.getElementById('tps-form');
    if(!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('submit-btn');
        btn.textContent = "Processing...";
        btn.disabled = true;

        const payload = {
            name: document.getElementById('username').value,
            email: document.getElementById('email').value,
            division: currentDivision
        };

        bracketData[currentDivision].forEach(game => {
            payload[game.id] = game.winner || "No Pick";
        });

        // REPLACE WITH YOUR NEW GOOGLE SCRIPT URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzQQYOquPiiTDyknM4uRV42Kx4cptyVVV9_NZ0xUrBHsPnP8rhA7A6S8mvXlTXfh5lT/exec'; 

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
}
