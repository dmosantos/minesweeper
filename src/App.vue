<template>
    <div :class="$style.app">

        <h1 :class="$style.title">Campo Minado</h1>
        
        <Board rows="20" cols="30" bombs="80" />

        <footer :class="$style.footer">
            2021 | Desenvolvido por <a href="https://diegomarques.com.br/" title="Diego Marques" target="_blank">Diego Marques</a>
        </footer>

    </div>
</template>

<script>

import Board from '@/components/Board'

export default {
    
    name: 'App',
    
    components: {
        Board
    }

}

</script>

<style lang="scss" module>

.app {

    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem 0;

    .title {

        color: #fff;
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
        text-transform: uppercase;

    }

    .footer {

        color: #fff;
        font-size: .8rem;
        margin: 1rem 0;
        opacity: .5;

        a {

            color: #fff;
            text-decoration: underline;

        }

    }

}

</style>