/**
 * Created by logov on 12-Mar-17.
 */

import Helpers from './helpers'

export default ['$http', '$uibModal', function ($http, $uibModal) {

    // let baseUrl = 'http://192.168.1.111:8088';
    let baseUrl = 'http://8c0bf3d5.ngrok.io/app.php';

    let data = {
        teachers: [],
        subjects: [],
        platoons: [],
        lesson_types: [],
        lessons: [],
        days: [],
        buffer: {},
    };

    let events = document.createElement('div'),
        onSelectionChanged = new CustomEvent('selectionChanged'),
        onCollectionChanged = new CustomEvent('collectionChanged');

    function getList(listName) {
        return $http.get(`${baseUrl}/${listName}/list`).then(res => {
            angular.copy(res.data[listName], data[listName]);
            events.dispatchEvent(onCollectionChanged);
        })
    }

    function getLessons(date) {
        return data.days.find(day => day.date == date).lessons;
    }

    function fetchLessonTypes() {
        return $http.get(`${baseUrl}/lessons/types/list`).then(res => {
            angular.copy(res.data.types, data.lesson_types);
            events.dispatchEvent(onCollectionChanged);
        })
    }

    function fetchDays(startDate, endDate) {
        let url = '';
        if (arguments.length == 1) url = `${baseUrl}/lessons?on_date=${startDate}`;
        else if (arguments.length == 2) url = `${baseUrl}/lessons?from_date=${startDate}&to_date=${endDate}`;
        else return;

        return $http.get(url).then(jsonData => {
            jsonData.data.forEach(day => day.date);
            angular.copy(jsonData.data, data.days);
            events.dispatchEvent(onCollectionChanged);
        });
    }

    function checkIfHasLessons(startDate, endDate) {
        let url = '';
        if (arguments.length == 1) url = `${baseUrl}/lessons?on_date=${startDate}`;
        else if (arguments.length == 2) url = `${baseUrl}/lessons?from_date=${startDate}&to_date=${endDate}`;
        else return;

        return new Promise((resolve, reject) => {
            $http.get(url).then(jsonData => {
                jsonData.data.forEach(day => {
                    if (day['lessons'] || [].length > 0) reject()
                });
                resolve();
            });
        });
    }

    function addDay(date) {
        data.days.push({
            date: date,
            lessons: []
        })
    }

    function initLists() {
        let loadingModal = $uibModal.open({
            templateUrl: 'comp/loadingModal.html',
            backdrop: 'static',
            keyboard: false
        });

        let promises = [
            getList('subjects'),
            getList('platoons'),
            getList('teachers'),
            fetchLessonTypes()
        ];

        Promise.all(promises).then(() => loadingModal.close());
    }

    initLists();

    function sortLessons(date) {
        let day = data.days.find(day => day.date == date);
        let lessons = day.lessons;
        let tempLessons = lessons.map(lesson => lesson.id);

        return $http({
            url: `${baseUrl}/lessons/prediction`,
            method: 'POST',
            data: JSON.stringify(tempLessons),
            headers: {'Content-Type': 'text/plain'}
        }).then(jsonData => {
            // angular.extend(day.lessons, jsonData.data.lessons);
            jsonData.data.lessons.forEach(lesson => {
                day.lessons.forEach(lesson2 => {
                    if (lesson2.id == lesson.id) {
                        angular.copy(lesson, lesson2)
                    }
                })
            });
            events.dispatchEvent(onCollectionChanged);
        });
    }

    function addLesson(date, lesson) {
        let lessons = getLessons(date);
        lessons.push(lesson);
        let tempLesson = angular.copy(lesson);
        return $http({
            url: `${baseUrl}/lessons/add`,
            method: 'POST',
            data: JSON.stringify(tempLesson),
            headers: {'Content-Type': 'text/plain'}
        }).then(jsonData => {
            lesson.id = jsonData.data.id
        });
    }

    function saveLesson(lesson) {
        let tempLesson = angular.copy(lesson);
        tempLesson.teachers.forEach(teacher => teacher.subjects = teacher.subjects.map(subject => {
            return {id: subject.id}
        }));
        if (tempLesson.actual_teacher) tempLesson.actual_teacher.subjects = tempLesson.actual_teacher.subjects.map(subject => {
            return {id: subject.id}
        });
        return $http({
            url: `${baseUrl}/lessons/save`,
            method: 'POST',
            data: JSON.stringify(tempLesson),
            headers: {'Content-Type': 'text/plain'}
        });
    }

    function delLesson(lesson) {
        $http.delete(`${baseUrl}/lessons/remove/${lesson.id}`);
    }

    function delDay(date) {
        Helpers.remove(data.days, data.days.find(day => day.date == date));
    }

    function delAllDays() {
        data.days = [];
        events.dispatchEvent(onCollectionChanged);
    }

    function parseLessons(d) {
        let idTypes = ['string', 'number'];
        for (let day of d.days)
            for (let lesson of day.lessons) {
                lesson.teachers.forEach((teacher_id, i) => {
                    if (idTypes.includes(typeof teacher_id))
                        lesson.teachers[i] = d.teachers.find(teacher => teacher.id == teacher_id)
                });
                lesson.platoons.forEach((platoon_id, i) => {
                    if (idTypes.includes(typeof platoon_id))
                        lesson.platoons[i] = d.platoons.find(platoon => platoon.id == platoon_id)
                });
                if (idTypes.includes(typeof lesson.actual_teacher))
                    lesson.actual_teacher = d.teachers.find(teacher => teacher.id == lesson.actual_teacher);
                if (idTypes.includes(typeof lesson.type))
                    lesson.type = d.lesson_types.find(type => type.id == lesson.type);
                if (idTypes.includes(typeof lesson.subject))
                    lesson.subject = d.subjects.find(subject => subject.id == lesson.subject);
            }
    }

    events.addEventListener('collectionChanged', () => {
        console.log('parseLessons on collectionChanged', data);
        parseLessons(data)
    });

    parseLessons(data);

    return {
        getTeachers: () => data.teachers,
        getSubjects: () => data.subjects,
        getPlatoons: () => data.platoons,
        getLessonTypes: () => data.lesson_types,
        getLessons,
        getDays: () => data.days,

        fetchTeachers: () => getList('teachers'),
        fetchSubjects: () => getList('subjects'),
        fetchPlatoons: () => getList('platoons'),
        fetchLessonTypes,
        fetchDays,

        checkIfHasLessons,

        sortLessons,
        saveLesson,

        addLesson,
        addDay,

        delLesson,
        delDay,
        delAllDays,

        getBuffer: () => data.buffer,
        setBuffer: buffer => data.buffer = buffer,

        events,
        clearSelection: () => events.dispatchEvent(onSelectionChanged)
    }
}]
