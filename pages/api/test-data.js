import datastore from 'modules/datastore'
import factory from 'modules/handlerFactory'
import nid from 'modules/nid'

export default factory({
  // load all test data
  // yes, I am fully aware that this is an abuse of GET
  GET: (req, res) => {
    datastore.put('candidates', [
      'Reynolds, Malcolm',
      'Washburne, Zoe',
      'Washburne, Hoban',
      'Serra, Inara',
      'Cobb, Jayne',
      'Frye, Kaylee',
      'Tam, Simon',
      'Tam, River',
      'Book, Derrial "Shepherd"',
      'Early, Jubal',
    ].sort().map((name) => ({id: nid(), name})))

    datastore.put('competencies', [
      'Competence',
      'Culture',
    ])

    datastore.put('questions', [
      'How?',
      'What?',
      'When?',
      'Why?',
    ])

    datastore.put('ratings', [
      {
        competencies: 'I would not want to work with this person in any context.',
        questions: 'I was put off by their response.',
        score: -2,
      },
      {
        competencies: 'I would not want this person on my team.',
        questions: 'I don\'t think their response was very good.',
        score: -1,
      },
      {
        competencies: 'I have no feelings - for or against - about this person joining our team.',
        questions: 'I have no reaction to their response.',
        score: 0,
      },
      {
        competencies: 'I think this person would fit somewhere within our organization.',
        questions: 'I think their response was ok.',
        score: 1,
      },
      {
        competencies: 'I want this person on my team.',
        questions: 'I am very impressed with the response.',
        score: 2,
      },
    ])

    res.status(200).json(datastore.all())
  },
})
