import {useEffect, useState} from 'react'

const hook = (a, [v, set] = useState(a)) => ({set, get value () {return v}})

const getAll = () => fetch('http://localhost:3000/api/candidates')
  .then((res) => res.json())

export async function getStaticPaths () {
  const paths = (await getAll())
    .map(({href}) => href)

  return {paths, fallback: true}
}

export async function getStaticProps ({params: {id}}) {
  const [candidate] = (await getAll())
    .filter(({href}) => href.split('/').includes(id))
  const meta = await fetch('http://localhost:3000/api')
    .then((res) => res.json())

  delete meta.links

  return {props: (candidate ? {candidate, ...meta} : {...meta})}
}

function Candidate ({candidate, questions, themes}) {
  useEffect(() => {
    document.title = `${candidate.name} - Candidate Assessment Tool`
  })

  return candidate
    ? (
      <fragment>
        <h2>{candidate.name}</h2>

        {false && <pre>{JSON.stringify(props, null, 4)}</pre>}

        <hr />

        <h3>Theme Ratings</h3>

        <ul className="theme-ratings">
          {themes.map((s) => <li>{s}</li>)}
        </ul>

        <hr />

        <h3>Questions</h3>

        <ul className="theme-filters">
          {themes.map((s) => <li>{s}</li>)}
        </ul>

        <ul>
          {questions.map(({title}) => <li>{title}</li>)}
        </ul>

        <hr />

        <h3>Overall Evaluation</h3>

        <h4>Competence</h4>
        <p>* * * * *</p>

        <h4>Culture</h4>
        <p>* * * * *</p>

        <h4>Notes</h4>

        <textarea />

        <button>Submit Evaluation</button>

        <style jsx>{`
          .theme-filters {
            margin: 0;
            padding: 0;
          }

          .theme-filters li {
            background: gainsboro;
            cursor: pointer;
            display: inline;
            line-height: 4ex;
            list-style-type: none;
            padding: 4px 1ex;
          }

          .theme-filters li + li {
            margin-left: 1ex;
          }
        `}</style>

        {/*
        Name, Candidate

        ~~~~~~~~~~~~~~~~~~~~~ Themes ~~~~~~~~~~~~~~~~~~~~

        poor good
        * * * * *    Communication              * * * * *
        * * * * *    Teamwork                   * * * * *
        * * * * *    Emotional Intelligence     * * * * *
        * * * * *    Coachability               * * * * *
        * * * * *    Initiative                 * * * * *
        * * * * *    Professional Development   * * * * *
        * * * * *    Critical Thinking          * * * * *
        * * * * *    Time Management            * * * * *

        ~~~~~~~~~~~~~~~~~~~ Questions ~~~~~~~~~~~~~~~~~~~

        [Communication] [Teamwork] [...]

        1. How?                              [Competence]

        Score: * * * * *
        Notes: __________________________________________

        2. What?                                [Culture]

        Score: * * * * *
        Notes: __________________________________________

        3. ...

        ~~~~~~~~~~~~~~~~~~~~ Overall ~~~~~~~~~~~~~~~~~~~~

        Competence                                Culture
        * * * * *                               * * * * *

        Notes                                           ^
        _________________________________________________

                                                   Submit
        */}
      </fragment>
    )
    : null
}

export default Candidate
