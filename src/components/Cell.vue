<template>
    <div
        :class="[
            $style.cell,
            {[$style.cellZebra]: data.y % 2 == 0 ? data.x % 2 == 0 : data.x % 2 == 1},
            {[$style.cellRevealed]: data.revealed},
            {[$style.bomb]: (data.revealed || gameOver) && data.bomb}
        ]"
        @click.prevent="clicked()"
        @click.right.prevent="mark"
    >
        
        <strong :class="[
            $style.neighborhoodBombsCount,
            {[$style.neighborhoodBombsCount1]: data.neighborhoodBombsCount == 1},
            {[$style.neighborhoodBombsCount2]: data.neighborhoodBombsCount == 2},
            {[$style.neighborhoodBombsCount3]: data.neighborhoodBombsCount == 3},
            {[$style.neighborhoodBombsCount4]: data.neighborhoodBombsCount == 4},
            {[$style.neighborhoodBombsCount5]: data.neighborhoodBombsCount == 5},
            {[$style.neighborhoodBombsCount6]: data.neighborhoodBombsCount == 6},
            {[$style.neighborhoodBombsCount7]: data.neighborhoodBombsCount == 7},
            {[$style.neighborhoodBombsCount8]: data.neighborhoodBombsCount == 8},
        ]" v-if="data.revealed && !data.bomb">{{ data.neighborhoodBombsCount > 0 && !data.bomb ? data.neighborhoodBombsCount : '' }}</strong>
        
        <svg :class="$style.flagImage" v-if="marked" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg"><path d="M14.678 57.95l1.068-.298a1.931 1.931 0 001.34-2.38L4.878 11.585a2.414 2.414 0 00-2.975-1.675l-.138.038A2.414 2.414 0 00.09 12.922L12.299 56.61a1.931 1.931 0 002.379 1.34zM57.67 27.42a46.256 46.256 0 01-10.64-7.32.95.95 0 01-.27-.97A136.854 136.854 0 0050.27.95c.12-1.02-.43-1.32-1.01-.62-11.38 13.61-31.07-2.49-42.79 9.88.14.263.251.542.33.83l7.92 28.36c11.74-12.22 31.36 3.78 42.72-9.8.58-.7.69-1.98.23-2.18z"/></svg>
        
        <svg :class="$style.bombImage" v-if="(data.revealed || gameOver) && data.bomb" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 509.696 509.696"><path d="M496.597 242.347l-28.843-7.595a26.275 26.275 0 00-10.667-.597 197.2 197.2 0 00-29.013-80.469l24.661-41.813c5.717-9.643 3.413-15.275.512-18.261-2.901-2.987-8.533-5.376-18.261 0l-38.229 21.76A202.581 202.581 0 00276.01 59.991l-12.544-46.848C260.395 2.304 254.933 0 250.581 0c-4.181 0-9.728 2.304-12.715 13.141l-12.971 47.957a203.35 203.35 0 00-113.579 56.235l-41.3-23.552c-9.728-5.547-15.275-3.157-18.261 0-2.987 3.157-5.205 8.533.512 18.261l27.051 45.568a193.79 193.79 0 00-26.453 76.8 26.289 26.289 0 00-10.667.683l-28.843 7.595C2.347 245.163.128 250.709.128 254.891c0 4.181 2.304 9.728 13.141 12.629l28.331 7.339a39.61 39.61 0 009.984 1.365h.597a197.383 197.383 0 0024.917 80.128l-24.832 41.643c-5.717 9.728-3.413 15.275-.512 18.261a10.407 10.407 0 007.68 3.157 21.76 21.76 0 0010.581-3.328l35.925-20.48a202.328 202.328 0 00121.344 62.123l10.581 38.912c2.901 10.837 8.533 13.056 12.715 13.056s9.728-2.304 12.715-13.056l10.325-38.059a202.497 202.497 0 00128.597-61.184L434.901 416a21.76 21.76 0 0010.581 3.328 10.411 10.411 0 007.68-3.157c2.901-2.987 5.205-8.533-.512-18.261l-22.016-37.461a196.26 196.26 0 0027.221-84.395h.597a39.588 39.588 0 009.813-1.195l28.16-7.424c10.923-2.816 13.141-8.533 13.141-12.544.002-4.011-2.046-9.728-12.969-12.544zM150.213 350.219a3.842 3.842 0 01-2.117 1.611l.341-.256-45.312 25.6-28.501 16.64 42.667-72.363a5.037 5.037 0 013.413-2.731 5.375 5.375 0 013.584 1.792l24.747 24.405a3.84 3.84 0 011.178 5.302zm1.2-187.301a3.842 3.842 0 01-1.611 2.117l-.512-.085-24.747 24.405a4.267 4.267 0 01-7.51-.938v-.683l-42.496-71.765 34.133 19.285 40.192 22.869a3.839 3.839 0 012.551 4.795zm76.982-50.278l22.016-81.152 10.411 38.4 9.557 35.328 1.963 7.339a4.01 4.01 0 01-4.352 5.717h-35.072a4.011 4.011 0 01-4.352-5.717l-.171.085zm44.032 284.416l-22.016 81.152-8.533-30.379-13.739-50.688a4.01 4.01 0 014.352-5.717h35.328a4.011 4.011 0 014.352 5.717l.256-.085zm-21.241-116.558c-.201 0-.403-.002-.604-.007-14.135-.33-25.326-12.056-24.996-26.19.33-14.135 12.056-25.326 26.19-24.996 13.899.324 24.999 11.683 25.003 25.586.004 14.138-11.455 25.603-25.593 25.607zm103.092-120.935a3.842 3.842 0 012.117-1.611v.171l7.595-4.352 66.389-37.803-19.627 33.365-22.955 38.997a4.266 4.266 0 01-7.509.938l-24.832-24.405a3.838 3.838 0 01-1.178-5.3zm50.757 219.744l-48.64-27.648a3.84 3.84 0 01-.938-6.912l13.397-13.056 11.52-11.264a5.375 5.375 0 013.584-1.792 5.032 5.032 0 013.413 2.731l3.243 5.547 39.339 66.901-24.918-14.507z"/></svg>

    </div>
