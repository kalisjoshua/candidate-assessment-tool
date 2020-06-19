import datastore from 'modules/datastore'
import factory from 'modules/handlerFactory'

const resource = 'candidates'

export default factory({
  // removes a candidate from the listing
  // DELETE: (req, res) => {},

  // returns a "hash" header value indicating wether or
  // not the record has changed since last viewing it
  // ---
  // this is where websockets would be much nicer in an actual solution
  HEAD: (req, res) => {},

  // returns a candidate
  GET: (req, res) => {
    const data = datastore.get(resource) || []
    const {query: {id}} = req

    const found = data.filter((rec) => rec.id === id)[0]

    // summary of responses from interviewers
    // did all interviewers give responses to all of the candidate's responses
    // has interviewer evaluated all aspects of the candidate we care about
    // questions are in groupings of competencies but only to help the interviewer make a judgement

    found
      ? res.status(200).json(found)
      : res.status(404).json({message: 'Candidate not found.'})
  },

  // adds interviewers evaluations and comments
  // for the candidates responses to questions
  PUT: (req, res) => {},
})
