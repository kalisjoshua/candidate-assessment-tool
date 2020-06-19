import {Fragment} from 'react'
import Head from 'next/head'
import Link from 'next/link'

const candidate = ({href, name}) => (
  <li key={href}>
    <Link as={href} href={href}>
      <a>{name}</a>
    </Link>
  </li>
)

async function getStaticProps () {
  const all = await fetch('http://localhost:3000/api/candidates')
    .then((res) => res.json())

  return {props: {all}}
}

function Index ({all}) {

  return (
    <Fragment>
      <p>Competencies are areas we would like to evaluate candidates in. You are being asked to give your opinion on their skill level or level of understanding in each area. Questions are available for each Competency but are only a suggestion of a series of questions to ask. Feel free to diverge from the questions as necessary to form an opinion. Competencies are meant to be an aggregate of all opinions formed from the candidate's responses (both verbal and physical). Scoring of Competencies is required (very helpful) however scoring of individual questions is primarily for your own reference; notes are also optional per question and in general.</p>

      {all.length
        ? (<ul>{all.map(candidate)}</ul>)
        : null}

      <style jsx>{``}</style>
    </Fragment>
  )
}

export default Index

export {
  getStaticProps,
}
