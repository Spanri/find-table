<template>
  <div class="task">
    <h2 class="task__title">Описание задачи</h2>
    <p>
      «Подбор стола для сидения за ним (при заданной глубине)»
    </p>
    <h3 class="task__subtitle">Входные значения</h3>
    <vue-plotly
      class="task__chart"
      :data="data1"
      :layout="layout1"
      :options="options"
    />
    <vue-plotly
      class="task__chart"
      :data="data2"
      :layout="layout2"
      :options="options"
    />
    <vue-plotly
      class="task__chart"
      :data="data3"
      :layout="layout3"
      :options="options"
    />
    <vue-plotly
      class="task__chart"
      :data="data4"
      :layout="layout4"
      :options="options"
    />
    <h3 class="task__subtitle">Выходное значение</h3>
    <vue-plotly
      class="task__chart"
      :data="data5"
      :layout="layout5"
      :options="options"
    />
  </div>
</template>

<script>
import VuePlotly from "@statnett/vue-plotly";

export default {
  name: "Task",

  components: {
    VuePlotly: VuePlotly
  },

  data() {
    return {
      layout1: { title: "Высота" },
      layout2: { title: "Ширина, глубину не берем" },
      layout3: { title: "Материал (степень прочности)" },
      layout4: { title: "Место для протягивания ног" },
      layout5: { title: "Стоит ли сидеть за столом" },

      options: {},

      data1: [
        { name: "Столешница очень низко", x: [0, 7, 17], y: [0, 1, 0] },
        { name: "Ниже стула", x: [12, 20, 38], y: [0, 1, 0] },
        { name: "Как стул", x: [20, 30, 50, 88], y: [0, 1, 1, 0] },
        { name: "Как стол", x: [70, 80, 110, 150], y: [0, 1, 1, 0] },
        {
          name: "С рост человека и выше",
          x: [120, 160, 200],
          y: [0, 1, 1]
        }
      ],

      data2: [
        {
          name: "Поместится телефон боком",
          x: [0, 8, 35],
          y: [0, 1, 0]
        },
        {
          name: "Поместится раскрытая тетрадь",
          x: [25, 38, 68],
          y: [0, 1, 0]
        },
        {
          name: "Поместится 2 раскрытые тетради",
          x: [40, 60, 75, 140],
          y: [0, 1, 1, 0]
        },
        {
          name: "Можно растянуть руки в разные стороны",
          x: [100, 130, 160, 200],
          y: [0, 1, 1, 0]
        }
      ],

      data3: [
        { name: "Палки и листья", x: [0, 3, 8], y: [0, 1, 0] },
        { name: "Картон", x: [5, 15, 34], y: [0, 1, 0] },
        { name: "Фанера", x: [18, 45, 67], y: [0, 1, 0] },
        { name: "Дерево/дсп", x: [50, 55, 75, 92], y: [0, 1, 1, 0] },
        {
          name: "Камень",
          x: [80, 95, 100],
          y: [0, 1, 1]
        }
      ],

      data4: [
        {
          name: "Для детской ступни",
          x: [0, 12, 15, 24],
          y: [0, 1, 1, 0]
        },
        { name: "Для большой ступни", x: [20, 28, 42], y: [0, 1, 0] },
        {
          name: "Норм, если согнуть ноги в коленях",
          x: [30, 40, 50, 72],
          y: [0, 1, 1, 0]
        },
        {
          name: "Можно расправить ноги среднего роста человеку",
          x: [60, 85, 130],
          y: [0, 1, 0]
        },
        {
          name: "Можно расправить ноги высокого роста человеку",
          x: [90, 110, 150],
          y: [0, 1, 0]
        }
      ],

      data5: [
        {
          name: "Это не похоже на стол",
          x: [0, 5, 10],
          y: [0, 1, 0]
        },
        {
          name: "Лучше не садиться, но если очень хочется...",
          x: [7, 14, 23],
          y: [0, 1, 0]
        },
        {
          name: "Для аккуратного ребенка",
          x: [18, 28, 35],
          y: [0, 1, 0]
        },
        {
          name: "Для подростка",
          x: [30, 40, 50, 60],
          y: [0, 1, 1, 0]
        },
        {
          name: "Для взрослого",
          x: [53, 65, 80, 85],
          y: [0, 1, 1, 0]
        },
        {
          name: "Для компании друзей",
          x: [78, 92, 100],
          y: [0, 1, 1]
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
// Стили css (почти, с препроцессором)

$accent: #0099ff;

.task {
  line-height: 200%;

  &__chart {
    width: 100%;
    height: 350px;
  }

  &__subtitle {
    color: $accent;
  }
}
</style>