</template>

<script>

import EventBus from '@/eventBus';

export default {

    name: 'Cell',

    props: {

        data: {
            default: null
        },

        gameOver: {
            default: false
        },

        flags: {
            default: 0
        },

    },

    data() {
        return {

            marked: false

        }
    },

    mounted() {

        EventBus.$on('newGame', this.newGame);
        
    },

    methods: {

        clicked() {

            if(!this.gameOver && !this.marked)
                EventBus.$emit('reveal', this.data);

        },

        mark() {

            if(!this.data.revealed && this.flags > 0) {
                
                this.marked = !this.marked;

                this.$emit('update:flags', parseInt(this.flags) + (this.marked ? -1 : 1));

            }

        },

        newGame() {

            this.marked = false;

        }

    }

}

</script>

<style lang="scss" module>

$base-color: #68bd4c;
$revealed-color: #ceb78b;

.cell {

    align-items: center;
    background-color: $base-color;
    border-color: rgba(255, 255, 255, .1) rgba(0, 0, 0, .1) rgba(0, 0, 0, .1) rgba(255, 255, 255, .1);
    border-style: solid;
    border-width: 1px;
    cursor: pointer;
    display: flex;
    height: 1.8rem;
    justify-content: center;
    width: 1.8rem;

    &:hover {

        background-color: lighten($base-color, 7);

    }

}

.cellZebra {

    background-color: darken($base-color, 3);

    &:hover {

        background-color: lighten($base-color, 7);

    }

}

.cellRevealed {
    
    background-color: $revealed-color;
    cursor: auto;
    transition: all .1s linear;

    &:hover {

        background-color: $revealed-color;

    }

}

.cellRevealed.cellZebra {
    
    background-color: darken($revealed-color, 3);

}

.bomb,
.cellRevealed.bomb,
.cellRevealed.cellZebra.bomb {

    .bombImage {

        fill: rgb(185, 25, 25);
        height: 80%;
        width: 80%;

    }

}

.flagImage {
    
    fill: rgb(185, 25, 25);
    height: 80%;
    width: 80%;

}

.neighborhoodBombsCount {
    
    font-weight: 700;

}
.neighborhoodBombsCount1 { color: rgb(19, 74, 175); }
.neighborhoodBombsCount2 { color: rgb(16, 133, 45); }
.neighborhoodBombsCount3 { color: rgb(134, 12, 12); }
.neighborhoodBombsCount4 { color: rgb(158, 18, 158); }
.neighborhoodBombsCount5 { color: rgb(110, 128, 12); }
.neighborhoodBombsCount6 { color: rgb(15, 121, 112); }
.neighborhoodBombsCount7 { color: rgb(212, 115, 23); }
.neighborhoodBombsCount8 { color: rgb(139, 23, 91); }

</style>