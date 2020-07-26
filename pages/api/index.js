import {candidates} from "./candidates"
import datastore from "modules/datastore"
import handlerFactory from "modules/handlerFactory"

const links = [
  {
    href: "/candidates",
    rels: ["canonical", "collection"],
    title: "Candidates",
  }
]
const reducer = (acc, resource) => ({
  ...acc,
  [resource]: datastore.get(resource) || []
})
const root = ["ratingScale", "survey"]
  .reduce(reducer, {links})

export default handlerFactory({
  GET: (req, res) => {
    res.status(200).json(root)
  },
})
