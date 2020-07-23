import datastore from "modules/datastore"
import handlerFactory from "modules/handlerFactory"

const resource = "candidates"

const getCandidate = (id) => (datastore.get(resource) || [])
  .filter((rec) => rec.id === id)[0]

export default handlerFactory({
  // removes a candidate from the listing
  // DELETE: (req, res) => {},

  // returns a "hash" header value indicating wether or
  // not the record has changed since last viewing it
  // ---
  // this is where websockets would be much nicer in an actual solution
  HEAD: (req, res) => {},

  // returns a candidate
  GET: (req, res) => {
    const {query: {id}} = req
    const item = getCandidate(id)

    item.href = `/${resource}/${item.id}`

    item.evaluations = datastore.get("evaluations")[id]
    throw new Error("only return evaluations/assessments for the user not for everyone")
    throw new Error("summarize the group responses per category")

    // summary of responses from interviewers
    // did all interviewers give responses to all of the candidate's responses
    // has interviewer evaluated all aspects of the candidate we care about
    // questions are in groupings of competencies but only to help the interviewer make a judgement

    item
      ? res.status(200).json(item)
      : res.status(404).json({message: "Candidate not found."})
  },

  // adds interviewers evaluations and comments
  // for the candidates responses to questions
  PUT: (req, res) => {
    const {query: {id}} = req
    const reviewer = req.headers?.["x-reviewer"]
    // console.log("PUT")

    if (!reviewer) {
      res.status(403).json({message: "Reviewer identity header not provided."})
    } else {
      const all = datastore.get("evaluations")

      all[id] = {
        ...all[id],
        [reviewer]: JSON.parse(req.body),
      }

      datastore.put("evaluations", all)

      res.status(200).json({})
    }
  },
})
