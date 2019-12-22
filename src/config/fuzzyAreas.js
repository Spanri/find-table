/* eslint-disable prettier/prettier */

/**
 * Здесь описаны типы функций принадлежности - треугольная и трапециевидная
 * Для треугольной вводится 3 значения, для трапециевидной - 4
 * Что делают эти функции?
 * Для каждого нечеткого высказывания происходит фаззификация, то есть
 * определяется его степень истинности относительно valueParam.
 * Соответственно, возвращается число - степень истинности.
 */

export default {
    triangle: (rangesParam, valueParam) => {
        const ranges = rangesParam.map(range => parseInt(range, 10));
        const value = parseInt(valueParam, 10);
        if (value < ranges[0] || value > ranges[2]) return 0;
        if (value < ranges[1]) {
            return (value - ranges[0]) / (ranges[1] - ranges[0]);
        }
        return (ranges[2] - value) / (ranges[2] - ranges[1]);
    },

    trapezoid: (rangesParam, valueParam) => {
        const ranges = rangesParam.map(range => parseInt(range, 10));
        const value = parseInt(valueParam, 10);
        if (value < ranges[0] || value > ranges[3]) return 0;
        if (value < ranges[1])
            return (value - ranges[0]) / (ranges[1] - ranges[0]);
        else if (value < ranges[2]) return 1;
        return (ranges[3] - value) / (ranges[3] - ranges[2]);
    }
};