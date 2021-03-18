<template>
    <div>
        
        <div v-if="!loading" :class="$style.board">

            <div :class="$style.panel">

                <div :class="$style.flags">
                    <svg :class="$style.flagImage" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg"><path d="M14.678 57.95l1.068-.298a1.931 1.931 0 001.34-2.38L4.878 11.585a2.414 2.414 0 00-2.975-1.675l-.138.038A2.414 2.414 0 00.09 12.922L12.299 56.61a1.931 1.931 0 002.379 1.34zM57.67 27.42a46.256 46.256 0 01-10.64-7.32.95.95 0 01-.27-.97A136.854 136.854 0 0050.27.95c.12-1.02-.43-1.32-1.01-.62-11.38 13.61-31.07-2.49-42.79 9.88.14.263.251.542.33.83l7.92 28.36c11.74-12.22 31.36 3.78 42.72-9.8.58-.7.69-1.98.23-2.18z"/></svg>
                    {{ flags }}
                </div>

                <div :class="$style.elapsedTime">
                    <b-icon icon="alarm" />
                    {{ elapsedTime }}
                </div>

                <div :class="$style.difficulty">
                    <label for="difficulty" :class="$style.label">Dificuldade:</label>
                    <select id="difficulty" v-model="difficulty" :class="$style.input">
                        <option value="easy">Fácil</option>
                        <option value="normal">Normal</option>
                        <option value="hard">Difícil</option>
                    </select>
                </div>

            </div>

            <div :class="[$style.field, {[$style.fail]: gameOver && !success}]">
            
                <div :class="$style.row" v-for="(row, y) in fieldMap" :key="y">

                    <div :class="$style.col" v-for="(data, x) in row" :key="x">

                        <Cell :data="data" :marked.sync="data.marked" :flags.sync="flags" :gameOver="gameOver" />
                    
                    </div>

                </div>

            </div>

        </div>

        <div v-if="loading" :class="$style.loading">
            Carregando...
        </div>

        <GameOver v-if="gameOver" @click="newGame()">
            <span v-if="success">Parabéns! Você venceu!</span>
            <span v-if="!success">Ixi! Você explodiu!</span>
        </GameOver>
    
    </div>
</template>

<script>

import EventBus from '@/eventBus';
import Cell from './Cell';
import GameOver from './GameOver';

