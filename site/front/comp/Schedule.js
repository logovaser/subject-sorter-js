/**
 * Created by logov on 07-Mar-17.
 */

import './schedule.less'
import './schedule-table.less'
import Helpers from '../helpers'

export default ['dataFactory', '$uibModal', function (dataFactory, $uibModal) {

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
            row.lessons.forEach(item => {
                if (item.isSelected) selectedLesson = item.lesson;
            })
        });
        return selectedLesson;
    };

    let pasteIntoSelectedLesson = (grid, lesson) => {
        if (!lesson) return;
        grid.forEach(row => {
            row.lessons.forEach(item => {
                if (item.isSelected) {
                    let id = item.lesson.id,
                        number = item.lesson.number,
                        platoons = item.lesson.platoons;
                    replaceObject(item.lesson, lesson);
                    item.lesson.id = id;
                    item.lesson.number = number;
                    item.lesson.platoons = platoons;
                }
            })
        });
    };

    let clearSelection = grid => {
        grid.forEach(row => row.lessons.forEach(item => item.isSelected = false))
    };

    let getAllLessonsFromGrid = grid => {
        let lessons = [];
        grid.forEach(row => {
            row.lessons.forEach(item => lessons.push(item.lesson))
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

        scope.pairs = [1, 2, 3, 4];
        scope.platoons = [];

        let lessonModal;

        scope.menuOptions = [
            ['Редагувати', function ($itemScope, $event, modelValue, text, $li) {
                lessonModal = $uibModal.open({
                    templateUrl: 'comp/LessonPopup.html',
                    controller: 'lessonPopupCtrl',
                    resolve: {lesson: () => $itemScope.item.lesson}
                });
            }],
            ['Копіювати', function ($itemScope, $event, modelValue, text, $li) {
                let buffer = copySelectedLesson(scope.grid);
                if (buffer) dataFactory.setBuffer(buffer);
            }],
            ['Вставити', function ($itemScope, $event, modelValue, text, $li) {
                pasteIntoSelectedLesson(scope.grid, dataFactory.getBuffer())
            }],
            ['Видалити', function ($itemScope, $event, modelValue, text, $li) {
                if (confirm('Ви впевнені?')) {
                    scope.delLesson($itemScope.item.lesson)
                }
            }],
        ];

        function initPlatoons() {
            let days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            let weekday = days[new Date(scope.date * 1000).getDay()];
            dataFactory.getPlatoons().forEach(platoon => {
                if (weekday === platoon.study_day) scope.platoons.push(platoon)
            })
        }

        initPlatoons();

        for (let lesson of scope.lessons) {
            if (!scope.pairs.includes(lesson.number)) scope.pairs.push(lesson.number);

            lesson.platoons.forEach(platoon => {
                if (!scope.platoons.includes(platoon)) scope.platoons.push(platoon)
            });
        }

        function initGrid() {
            scope.lessons = dataFactory.getLessons(scope.date);
            scope.pairs.sort((a, b) => a - b);
            scope.platoons.sort((a, b) => a.number - b.number);

            scope.grid = [];

            scope.pairs.forEach((pair, i) => {
                scope.grid[i] = {
                    number: pair,
                    lessons: []
                };
                scope.platoons.forEach((platoon, j) => {
                    let lesson = scope.lessons.find(lesson => {
                        return lesson.platoons.find(plat => plat.number == platoon.number && lesson.number == pair)
                    });
                    if (!lesson) {
                        lesson = {
                            number: pair,
                            date: scope.date,
                            teachers: [],
                            platoons: [platoon],
                        };
                        dataFactory.addLesson(scope.date, lesson).then(() => {
                        }, () => {
                            throw 'failed to add lesson';
                        });
                    }
                    scope.grid[i].lessons[j] = {
                        lesson,
                        platoon,
                        isSelected: false
                    }
                });
            });
        }

        scope.$watch(scope.date, () => {
            let newDate = new Date(scope.date * 1000);
            scope.date_show = newDate.toLocaleDateString('ru');
        });

        dataFactory.events.addEventListener('collectionChanged', () => {
            console.log('initGrid on collectionChanged');
            initGrid();
        });

        dataFactory.events.addEventListener('selectionChanged', () => {
            clearSelection(scope.grid);
        });

        initGrid();

        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey) {
                switch (e.keyCode) {
                    case 67:
                        let buffer = copySelectedLesson(scope.grid);
                        if (buffer) dataFactory.setBuffer(buffer);
                        break;
                    case 86:
                        pasteIntoSelectedLesson(scope.grid, dataFactory.getBuffer());
                        break;
                }
            }
            scope.$apply();
        });

        scope.lessonClick = function (item) {
            dataFactory.clearSelection();
            item.isSelected = true;
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
                row.lessons.forEach(item => {
                    if (item.lesson.number == pair) dataFactory.delLesson(item.lesson)
                })
            });
            Helpers.remove(scope.pairs, pair);
            initGrid();
        };

        scope.delPlatoon = function (platoon) {
            scope.grid.forEach(row => {
                row.lessons.forEach(item => {
                    if (item.lesson.platoons.find(plat => plat.number == platoon.number)) {
                        dataFactory.delLesson(item.lesson)
                    }
                })
            });
            Helpers.remove(scope.platoons, platoon);
            initGrid();
        };

        scope.delSchedule = function () {
            dataFactory.delDay(scope.date)
        };

        scope.delLesson = function (lesson) {
            let tempLesson = {
                id: lesson.id,
                number: lesson.number,
                date: lesson.date,
                teachers: [],
                platoons: angular.copy(lesson.platoons),
            };
            angular.copy(tempLesson, lesson);
        };

        scope.btnSortClick = function () {
            scope.btnSaveClick().then(() => {
                let loadingModal = $uibModal.open({
                    templateUrl: 'comp/loadingModal.html',
                    backdrop: 'static',
                    keyboard: false
                });

                dataFactory.sortLessons(scope.date).then(() => loadingModal.close())
            })
        };

        scope.btnSaveClick = function () {

            let loadingModal = $uibModal.open({
                templateUrl: 'comp/loadingModal.html',
                backdrop: 'static',
                keyboard: false
            });

            let promises = [];
            getAllLessonsFromGrid(scope.grid).forEach(lesson => promises.push(dataFactory.saveLesson(lesson)));

            return new Promise(resolve => Promise.all(promises).then(() => {
                loadingModal.close();
                resolve();
            }))
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
