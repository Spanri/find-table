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
      <div v-for="(input, index) in variablesResult.inputs" :key="index">
        <h3>{{ input.name }}: {{ input.res.name }}</h3>
      </div>
    </div>
    <h3 v-else-if="isFirst">Нажмите на кнопку для подсчета.</h3>
    <h3 v-else>Похоже, что-то введено неправильно.</h3>
    <div class="home__degreeOfTruth">
      <div v-if="isSuccess">
        <h3>Правила с результатами:</h3>
        <p
          v-for="(rule, index) in rulesResult"
          :key="index"
          :style="{ fontWeight: indexResult == index ? 'bold' : 'normal' }"
        >
          Правило {{ index }}: {{ rule.inputs[0].name }} ({{
            rule.inputs[0].result
          }}) AND {{ rule.inputs[1].name }} ({{ rule.inputs[1].result }}) AND
          {{ rule.inputs[2].name }} ({{ rule.inputs[2].result }}) AND
          {{ rule.inputs[3].name }} ({{ rule.inputs[3].result }}) =>
          {{ rule.output.name }} ({{ rule.result }})
        </p>
      </div>
      <div v-else>
        <h3>Правила:</h3>
        <p v-for="(rule, index) in rules" :key="index">
          {{ index }}: {{ rule.inputs[0].name }} AND
          {{ rule.inputs[1].name }} AND {{ rule.inputs[2].name }} AND
          {{ rule.inputs[3].name }} =>
          {{ rule.output.name }}
        </p>
      </div>
    </div>
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
   * Здесь перечисляются переменные, которые используются "глобально"
   * для этого файла.
   */
  data() {
    return {
      ...config,
      result: {},
      rulesResult: [],
      indexResult: -1,
      variablesResult: [],
      isSuccess: false,
      isFirst: true
    };
  },

  methods: {
    getResult() {
      try {
        /**
         * Дефаззификация.
         * Для каждого правила посчитать его "результат", а потом
         * среди всех постепенно выбрать максимальный (метод последнего
         * максимума)
         */
        let res = { result: 0 };
        let k = false;

        this.rules.forEach((rule, index) => {
          rule.result = this.checkValue(rule, index);
          this.rules[index].result = rule.result;
          if (rule.result > res.result) {
            res = rule;
            // если вдруг правило не найдено, то останется false
            k = true;
            // для отображения жирным найденного правила
            this.indexResult = index;
          }
        });

        /**
         * Настроечный код, для правильного отображения данных
         */
        this.rulesResult = this.rules;
        for (let key = 0; key < 4; key += 1) {
          this.variables.inputs[key].fuzzyAreas.forEach(val => {
            const value = this.variables.inputs[key].value;
            if (
              value >= val.ranges[0] &&
              value <= val.ranges[val.ranges.length - 1]
            ) {
              this.variables.inputs[key].res = val;
            }
          });
        }
        this.variablesResult = this.variables;

        /**
         * Если нужного правила нет, выводим средний результат
         */
        if (!k) {
          this.result = {
            output: this.variables.outputs[0].fuzzyAreas[3]
          };
          this.result.result = 50;
          this.indexResult = -1;
        } else {
          this.result = res;
        }

        this.isFirst = true;
        this.isSuccess = true;
      } catch (e) {
        console.log(e);
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
    checkValue(rule, indexRule) {
      const data = [];

      rule.inputs.forEach((input, index) => {
        let value = this.variables.inputs[index].value;
        value = this.fuzzyValue(input.ranges, value);
        this.rules[indexRule].inputs[index].result = value;
        this.variables.inputs[index].result = value;
        data.push(value);
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
