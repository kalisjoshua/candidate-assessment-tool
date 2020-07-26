import {Fragment, useEffect, useState} from 'react'

import Link from 'next/link'

function Index ({bff, channel}) {
  const [candidates, updateCandidates] = useState([])

  useEffect(() => {
    channel
      .sub("init", ({links}) => {
        const url = links
          .find(({rels}) => rels.includes("collection"))?.href

        bff.GET(url).then(updateCandidates)
      })
  }, ["static"])

  return (
    <Fragment>
      <p>Competencies are areas we would like to evaluate candidates in. You are being asked to give your opinion on their skill level or level of understanding in each area. Questions are available for each Competency but are only a suggestion of a series of questions to ask. Feel free to diverge from the questions as necessary to form an opinion. Competencies are meant to be an aggregate of all opinions formed from the candidate's responses (both verbal and physical). Scoring of Competencies is required (very helpful) however scoring of individual questions is primarily for your own reference; notes are also optional per question and in general.</p>

      {candidates.length
        ? <List candidates={candidates} />
        : <p>Loading candidates...</p>}
    </Fragment>
  )
}

function List ({candidates}) {

  return (
    <ul>
      {candidates.map(({href, name}) => (
        <li key={href}>
          <Link as={href} href={href}>
            <a>{name}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Index
