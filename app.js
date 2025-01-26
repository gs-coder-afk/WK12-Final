// pulling elements from html page
document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const form = document.getElementById('myForm');

// async funciton to get the games from the server
// with an error block if the fetch fails & returns an 
// empty array instead array with games

    const getGames = async () => {
        try {
            const response = await fetch('http://localhost:3000/games');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const games = await response.json();
            return games;
        } catch (error) {
            console.error('Error fetching games:', error);
            return [];
        }
    };

// async function to display games from json database
// delete button for each game & div to display

    const displayGames = async () => {
        content.innerHTML = ''; 
        const games = await getGames();
        games.forEach(game => {
            const gameDiv = document.createElement('div');
            gameDiv.id = `game${game.id}`;
            gameDiv.className = 'info-box';
            gameDiv.innerHTML = `
                ID: ${game.id} - ${game.title}, ${game.franchise}
                <button class="btn btn-sm btn-danger delete-btn" data-id="${game.id}">X</button>
            `;
            content.appendChild(gameDiv);
        });

        content.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-btn')) {
              deleteGame(event);
            }
          });
      };

// async funtion to add game or POST to json 
// error is given if POST failed 
// displays new game added onto page

    const createGame = async (gameData) => { 
        try {
            const response = await fetch('http://localhost:3000/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            displayGames();
            alert('Game created successfully!');
        } catch (error) {
            console.error('Error creating game:', error);
            alert('Error creating game.');
        }
    };

// removes game or sends DELETE to json 
// sends delete request to json by games ID 
// displays error if delete failed
// deleted game when successfully removed will not show
// up on the webpage     

    const deleteGame = async (event) => {
      const id = event.target.dataset.id;
        try {
            const response = await fetch(`http://localhost:3000/games/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            displayGames();
            alert('Game deleted successfully!');
        } catch (error) {
            console.error('Error deleting game:', error);
            alert('Error deleting game.');
        }
    };

// submits for the form without refreshing page
// form clears after submit     

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = {
            title: document.getElementById('title').value,
            franchise: document.getElementById('franchise').value,
        };
        createGame(formData);
        form.reset();
    });

    displayGames();
});