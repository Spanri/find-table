<template>
  <div class="home">
    <section id="variables">
      <h2 class="home__title">Задайте переменные:</h2>
      <form v-on:submit.prevent>
        <table>
          <tbody>
            <tr
              v-for="input in variables.inputs"
              class="variables__item variables__item-color"
              :key="input.name"
            >
              <td class="variables__name">
                {{ input.name }} от {{ input.fuzzyAreas[0].ranges[0] + 1 }} до
                {{
                  input.fuzzyAreas[input.fuzzyAreas.length - 1].ranges[
                    input.fuzzyAreas[input.fuzzyAreas.length - 1].ranges
                      .length - 1
                  ]
                }}
              </td>
              <td>
                <input
                  type="number"
                  :min="input.fuzzyAreas[0].ranges[0]"
                  :max="
                    input.fuzzyAreas[input.fuzzyAreas.length - 1].ranges[
                      input.fuzzyAreas[input.fuzzyAreas.length - 1].ranges
                        .length - 1
                    ]
                  "
                  v-model="input.value"
                  class="variables__input"
                />
              </td>
              <td class="variables__areas">
                <span
                  class="variables__area"
                  v-for="fuzzyArea in input.fuzzyAreas"
                  :key="fuzzyArea.name"
                >
                  {{
                    Math.round(
                      fuzzyValue(fuzzyArea.ranges, input.value) * 1000
                    ) / 1000
                  }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <h3>
        Справа показывается, к какому диапазону и насколько принадлежит
        значение.
      </h3>
    </section>

    <button class="button home__button" @click="getResult">ПОСЧИТАТЬ</button>

    <h1>Результат:</h1>
    <div v-if="isSuccess">
      <h3>Название правила: {{ result.output.name }}</h3>
      <h3>Результат: {{ result.result }}</h3>
      <h3>Диапазон: {{ result.output.ranges }}</h3>
      <div v-for="(input, index) in variables.inputs" :key="index">
        <h3>
          {{ input.name }}:
          {{ result.inputs[index] ? result.inputs[index].name : "" }}
        </h3>
      </div>
    </div>
    <h3 v-else-if="isFirst">Нажмите на кнопку для подсчета.</h3>
    <h3 v-else>Похоже, что-то введено неправильно.</h3>
  </div>
</template>

<script>
/**
 * Берем из файла ниже и применяем в этом файле:
 * variables - входные и выходные переменные
 * rules - правила
 * fuzzyAreas - для фаззификации нечетких значений
 */
import config from "@/config/index";

export default {
  name: "Home",

  /**
   * config из файла выше
   * в result записывается объект с результатом
   * isSuccess показывает результат, когда он подсчитан
   * isFirst тоже для этого
   */
  data() {
    return {
      ...config,
      result: "",
      isSuccess: false,
      isFirst: true
    };
  },

  methods: {
    getResult() {
      try {
        /**
         * Агрегирование
         */

        let accumulation = [[], [], [], [], [], []];

        this.rules.forEach(rule => {
          if (rule.output.name == "Это не похоже на стол") {
            accumulation[0].push(this.checkValue(rule));
          }
          if (
            rule.output.name == "Лучше не садиться, но если очень хочется..."
          ) {
            accumulation[1].push(this.checkValue(rule));
          }
          if (rule.output.name == "Для аккуратного ребенка") {
            accumulation[2].push(this.checkValue(rule));
          }
          if (rule.output.name == "Для подростка") {
            accumulation[3].push(this.checkValue(rule));
          }
          if (rule.output.name == "Для взрослого") {
            accumulation[4].push(this.checkValue(rule));
          }
          if (rule.output.name == "Для компании друзей") {
            accumulation[5].push(this.checkValue(rule));
          }
        });

        console.log();

        /**
         * Аккумулирование.
         * Для нашей выходной переменной необходимо определить
         * результирующую функцию принадлежности. Для этого
         * нужно объединить все функции принадлежности этой
         * выходной переменной.
         */

        /**
         * Заменяем массив из степеней истинности правил для i-го
         * значения выходной переменной на максимальную (max-объединение)
         * степень истинности из этого массива.
         */
        accumulation[0] = accumulation[0].reduce((next, prev) =>
          Math.max(next, prev)
        );
        accumulation[1] = accumulation[1].reduce((next, prev) =>
          Math.max(next, prev)
        );
        accumulation[2] = accumulation[2].reduce((next, prev) =>
          Math.max(next, prev)
        );
        accumulation[3] = accumulation[3].reduce((next, prev) =>
          Math.max(next, prev)
        );
        accumulation[4] = accumulation[4].reduce((next, prev) =>
          Math.max(next, prev)
        );
        accumulation[5] = accumulation[5].reduce((next, prev) =>
          Math.max(next, prev)
        );

        console.log(accumulation);

        // let res = { result: 0 };
        // /**
        //  * Для каждого правила посчитать его "результат", а потом
        //  * среди всех постепенно выбрать максимальный
        //  */
        // this.rules.forEach(rule => {
        //   rule.result = this.checkValue(rule);
        //   console.log(rule.result);
        //   if (rule.result > res.result) {
        //     res = rule;
        //   }
        // });
        // this.result = res;
        // this.isFirst = true;
        // this.isSuccess = true;
      } catch {
        this.isSuccess = false;
      }
    },

    /**
     * Агрегирование.
     * Подается правило с входными переменными.
     * Для каждой входной переменной берем её значение из поле ввода.
     * Фаззифицируем его и пушим результат в data.
     * В конце в data получаем что-то типа [ 0, 0.29, 0.66, 0 ] (если
     * входных переменных 4), а потом находим среди этого минимум (ибо
     * через AND). Это степень истинности правила.
     */
    checkValue(rule) {
      const data = [];

      rule.inputs.forEach((input, index) => {
        const value = this.variables.inputs[index].value;
        data.push(this.fuzzyValue(input.ranges, value));
      });

      const result = data.reduce((next, prev) => Math.min(next, prev));
      return result;
    },

    /**
     * Фаззификация.
     * Для каждой ФП запускается эта функция, она принимает
     * диапазон ФП и значение, которое введено в поле ввода для неё.
     * Функция считает степень истинности, возвращает число.
     */
    fuzzyValue(ranges, inputValue) {
      try {
        return ranges.length == 3
          ? this.fuzzyAreas.triangle(ranges, inputValue)
          : this.fuzzyAreas.trapezoid(ranges, inputValue);
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// Ниже стили css

$accent: #0099ff;
$accent-darker: #075488;
$white: white;

.button {
  color: $white;
  background: $accent;
  padding: 10px;
  width: min-content;
  font-size: 18px;
  border: 0;
  white-space: nowrap;

  &:hover {
    cursor: pointer;
    background: $accent-darker;
    transition: all 0.3s ease-out;
  }
}

.home {
  &__button {
    margin: 15px 0;
  }
}

.variables {
  &__name {
    padding-right: 15px;
    font-size: 16px;
    text-align: right;
    max-width: 200px;
  }

  &__input {
    width: 300px;
    height: 30px;
    margin-bottom: 10px;
    padding: 5px;
    font-size: 16px;
  }

  &__areas {
    min-width: 230px;
  }

  &__area {
    padding-left: 10px;
    text-align: left;
  }
}
</style>
