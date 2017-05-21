/**
 * Created by logov on 20-Mar-17.
 */

export default {
    teachers: [
        {
            id: '1',
            first_name: "name",
            middle_name: "middlename",
            surname: "Канюка",
            methodical_day: {"day": "monday"},
            subjects: [{"id": "2"},]
        },
        {
            id: '2',
            first_name: "name",
            middle_name: "middlename",
            surname: "Бєх",
            methodical_day: {"day": "monday"},
            subjects: [{"id": "2"},]
        },
        {
            id: '3',
            first_name: "name",
            middle_name: "middlename",
            surname: "Маркелов",
            methodical_day: {"day": "monday"},
            subjects: [{"id": "2"},]
        },
    ],
    subjects: [
        {id: '2', name: 'subject 1'}
    ],
    platoons: [
        {id: '1', number: '531'},
        {id: '2', number: '532'},
        {id: '3', number: '533'},
        {id: '4', number: '534'},
        {id: '5', number: '511'},
    ],
    lesson_types: [
        {id: '4', name: 'lesson_type 1'}
    ],
    days: [
        {
            date: Date.now(),
            lessons: [
                {
                    id: 1,
                    subject: 2,
                    number: 1,
                    type: 4,
                    teachers: [1],
                    platoons: [3],
                    room: 123,
                    topic: "тема 1",
                    date: Date.now(),
                    actual_teacher: 1
                },
                {
                    id: 2,
                    subject: 2,
                    number: 3,
                    type: 4,
                    teachers: [1],
                    platoons: [1],
                    room: 123,
                    topic: "тема 2",
                    date: Date.now(),
                    actual_teacher: 1
                },
                {
                    id: 3,
                    subject: 2,
                    number: 2,
                    type: 4,
                    teachers: [1],
                    platoons: [2],
                    room: 123,
                    topic: "тема 3",
                    date: Date.now(),
                    actual_teacher: 1
                },
            ]
        },
        {
            date: 1469433907836,
            lessons: [
                {
                    id: 4,
                    subject: 2,
                    number: 1,
                    type: 4,
                    teachers: [1],
                    platoons: [3],
                    room: 123,
                    topic: "тема 4",
                    date: 1469433907836,
                    actual_teacher: 1
                },
                {
                    id: 5,
                    subject: 2,
                    number: 3,
                    type: 4,
                    teachers: [1],
                    platoons: [1],
                    room: 123,
                    topic: "тема 2",
                    date: 1469433907836,
                    actual_teacher: 1
                },
                {
                    id: 6,
                    subject: 2,
                    number: 2,
                    type: 4,
                    teachers: [1],
                    platoons: [2],
                    room: 123,
                    topic: "тема 3",
                    date: 1469433907836,
                    actual_teacher: 1
                },
            ]
        },
    ]
}
