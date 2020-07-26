import datastore from "modules/datastore"
import handlerFactory from "modules/handlerFactory"
import surveySummary from "modules/surveySummary"

const resource = "candidates"

export default handlerFactory({
  // returns a candidate
  GET (req, res) {
    const {id} = req.query
    const {name} = (datastore.get(resource) || [])
      .find((record) => record.id === id)

    if (!name) {
      res.status(404).json({message: "Candidate not found."})
    } else {
      const assessments = datastore.get("assessments")
      const reviewer = req.headers?.["x-reviewer"]
      const responseBody = {
        href: `/${resource}/${id}`,
        name,
        ratingScale: datastore.get("ratingScale")
          .map(({questions, score}) => ({rating: score, text: questions})),
        survey: datastore.get("survey"),
      }

      if (reviewer) {
        if (assessments[id]) {
          responseBody.summary = surveySummary(assessments[id])

          if (assessments[id][reviewer]) {
            responseBody.assessment = assessments[id][reviewer]
          }
        }
      }

      res.status(200).json(responseBody)
    }
  },

  // store a reviewer's assessment for a candidate
  PATCH (req, res) {
    const assessment = req.body
    const assessments = datastore.get("assessments")
    const {id} = req.query
    const reviewer = req.headers?.["x-reviewer"]

    if (!reviewer) {
      res.status(403).json({message: "Reviewer identity header not provided."})
    } else {
      const newData = {...assessments}

      newData[id] = newData[id] || {}

      newData[id][reviewer] = assessment
      datastore.put("assessments", newData)

      const summary = assessments[id]
        ? surveySummary(assessments[id])
        : {}

      res.status(200).json(summary)
    }
  }
})
