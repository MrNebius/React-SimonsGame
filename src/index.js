import React, { Component } from 'react';
import { render } from 'react-dom';

export default class SimonGame extends Component {

    constructor(props) {
        super(props);

        this.difficultButtons = {
            Hard: 50,
            Medium: 200,
            Easy: 500
        };
        this.inputComboCounter = 0;
        this.comboArr = [];
        this.timeout;

        this.state = {
            fieldButtons: this.initArray(),
            difficulty: this.difficultButtons.Easy,
            isStrictMode: false,
            isBlockField: true
        };
        this.initArray = this.initArray.bind(this);
        this.gameStarter = this.gameStarter.bind(this);
        this.config = this.config.bind(this);
        this.renderCombo = this.renderCombo.bind(this);
        this.delay = this.delay.bind(this);
        this.checkWin = this.checkWin.bind(this);
    }

    initArray() {
        return new Array(4).fill(true)
    }

    gameStarter(start, isGuessed, isContinue) {
        this.inputComboCounter = 0;
        this.setState({isBlockField: true});
        clearTimeout(this.timeout);

        if (!isContinue) {
            this.state.fieldButtons = this.initArray();
            this.comboArr = [];
        }
        if (start) {
            if (isGuessed) this.comboArr.push((Math.floor(Math.random() * 4)));
            this.renderCombo(this.comboArr, this.state.difficulty + 1000)
        }
    }

    config(newDifficulty, changeStrictMode) {
        const newState = {};
        this.gameStarter(false, false);
        if (newDifficulty) {
            newState.difficulty = newDifficulty;
        }
        if (changeStrictMode) {
            newState.isStrictMode = !this.state.isStrictMode;
        }
        this.setState(newState);
    }

    renderCombo(arr, difficulty, index = 0) {
        this.delay(difficulty)
            .then(() => {
                const newState = {
                    fieldButtons: this.state.fieldButtons
                };
                let newIndex = index;
                if (!this.state.fieldButtons[arr[index]]) {
                    newIndex++;
                }
                newState.fieldButtons[arr[index]] = !this.state.fieldButtons[arr[index]];
                if (arr.length === newIndex) {
                    newState.isBlockField = false;
                    this.setState(newState);
                    return
                }
                this.setState(newState);
                return this.renderCombo(arr, this.state.difficulty, newIndex);
            })
    }

    delay (delay) {
       return new Promise((resolve, reject) =>this.timeout = setTimeout(() => resolve(), delay))
    }

    checkWin(num) {
        const win = (num === this.comboArr[this.inputComboCounter]);
        this.inputComboCounter += 1;

        if (this.inputComboCounter === this.comboArr.length || !win) {
            if (!win) alert('Try again');
            if (this.comboArr.length === 20 && win) {
                alert('CONGRATULATIONS you win the game');
                this.setState({isBlockField: true});
            } else if (this.state.isStrictMode && !win) {
                this.gameStarter(true, true)
            }
            else {
                this.gameStarter(true, win, true)
            }
        }
    }

    render() {
        const difficultButtons = this.difficultButtons;
        return (
            <div className="main">
                <button className="button" onClick={() => this.gameStarter(true, true)}>
                    New Game
                </button>
                <button className={this.state.isStrictMode ? 'button_strict_on' : 'button_strict_off'} onClick={() => this.config(undefined, true)}>
                    Strict mode
                </button>
                {Object.keys(difficultButtons).map((el, i) =>
                    <button className="difficult_buttons" onClick={() => this.config(difficultButtons[el])}
                            disabled={this.state.difficulty === difficultButtons[el]}>{el}</button>)}
                {new Array(4).fill(1).map((el, i) => <button className={this.state.fieldButtons[i] ? 'buttons' : 'buttons_active'}
                                                             onClick={() => this.checkWin(i)}
                                                             disabled={this.state.isBlockField}></button>)}
                <span className="display">Now {this.comboArr.length} steps combo!</span>
            </div>
        )
    }
}

render(<SimonGame />, document.getElementById('container'));