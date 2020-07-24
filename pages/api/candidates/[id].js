import datastore from "modules/datastore"
import handlerFactory from "modules/handlerFactory"

const resource = "candidates"

export default handlerFactory({
  // returns a candidate
  GET: (req, res) => {
    const {query: {id}} = req
    const candidate = (datastore.get(resource) || [])
      .find((record) => record.id === id)

    if (!candidate) {
      res.status(404).json({message: "Candidate not found."})
    } else {
      candidate.links = [
        {href: `/${resource}/${id}`, methods: ["GET"], rels: ["canonical", "item", "self"]},
        {href: `/assessments/${id}`, methods: ["GET", "POST"], rels: ["describes", "item"]},
      ]

      res.status(200).json(candidate)
    }
  },
})
