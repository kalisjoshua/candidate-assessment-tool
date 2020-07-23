import {candidates} from "./candidates"
import datastore from "modules/datastore"
import factory from "modules/handlerFactory"

const links = [
  {
    href: "/candidates",
    title: "Candidates",
  }
]
const reducer = (acc, resource) => ({
  ...acc,
  [resource]: datastore.get(resource) || []
})
const root = ["competencies", "ratingScale", "survey"]
  .reduce(reducer, {links})

export default factory({
  GET: (req, res) => {
    res.status(200).json(root)
  },
})
