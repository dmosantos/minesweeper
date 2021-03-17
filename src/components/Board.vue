<template>
    <div>
        
        <div v-if="!loading" :class="$style.board">

            <b-container :class="$style.panel" fluid>
                <b-row>

                    <b-col :class="$style.flags">
                        <svg :class="$style.flagImage" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg"><path d="M14.678 57.95l1.068-.298a1.931 1.931 0 001.34-2.38L4.878 11.585a2.414 2.414 0 00-2.975-1.675l-.138.038A2.414 2.414 0 00.09 12.922L12.299 56.61a1.931 1.931 0 002.379 1.34zM57.67 27.42a46.256 46.256 0 01-10.64-7.32.95.95 0 01-.27-.97A136.854 136.854 0 0050.27.95c.12-1.02-.43-1.32-1.01-.62-11.38 13.61-31.07-2.49-42.79 9.88.14.263.251.542.33.83l7.92 28.36c11.74-12.22 31.36 3.78 42.72-9.8.58-.7.69-1.98.23-2.18z"/></svg>
                        {{ flags }}
                    </b-col>

                </b-row>
            </b-container>

            <div :class="$style.row" v-for="(row, y) in fieldMap" :key="y">

                <div :class="$style.col" v-for="(data, x) in row" :key="x">

                    <Cell :data="data" :flags.sync="flags" :gameOver="gameOver" />
                
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

    props: {
        
        rows: {
            default: 20
        },

        cols: {
            default: 20
        },

        bombs: {
            default: 10
        },

    },

    data() {
        return {

            loading: true,
            fieldMap: [],
            successCount: 0,
            gameOver: false,
            success: false,
            flags: 0

        }
    },

    mounted() {

        this.newGame();

        /* Registra eventos */

        EventBus.$on('reveal', this.reveal);

    },

    methods: {

        reveal(cell) {

            if(cell.revealed)
                return;

            cell.revealed = true;

            // Verifica se o jogador perdeu o jogo
            if(cell.bomb) {

                this.gameOver = true;

                EventBus.$emit('gameOver');

                return;

            } else
                this.successCount++;

            // Verifica se o jogador ganhou o jogo
            if(this.successCount >= ((this.cols * this.rows) - this.bombs)) {
                
                this.gameOver = true;
                this.success = true;

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
                        || (cell.x + x >= this.cols || cell.y + y >= this.rows)
                    )
                        continue;

                    if(
                        !this.fieldMap[cell.y + y][cell.x + x].revealed
                        && !this.fieldMap[cell.y + y][cell.x + x].bomb
                        && !(
                            Math.abs(y) == 1 && Math.abs(x) == 1
                            && this.fieldMap[cell.y + y][cell.x + x].neighborhoodBombsCount == 0
                        )
                    )
                        setTimeout(() => EventBus.$emit('reveal', this.fieldMap[cell.y + y][cell.x + x]), 100);

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
            this.flags = this.bombs;

            /* Monta o mapa */

            setTimeout(() => {

                for (let y = 0; y < this.rows; y++) {
                    
                    this.fieldMap.push([]);

                    for (let x = 0; x < this.cols; x++) {

                        this.fieldMap[y].push({
                            x: x,
                            y: y,
                            revealed: false,
                            neighborhoodBombsCount: 0,
                            bomb: false
                        });

                    }

                }

                /* Gera as bombas aleatórias */

                let bombsMap = [];
                let newBomb;

                for(let i = 0; i < this.bombs; i++) {

                    for (;;) {
                        
                        newBomb = {
                            x: Math.floor(Math.random() * this.cols),
                            y: Math.floor(Math.random() * this.rows)
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
                                    || (cell.x + x >= this.cols || cell.y + y >= this.rows)
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

        }

    }

}

</script>

<style lang="scss" module>

.loading {

    color: #fff;

}

.panel {

    background-color: #fff;
    padding: 1rem;

    .flags {
        
        align-items: center;
        display: flex;

        .flagImage {

            fill: rgb(185, 25, 25);
            height: 1rem;
            margin-right: 5px;
            width: 1rem;

        }

    }

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

</style>