export default {

    name: 'Board',

    components: {
        Cell,
        GameOver
    },

    data() {
        return {

            difficulty: 'normal',
            rowCount: 0,
            colCount: 0,
            bombCount: 0,

            loading: true,
            fieldMap: [],
            successCount: 0,
            gameOver: false,
            success: false,
            flags: 0,
            startedIn: null,
            finishedIn: null,
            elapsedTimeMilliseconds: null

        }
    },

    mounted() {

        this.setDifficulty('normal');

        /* Registra eventos */

        EventBus.$on('reveal', this.reveal);

    },

    computed: {

        elapsedTime() {

            if (!this.startedIn)
                return '0:00';

            let minutes = Math.floor(this.elapsedTimeMilliseconds / 1000 / 60);
            let seconds = Math.floor(this.elapsedTimeMilliseconds / 1000 % 60);
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            let timer = `${minutes}:${seconds}`;

            return timer || '0:00';

        }

    },

    watch: {

        difficulty(level) {

            this.setDifficulty(level);

        }

    },

    methods: {

        reveal(cell) {

            if(cell.revealed)
                return;

            cell.revealed = true;

            // Marca o contador de início
            if(!this.startedIn) {
                
                this.startedIn = new Date();
                
                this.updateElapsedTime();

            }

            // Verifica se o jogador perdeu o jogo
            if(cell.bomb) {

                this.gameOver = true;
                this.finishedIn = new Date();

                this.updateElapsedTime();

                EventBus.$emit('gameOver');

                return;

            } else
                this.successCount++;

            // Verifica se o jogador ganhou o jogo
            if(this.successCount >= ((this.colCount * this.rowCount) - this.bombCount)) {
                
                this.gameOver = true;
                this.finishedIn = new Date();
                this.success = true;

                this.updateElapsedTime();

                EventBus.$emit('gameOver');

                return;

            }

            // Verifica se tem bomba na vizinhança
            if(cell.neighborhoodBombsCount > 0)
                return;

            // Analisa a vizinhança
            for(let y = -1; y < 2; y++) {

                for(let x = -1; x < 2; x++) {

                    if (
                        (y == 0 && x == 0)
                        || (cell.y + y < 0 || cell.x + x < 0)
                        || (cell.x + x >= this.colCount || cell.y + y >= this.rowCount)
                    )
                        continue;

                    if(
                        !this.fieldMap[cell.y + y][cell.x + x].revealed
                        && !this.fieldMap[cell.y + y][cell.x + x].bomb
                        && !this.fieldMap[cell.y + y][cell.x + x].marked
                        && !(
                            Math.abs(y) == 1 && Math.abs(x) == 1
                            && this.fieldMap[cell.y + y][cell.x + x].neighborhoodBombsCount == 0
                        )
                    )
                        setTimeout(() => EventBus.$emit('reveal', this.fieldMap[cell.y + y][cell.x + x]), 50);

                }
                
            }

        },

        newGame() {

            /* Reset de variáveis */

            this.loading = true;
            this.fieldMap = [];
            this.successCount = 0;
            this.gameOver = false;
            this.success = false;
            this.flags = this.bombCount;
            this.startedIn = null;
            this.finishedIn = null;
            this.elapsedTimeMilliseconds = null;

            /* Monta o mapa */

            setTimeout(() => {

                for (let y = 0; y < this.rowCount; y++) {
                    
                    this.fieldMap.push([]);

                    for (let x = 0; x < this.colCount; x++) {

                        this.fieldMap[y].push({
                            x: x,
                            y: y,
                            revealed: false,
                            neighborhoodBombsCount: 0,
                            bomb: false,
                            marked: false
                        });

                    }

                }

                /* Gera as bombas aleatórias */

                let bombsMap = [];
                let newBomb;

                for(let i = 0; i < this.bombCount; i++) {

                    for (;;) {
                        
                        newBomb = {
                            x: Math.floor(Math.random() * this.colCount),
                            y: Math.floor(Math.random() * this.rowCount)
                        }

                        if(bombsMap.filter(e => e.x == newBomb.x && e.y == newBomb.y).length == 0) {
                            
                            bombsMap.push(newBomb);

                            this.fieldMap[newBomb.y][newBomb.x].bomb = true;

                            break;

                        }

                    }

                }

                /* Conta a quantidade de bombas nos vizinhos */

                for (let row of this.fieldMap) {
                    
                    for (let cell of row) {

                        for(let y = -1; y < 2; y++) {

                            for(let x = -1; x < 2; x++) {

                                if (
                                    (x == 0 && y == 0)
                                    || (cell.y + y < 0 || cell.x + x < 0)
                                    || (cell.x + x >= this.colCount || cell.y + y >= this.rowCount)
                                )
                                    continue;

                                if(this.fieldMap[cell.y + y][cell.x + x].bomb)
                                    cell.neighborhoodBombsCount++;

                            }
                            
                        }

                    }

                }

                /* Finaliza a configuração de novo jogo */

                EventBus.$emit('newGame');

                this.loading = false;

            }, 10);

        },

        updateElapsedTime() {

            this.elapsedTimeMilliseconds = (!this.gameOver ? new Date() : this.finishedIn) - this.startedIn;

            if(!this.gameOver && this.startedIn)
                setTimeout(this.updateElapsedTime, 1000);

        },

        setDifficulty(level) {

            switch(level) {

                case 'easy':
                    this.rowCount = 15;
                    this.colCount = 20;
                    this.bombCount = 20;
                    break;

                case 'normal':
                    this.rowCount = 20;
                    this.colCount = 30;
                    this.bombCount = 60;
                    break;

                case 'hard':
                    this.rowCount = 25;
                    this.colCount = 40;
                    this.bombCount = 120;
                    break;

            }

            this.newGame();

        }

    }

}

</script>

<style lang="scss" module>

.loading {

    color: #fff;

}

.panel {

    align-items: center;
    background-color: #fff;
    display: flex;
    padding: 1rem;

    .flags {
        
        align-items: center;
        display: flex;

        .flagImage {

            fill: rgb(25, 94, 185);
            height: 1rem;
            margin-right: 5px;
            width: 1rem;

        }

    }

    .elapsedTime {

        flex-grow: 1;
        padding: 0 1rem;

    }

    .difficulty {

        align-items: center;
        display: flex;

    }

}

.field {

    overflow: hidden;

}

.board {

    border: 3px solid #fff;
    border-radius: 3px;
    display: block;

    .row {

        display: flex;

        .col {

            display: flex;

        }

    }

}

.label {

    margin: 0 5px 0 0;

}

.input {

    background-color: #efefef;
    border: 0 none;
    border-radius: 5px;
    padding: 3px 5px;

}

.fail {

    animation: shake .5s ease-out;

}

@keyframes shake {

    0% { transform: translateX(10px) }
    10% { transform: translateX(-10px) }
    20% { transform: translateX(10px) }
    30% { transform: translateX(-10px) }
    40% { transform: translateX(10px) }
    50% { transform: translateX(-10px) }
    60% { transform: translateX(10px) }
    70% { transform: translateX(-10px) }
    80% { transform: translateX(10px) }
    90% { transform: translateX(-10px) }
    100% { transform: translateX(0px) }
    
}

</style>