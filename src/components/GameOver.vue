<template>
    <div :class="$style.gameOver">

        <div :class="$style.modal">
            
            <h2 :class="$style.title">Fim de Jogo!</h2>
            <p :class="$style.message"><slot></slot></p>
            
            <button :class="$style.button" @click.prevent="$emit('click')">
                <b-icon :class="$style.icon" icon="arrow-clockwise"></b-icon>
                Jogar Novamente
            </button>

        </div>

    </div>
</template>

<script>

export default {

    name: 'GameOver'

}

</script>

<style lang="scss" module>

.modal {

    background-color: #fff;
    border-radius: 0 0 5px 5px;
    margin-top: -3px;
    padding: 2rem 2rem 1rem 2rem;
    text-align: center;

    .title {

        font-size: 1.2rem;
        font-weight: 400;
        margin: 0 0 1rem 0;
        text-transform: uppercase;

    }

    .message {

        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 1.5rem 0;

    }

    .button {

        background-color: var(--theme-color-1);
        border: 0 none;
        border-radius: 3px;
        color: #fff;
        font-weight: 700;
        margin-bottom: 1rem;
        padding: .8rem 1rem;
        text-transform: uppercase;

        &:hover {

            opacity: .8;

        }

        .icon {

            margin-right: .3rem;

        }

    }

}

</style>