import {candidates} from './candidates'
import datastore from 'modules/datastore'
import factory from 'modules/handlerFactory'

const links = [
  {
    href: '/candidates',
    title: 'Candidates',
  }
]

export default factory({
  // returns a list of all candidates
  GET: (req, res) => {
    const reducer = (acc, resource) => ({
      ...acc,
      [resource]: datastore.get(resource) || []
    })
    const root = ['competencies', 'questions', 'ratings']
      .reduce(reducer, {links})

    res.status(200).json(root)
  },
})
