import datastore from "modules/datastore"
import handlerFactory from "modules/handlerFactory"
import surveySummary from "modules/surveySummary"

const resource = "assessments"

function buildSummary (id, assessments, reviewer) {

  return {
    links: [
      {href: `/${resource}/${id}`, rels: ["item", "self"]},
      {href: `/candidates/${id}`, rels: ["canonical", "describedBy", "item"]},
    ],
    [reviewer]: assessments[reviewer],
    summary: surveySummary(assessments),
  }
}

export default handlerFactory({
  // returns a assessments for a candidate
  GET: (req, res) => {
    const reviewer = req.headers?.["x-reviewer"]

    if (!reviewer) {
      res.status(403).json({message: "Reviewer identity header not provided."})
    } else {
      const {query: {id}} = req
      const assessments = datastore.get(resource)[id]
  
      assessments
        ? res.status(200).json(buildSummary(id, assessments, reviewer))
        : res.status(404).json({message: "Assessments not found."})
    }
  },

  // adds interviewer's assessment
  POST: (req, res) => {
    const reviewer = req.headers?.["x-reviewer"]

    if (!reviewer) {
      res.status(403).json({message: "Reviewer identity header not provided."})
    } else {
      const {query: {id}} = req
      const assessments = datastore.get(resource)

      assessments[id] = {
        ...assessments[id],
        [reviewer]: JSON.parse(req.body),
      }

      datastore.put(resource, assessments)

      res.status(200).json(buildSummary(id, assessments[id], reviewer))
    }
  },
})
