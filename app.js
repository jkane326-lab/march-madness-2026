// 1. THE DATA
const mensTeams = [
    "1 Duke", "16 Siena", "8 Ohio St.", "9 TCU", 
    "5 St. John's", "12 Northern Iowa", "4 Kansas", "13 Cal Baptist",
    "6 Louisville", "11 South Florida", "3 Michigan St.", "14 North Dakota St.", 
    "7 UCLA", "10 UCF", "2 UConn", "15 Furman",
    "1 Florida", "16 Lehigh/PVAMU", "8 Clemson", "9 Iowa", 
    "5 Vanderbilt", "12 McNeese", "4 Nebraska", "13 Troy",
    "6 North Carolina", "11 VCU", "3 Illinois", "14 Penn", 
    "7 Saint Mary's", "10 Texas A&M", "2 Houston", "15 Idaho",
    "1 Arizona", "16 Long Island", "8 Villanova", "9 Utah St.", 
    "5 Wisconsin", "12 High Point", "4 Arkansas", "13 Hawaii",
    "6 BYU", "11 NC State/Texas", "3 Gonzaga", "14 Kennesaw St.", 
    "7 Miami (FL)", "10 Missouri", "2 Purdue", "15 Queens (N.C.)",
    "1 Michigan", "16 Howard/UMBC", "8 Georgia", "9 Saint Louis", 
    "5 Texas Tech", "12 Akron", "4 Alabama", "13 Hofstra",
    "6 Tennessee", "11 SMU/Miami (OH)", "3 Virginia", "14 Wright St.", 
    "7 Kentucky", "10 Santa Clara", "2 Iowa St.", "15 Tennessee St."
];

const womensTeams = [
    "1 UConn", "16 UTSA", "8 Iowa St.", "9 Syracuse", 
    "5 Maryland", "12 Murray St.", "4 North Carolina", "13 Western Ill.",
    "6 Notre Dame", "11 Fairfield", "3 Ohio St.", "14 Howard", 
    "7 Illinois", "10 Colorado", "2 Vanderbilt", "15 High Point",
    "1 South Carolina", "16 Southern U./Samford", "8 Clemson", "9 Southern California", 
    "5 Michigan St.", "12 Colorado St.", "4 Oklahoma", "13 Idaho",
    "6 Washington", "11 South Dakota St.", "3 TCU", "14 UC San Diego", 
    "7 Georgia", "10 Virginia/Arizona St.", "2 Iowa", "15 FDU",
    "1 UCLA", "16 California Baptist", "8 Oklahoma St.", "9 Princeton", 
    "5 Ole Miss", "12 Gonzaga", "4 Minnesota", "13 Green Bay",
    "6 Baylor", "11 Nebraska/Richmond", "3 Duke", "14 Col. of Charleston", 
    "7 Texas Tech", "10 Villanova", "2 LSU", "15 Jacksonville",
    "1 Texas", "16 Missouri St./SFA", "8 Oregon", "9 Virginia Tech", 
    "5 Kentucky", "12 James Madison", "4 West Virginia", "13 Miami (OH)",
    "6 Alabama", "11 Rhode Island", "3 Louisville", "14 Vermont", 
    "7 NC State", "10 Tennessee", "2 Michigan", "15 Holy Cross"
];

