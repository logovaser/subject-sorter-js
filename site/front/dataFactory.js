/**
 * Created by logov on 12-Mar-17.
 */

import $ from 'jquery'
import Helpers from './helpers'

export default ['$http', function ($http) {

    let baseUrl = 'http://192.168.1.10/app_dev.php';

    let data = {
        teachers: [],
        subjects: [],
        platoons: [],
        lesson_types: [],
        lessons: [],
        days: [],

        // teachers: [
        //     {
        //         id: '1',
        //         first_name: "name",
        //         middle_name: "middlename",
        //         surname: "Канюка",
        //         methodical_day: {"day": "monday"},
        //         subjects: [{"id": "2"},]
        //     },
        //     {
        //         id: '2',
        //         first_name: "name",
        //         middle_name: "middlename",
        //         surname: "Бєх",
        //         methodical_day: {"day": "monday"},
        //         subjects: [{"id": "2"},]
        //     },
        //     {
        //         id: '3',
        //         first_name: "name",
        //         middle_name: "middlename",
        //         surname: "Маркелов",
        //         methodical_day: {"day": "monday"},
        //         subjects: [{"id": "2"},]
        //     },
        // ],
        // subjects: [
        //     {id: '2', name: 'subject 1'}
        // ],
        // platoons: [
        //     {id: '1', number: '531'},
        //     {id: '2', number: '532'},
        //     {id: '3', number: '533'},
        //     {id: '4', number: '534'},
        //     {id: '5', number: '511'},
        // ],
        // lesson_types: [
        //     {id: '4', name: 'lesson_type 1'}
        // ],
        // days: [
        //     {
        //         date: Date.now(),
        //         lessons: [
        //             {
        //                 id: 1,
        //                 subject: 2,
        //                 number: 1,
        //                 type: 4,
        //                 teachers: [1],
        //                 platoons: [3],
        //                 room: 123,
        //                 topic: "тема 1",
        //                 date: Date.now(),
        //                 actual_teacher: 1
        //             },
        //             {
        //                 id: 1,
        //                 subject: 2,
        //                 number: 3,
        //                 type: 4,
        //                 teachers: [1],
        //                 platoons: [1],
        //                 room: 123,
        //                 topic: "тема 2",
        //                 date: Date.now(),
        //                 actual_teacher: 1
        //             },
        //             {
        //                 id: 1,
        //                 subject: 2,
        //                 number: 2,
        //                 type: 4,
        //                 teachers: [1],
        //                 platoons: [2],
        //                 room: 123,
        //                 topic: "тема 3",
        //                 date: Date.now(),
        //                 actual_teacher: 1
        //             },
        //         ]
        //     },
        //     {
        //         date: 1469433907836,
        //         lessons: [
        //             {
        //                 id: 4,
        //                 subject: 2,
        //                 number: 1,
        //                 type: 4,
        //                 teachers: [1],
        //                 platoons: [3],
        //                 room: 123,
        //                 topic: "тема 1",
        //                 date: 1469433907836,
        //                 actual_teacher: 1
        //             },
        //             {
        //                 id: 5,
        //                 subject: 2,
        //                 number: 3,
        //                 type: 4,
        //                 teachers: [1],
        //                 platoons: [1],
        //                 room: 123,
        //                 topic: "тема 2",
        //                 date: 1469433907836,
        //                 actual_teacher: 1
        //             },
        //             {
        //                 id: 6,
        //                 subject: 2,
        //                 number: 2,
        //                 type: 4,
        //                 teachers: [1],
        //                 platoons: [2],
        //                 room: 123,
        //                 topic: "тема 3",
        //                 date: 1469433907836,
        //                 actual_teacher: 1
        //             },
        //         ]
        //     },
        // ]
    };

    let events = document.createElement('div'),
        onCollectionChanged = new CustomEvent('collectionChanged');

    function getList(listName) {
        return $http.get(`${baseUrl}/${listName}/list`).then(jsonData => {
            angular.copy(jsonData.data[listName], data[listName]);
            events.dispatchEvent(onCollectionChanged);
        })
    }

    function getLessons(date) {
        return data.days.find(day => day.date == date).lessons;
    }

    function fetchLessonTypes() {
        return $http.get(`${baseUrl}/lessons/types/list`).then(jsonData => {
            angular.copy(jsonData.data.types, data.lesson_types);
            events.dispatchEvent(onCollectionChanged);
        })
    }

    function fetchDays(startDate, endDate) {
        let url = '';
        if (arguments.length == 1) url = `${baseUrl}/lessons?on_date=${startDate}`;
        else if (arguments.length == 2) url = `${baseUrl}/lessons?from_date=${startDate}&to_date=${endDate}`;
        else return;

        return $http.get(url).then(jsonData => {
            jsonData.data.forEach(day => day.date *= 1000);
            angular.copy(jsonData.data, data.days);
            events.dispatchEvent(onCollectionChanged);
        });
    }

    function addDay(date) {
        data.days.push({
            date: date,
            lessons: []
        })
    }

    function initLists() {
        getList('subjects');
        getList('platoons');
        getList('teachers');
        fetchLessonTypes();
    }

    initLists();

    function sortLessons(lessons) {
        return $http.post(`${baseUrl}/lessons/prediction`, lessons).then(jsonData => {
            data.lessons = jsonData;
            events.dispatchEvent(onCollectionChanged);
        });
    }

    function addLesson(date, lesson) {
        let lessons = getLessons(date);
        lessons.push(lesson);
        $.ajax(`${baseUrl}/lessons/add`, {
            type: 'POST',
            data: JSON.stringify(lesson),
            dataType: 'json',
        }).done(jsonData => lesson.id = jsonData.id);
    }

    function delLesson(lesson) {
        $http.delete(`${baseUrl}/lessons/remove/${lesson.id}`);
    }

    function delDay(date) {
        Helpers.remove(data.days, data.days.find(day => day.date == date));
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
        console.log('collectionChanged');
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

        sortLessons,

        addLesson,
        addDay,

        delLesson,
        delDay,

        events
    }
}]
