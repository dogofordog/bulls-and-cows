import { initialState, updateSettings, startGame, addAttempt, winGame, resetGame } from './state';
import { generateSecret, isValidGuess, evaluateGuess, countPossibleSecrets } from './logic';

let state = { ...initialState };

const app = document.getElementById('app');

function render() {
  if (!app) return;
  app.innerHTML = '';

  if (state.status === 'settings') {
    const title = document.createElement('h1');
    title.textContent = 'Bulls and Cows';
    app.appendChild(title);

    const baseLabel = document.createElement('label');
    baseLabel.textContent = 'Base: ';
    const baseSelect = document.createElement('select');
    ([2, 8, 10, 16] as Base[]).forEach((b) => {
      const option = document.createElement('option');
      option.value = String(b);
      option.textContent = b === 10 ? 'Dec' : b === 16 ? 'Hex' : b === 8 ? 'Oct' : 'Bin';
      if (b === state.base) option.selected = true;
      baseSelect.appendChild(option);
    });
    baseLabel.appendChild(baseSelect);
    app.appendChild(baseLabel);

    const lengthLabel = document.createElement('label');
    lengthLabel.textContent = 'Length: ';
    const lengthSelect = document.createElement('select');
    const maxLength = state.base === 2 ? 2 : 6;
    for (let i = 2; i <= maxLength; i++) {
      const option = document.createElement('option');
      option.value = String(i);
      option.textContent = String(i);
      if (i === state.length) option.selected = true;
      lengthSelect.appendChild(option);
    }
    lengthLabel.appendChild(lengthSelect);
    app.appendChild(lengthLabel);

    const possibleLabel = document.createElement('p');
    possibleLabel.textContent = `Possible secrets: ${countPossibleSecrets(state.length, state.base)}`;
    app.appendChild(possibleLabel);

    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start Game';
    startBtn.addEventListener('click', () => {
      const secret = generateSecret(state.length, state.base);
      state = startGame(state, secret);
      render();
    });
    app.appendChild(startBtn);

    baseSelect.addEventListener('change', (e) => {
      const newBase = Number((e.target as HTMLSelectElement).value) as Base;
      const maxLen = newBase === 2 ? 2 : 6;
      state = updateSettings(state, Math.min(state.length, maxLen), newBase);
      render();
    });

    lengthSelect.addEventListener('change', (e) => {
      state = updateSettings(state, Number((e.target as HTMLSelectElement).value), state.base);
      render();
    });
  } else if (state.status === 'playing' || state.status === 'won') {
    const title = document.createElement('h1');
    title.textContent = 'Bulls and Cows';
    app.appendChild(title);

    const info = document.createElement('p');
    info.textContent = `Length: ${state.length}, Base: ${state.base}`;
    app.appendChild(info);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Enter ${state.length} digits`;
    input.maxLength = state.length;
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      target.value = target.value
        .toLowerCase()
        .split('')
        .filter((char) => {
          const validChars = '0123456789abcdef'.slice(0, state.base);
          return validChars.includes(char.toLowerCase());
        })
        .slice(0, state.length)
        .join('');
    });
    app.appendChild(input);

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Guess';
    submitBtn.addEventListener('click', () => {
      const guess = input.value.toLowerCase();
      if (isValidGuess(guess, state.length, state.base)) {
        const result = evaluateGuess(state.secret, guess);
        state = addAttempt(state, guess, result.bulls, result.cows);
        if (result.bulls === state.length) {
          state = winGame(state);
        }
        render();
      } else {
        alert('Invalid guess!');
      }
    });
    app.appendChild(submitBtn);

    const historyTitle = document.createElement('h2');
    historyTitle.textContent = 'History';
    app.appendChild(historyTitle);

    const historyList = document.createElement('ul');
    state.history.forEach((attempt) => {
      const li = document.createElement('li');
      li.textContent = `${attempt.guess} - ${attempt.bulls} bulls, ${attempt.cows} cows`;
      historyList.appendChild(li);
    });
    app.appendChild(historyList);

    if (state.status === 'won') {
      const winMsg = document.createElement('p');
      winMsg.textContent = `Congratulations! You won in ${state.history.length} attempts!`;
      winMsg.style.color = 'green';
      winMsg.style.fontWeight = 'bold';
      app.appendChild(winMsg);

      const newGameBtn = document.createElement('button');
      newGameBtn.textContent = 'New Game';
      newGameBtn.addEventListener('click', () => {
        state = resetGame();
        render();
      });
      app.appendChild(newGameBtn);
    }
  }
}

render();