// 2. THE ENGINE
function generateBracket(prefix, teams) {
    let games = [];
    for (let i = 0; i < 32; i++) games.push({ id: `${prefix}_r1_${i+1}`, round: 'Round of 64', t1: teams[i*2], t2: teams[i*2+1], winner: null, nextId: `${prefix}_r2_${Math.floor(i/2)+1}`, nextSlot: i % 2 === 0 ? 't1' : 't2' });
    for (let i = 0; i < 16; i++) games.push({ id: `${prefix}_r2_${i+1}`, round: 'Round of 32', t1: 'TBD', t2: 'TBD', winner: null, nextId: `${prefix}_r3_${Math.floor(i/2)+1}`, nextSlot: i % 2 === 0 ? 't1' : 't2' });
    for (let i = 0; i < 8; i++) games.push({ id: `${prefix}_r3_${i+1}`, round: 'Sweet 16', t1: 'TBD', t2: 'TBD', winner: null, nextId: `${prefix}_r4_${Math.floor(i/2)+1}`, nextSlot: i % 2 === 0 ? 't1' : 't2' });
    for (let i = 0; i < 4; i++) games.push({ id: `${prefix}_r4_${i+1}`, round: 'Elite 8', t1: 'TBD', t2: 'TBD', winner: null, nextId: `${prefix}_r5_${Math.floor(i/2)+1}`, nextSlot: i % 2 === 0 ? 't1' : 't2' });
    for (let i = 0; i < 2; i++) games.push({ id: `${prefix}_r5_${i+1}`, round: 'Final Four', t1: 'TBD', t2: 'TBD', winner: null, nextId: `${prefix}_r6_1`, nextSlot: i % 2 === 0 ? 't1' : 't2' });
    games.push({ id: `${prefix}_r6_1`, round: 'National Championship', t1: 'TBD', t2: 'TBD', winner: null, nextId: null, nextSlot: null });
    return games;
}

const bracketData = {
    mens: generateBracket('m', mensTeams),
    womens: generateBracket('w', womensTeams)
};

let currentDivision = 'mens';

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
    
    const userInfo = document.querySelector('.user-info');
    const successMsg = document.getElementById('success-message');
    const btn = document.getElementById('submit-btn');
    
    if(userInfo) userInfo.style.display = 'block';
    if(successMsg) successMsg.style.display = 'none';
    if(btn) {
        btn.textContent = "2. Submit to Management";
        btn.disabled = false;
    }

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

// 3. NATIVE PRINT RECEIPT (Bulletproof Alternative to html2pdf)
function downloadPDF() {
    const games = bracketData[currentDivision];
    const divisionName = currentDivision === 'mens' ? "Men's Division" : "Women's Division";

    // Build a clean HTML receipt
    let receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${divisionName} Picks Receipt</title>
        <style>
            body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.6; max-width: 800px; margin: auto; }
            h1 { color: #0056b3; border-bottom: 2px solid #ff8c00; padding-bottom: 10px; }
            h2 { margin-top: 30px; color: #555; background: #f4f7f6; padding: 10px; border-radius: 4px; }
            ul { list-style-type: none; padding: 0; }
            li { padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
            .matchup-text { color: #666; font-size: 0.9em; }
            .winner { font-weight: bold; color: #0056b3; font-size: 1.1em; }
            .no-pick { color: #999; font-style: italic; }
            @media print { body { padding: 0; } }
        </style>
    </head>
    <body>
        <h1>TPS Report Receipt: ${divisionName}</h1>
        <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
    `;

    // Loop through the rounds and print the matchups + their picks
    const rounds = [...new Set(games.map(g => g.round))];

    rounds.forEach(roundName => {
        receiptHTML += `<h2>${roundName}</h2><ul>`;
        const roundGames = games.filter(g => g.round === roundName);
        
        roundGames.forEach(game => {
            const pick = game.winner ? `<span class="winner">${game.winner}</span>` : `<span class="no-pick">No Pick</span>`;
            receiptHTML += `
                <li>
                    <span class="matchup-text">${game.t1} vs ${game.t2}</span> 
                    <span>&rarr; ${pick}</span>
                </li>`;
        });
        receiptHTML += `</ul>`;
    });

    receiptHTML += `
        <script>
            // Automatically pop open the print dialog when the tab opens
            window.onload = function() { window.print(); }
        </script>
    </body>
    </html>
    `;

    // Open a new tab and write the receipt to it
    const receiptWindow = window.open('', '_blank');
    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
}
// 4. DATA SUBMISSION
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

        // YOUR EXACT GOOGLE SCRIPT URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzQQYOquPiiTDyknM4uRV42Kx4cptyVVV9_NZ0xUrBHsPnP8rhA7A6S8mvXlTXfh5lT/exec'; 

        fetch(scriptURL, { 
            method: 'POST', 
            mode: 'no-cors',  // <-- THIS IS THE MAGIC BULLET YOU WERE MISSING
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
            btn.textContent = "2. Submit to Management";
            btn.disabled = false;
        });
    });
}
