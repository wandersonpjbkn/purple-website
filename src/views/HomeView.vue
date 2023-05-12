<template>
    <div>
      <!-- hero -->
      <the-hero :src="hero.src">
        <div>
          <p class="display-2 mb-5">Melhore a comunicação da sua empresa</p>
        </div>
        <div>
          <button class="btn purple">Conversar com consultor</button>
        </div>
      </the-hero>

      <!-- data -->
      <section class="container py-5">
        <div class="row flex-column">
          <div class="col-6 mx-auto">
            <p class="display-2 purple text-start">
              57%
            </p>
          </div>
          <div class="col-6 mx-auto">
            <p class="text green text-start">
              É o número de trabalhadores que não estão engajados com seu trabalho
            </p>
          </div>
          <div class="col-6 mx-auto">
            <p class="lead text-start">
              A falta de engajamento faz com que a produtividade também diminua.
            </p>
          </div>
          <div class="col-6 mx-auto">
            <p class="text-start">
              Os desafios do dia a dia, acabam concentrando os esforços somente em ações externas, como: promoções, campanhas e anúncios.
            </p>
            <p class="text-start">
              Mas, ao deixar de pensar no bem estar dos colaboradores, são as empresas que perdem muitas oportunidades no fim do dia.
            </p>
          </div>
          <div class="col-6 mx-auto">
            <button class="btn purple mt-5">Vamos conversar</button>
          </div>
        </div>
      </section>

      <!-- cta -->
      <section class="container-fluid py-5 theme--purple">
        <div class="container">
          <div class="row">
            <div class="col-7 mx-auto">
              <p class="lead">
                Equipes motivadas e engajadas custam menos, desempenham suas funções com mais empenho e colaboram mais para o crescimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- data -->
      <section class="container py-5">
        <div class="row">
          <div class="col">
            <div class="row flex-column">
              <div class="col mx-auto">
                <p class="display-2 purple text-start">
                  Até 4x
                </p>
              </div>
              <div class="col mx-auto">
                <p class="text green text-start">
                  É o aumento da receita percebido pelas empresas com boa cultura
                </p>
              </div>
              <div class="col mx-auto">
                <p class="lead text-start">
                  Ter uma cultura sólida faz com que as pessoas trabalhem melhor, mais felizes, oque faz com que a receita aumente
                </p>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="row flex-column">
              <div class="col mx-auto">
                <p class="display-2 purple text-start">
                  Até 17%
                </p>
              </div>
              <div class="col mx-auto">
                <p class="text green text-start">
                  É o aumento na produtiva alcançada, por empresas com time engajado
                </p>
              </div>
              <div class="col mx-auto">
                <p class="lead text-start">
                  As empresas poderiam ser mais produtivasse, tivessem colaboradores maisengajados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- cta -->
      <section class="container-fluid py-5 theme--orange">
        <div class="container">
          <div class="row flex-column">
            <div class="col-7 mx-auto">
              <p class="lead">
                No ambiente empresarial a comunicação pode resolver problemas, alinhar pensamentos, distribuir tarefas ou causar grandes ruídos e ruínas.
              </p>
              <div class="col-6 mx-auto">
            <button class="btn black mt-5">Vamos conversar</button>
          </div>
            </div>
          </div>
        </div>
      </section>
    </div>
</template>

<script>
import TheHero from '@/components/TheHero.vue'

export default {
  name: 'HomeView',
  components: {
    TheHero
  },
  data: () => ({
    hero: {
      src: require('@/assets/img/christina-wocintechchat-com-faEfWCdOKIg-unsplash.jpg')
    }
  })
}
</script>

<style lang="scss" scoped>
.display-2 {
  max-width: 910px;

  font: {
    family: $font_main_bold;
  }
  color: $black;
  line-height: 120%;

  &.purple {
    color: $purple;
  }
}

.lead {
  font: {
    size: 1.75rem;
  }
  line-height: 120%;
}

.text {
  font: {
    family: $font_main_medium;
    size: 2rem;
  }
  line-height: 120%;

  &.green {
    color: $green;
  }
}

.theme {
  &--purple {
    .lead {
      color: $white;
    }
  }

  &--orange {
    .lead {
      color: $black;
    }
  }
}
</style>
