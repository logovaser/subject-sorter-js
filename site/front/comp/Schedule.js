/**
 * Created by logov on 07-Mar-17.
 */

import './schedule.less'
import './schedule-table.less'
import Helpers from '../helpers'

export default ['dataFactory', function (dataFactory) {

    function replaceObject(obj, replaceWith) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                delete obj[key];
            }
        }
        angular.extend(obj, replaceWith);
    }

    let copySelectedLesson = grid => {
        let selectedLesson = false;
        grid.forEach(row => {
            row.forEach(item => {
                if (item.isSelected) selectedLesson = item.lesson;
            })
        });
        return selectedLesson;
    };

    let pasteIntoSelectedLesson = (grid, lesson) => {
        if (!lesson) return;
        grid.forEach(row => {
            row.forEach(item => {
                if (item.isSelected) {
                    let number = item.lesson.number,
                        platoons = item.lesson.platoons;
                    replaceObject(item.lesson, lesson);
                    item.lesson.number = number;
                    item.lesson.platoons = platoons;
                }
            })
        });
    };

    let clearSelection = grid => {
        grid.forEach(row => row.forEach(item => item.isSelected = false))
    };

    let getAllLessonsFromGrid = grid => {
        let lessons = [];
        grid.forEach(row => {
            row.forEach(item => lessons.push(item.lesson))
        });
        return lessons;
    };

    let link = (scope, element, attributes) => {

        scope.lessons = dataFactory.getLessons(scope.date);
        scope.availablePlatoons = dataFactory.getPlatoons();
        scope.date_show = '';
        scope.buffer = {
            lesson: {}
        };
        scope.pairToAdd = 1;
        scope.platoonToAdd = false;

        scope.pairs = [];
        scope.platoons = [];

        for (let lesson of scope.lessons) {
            if (!scope.pairs.includes(lesson.number)) scope.pairs.push(lesson.number);

            lesson.platoons.forEach(platoon => {
                if (!scope.platoons.includes(platoon)) scope.platoons.push(platoon)
            });
        }

        function initGrid() {
            scope.pairs.sort((a, b) => a - b);
            scope.platoons.sort((a, b) => a.number - b.number);

            scope.grid = [];

            scope.pairs.forEach((pair, i) => {
                scope.grid[i] = [];
                scope.platoons.forEach((platoon, j) => {
                    let lesson = scope.lessons.find(lesson => lesson.platoons.includes(platoon) && lesson.number == pair);
                    if (!lesson) {
                        lesson = {
                            number: pair,
                            date: scope.date,
                            teachers: [],
                            platoons: [platoon],
                        };
                        dataFactory.addLesson(scope.date, lesson);
                    }
                    scope.grid[i][j] = {
                        lesson,
                        platoon,
                        isSelected: false
                    }
                });
            });
        }

        scope.$watch(scope.date, () => {
            let newDate = new Date(scope.date);
            scope.date_show = newDate.toLocaleDateString('ru');
            console.log(newDate.toLocaleDateString('ru'));
        });

        dataFactory.events.addEventListener('collectionChanged', () => {
            console.log('collectionChanged');
            initGrid();
        });

        initGrid();

        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey) {
                switch (e.key) {
                    case 'c':
                        let buffer = copySelectedLesson(scope.grid);
                        if (buffer) scope.buffer.lesson = buffer;
                        break;
                    case 'v':
                        pasteIntoSelectedLesson(scope.grid, scope.buffer.lesson);
                        break;
                }
            }
            scope.$apply();
        });

        scope.lessonClick = function (item) {
            let isSelected = item.isSelected;
            clearSelection(scope.grid);
            item.isSelected = !isSelected;
        };

        scope.addPair = function () {
            if (scope.pairs.includes(scope.pairToAdd)) alert('Ця пара вже додана');
            else if (scope.pairToAdd) {
                scope.pairs.push(scope.pairToAdd);
                initGrid();
            }
        };

        scope.addPlatoon = function () {
            if (scope.platoons.includes(scope.platoonToAdd)) alert('Цей взвод вже доданий');
            else if (scope.platoonToAdd) {
                scope.platoons.push(scope.platoonToAdd);
                initGrid();
            }
        };

        scope.delPair = function (pair) {
            scope.grid.forEach(row => {
                row.forEach(item => {
                    if (item.lesson.number == pair) dataFactory.delLesson(item.lesson)
                })
            });
            Helpers.remove(scope.pairs, pair);
            initGrid();
        };

        scope.delPlatoon = function (platoon) {
            scope.grid.forEach(row => {
                row.forEach(item => {
                    if (item.lesson.platoons.includes(platoon)) dataFactory.delLesson(item.lesson)
                })
            });
            Helpers.remove(scope.platoons, platoon);
            initGrid();
        };

        scope.delSchedule = function () {
            dataFactory.delDay(scope.date)
        };

        scope.btnSortClick = function () {
            // scope.btnSaveClick();
            dataFactory.sortLessons(scope.date)
        };

        scope.btnSaveClick = function () {
            getAllLessonsFromGrid(scope.grid).forEach(lesson => dataFactory.saveLesson(lesson))
        };
    };

    return {
        link: link,
        scope: {
            date: '='
        },
        restrict: 'E',
        templateUrl: 'comp/Schedule.html'
    }
}]
