import {useEffect, useState} from 'react'

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

function Candidate ({candidate, questions, ratings, themes}) {
  // console.log({candidate, questions, ratings, themes})

  const ratingsForThemes = {
    group: candidate.ratings,
    // mine:
    scale: ratings,
  }

  useEffect(() => {
    document.title = `${candidate.name} - Candidate Assessment Tool`
  })

  return candidate
    ? (
      <fragment>
        <h2>{candidate.name}</h2>

        <hr />

        <h3>Theme Ratings</h3>

        <ul className="theme-ratings">
          {themes.map((title, i) => (
            <Theme key={`${title}-${i}`} ratings={ratingsForThemes} title={title}/>
          ))}
        </ul>

        <hr />

        <h3>Questions</h3>

        <ul>
          {questions.map(({title}, i) => <li key={i}>{title}</li>)}
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
          .theme-ratings {
            margin: 0;
            padding: 0;
          }
        `}</style>

        {/*
        Name, Candidate

        ~~~~~~~~~~~~~~~~~~~~~ Themes ~~~~~~~~~~~~~~~~~~~~

        Communication                              (show)
        * * * * *                               * * * * *
        Teamwork                                   (show)
        * * * * *                               * * * * *
        Emotional Intelligence                     (hide)
        * * * * *                               * * * * *
        Coachability                               (show)
        * * * * *                               * * * * *
        Initiative                                 (show)
        * * * * *                               * * * * *
        Professional Development                   (show)
        * * * * *                               * * * * *
        Critical Thinking                          (show)
        * * * * *                               * * * * *
        Time Management                            (show)
        * * * * *                               * * * * *

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

function Rating (props) {
  const {disabled, scale, value} = props

  return (
    <ul className={`rating `}>
      {scale.map(({score}) => <li key={score}>{score}</li>)}

      <style jsx>{`
        .rating {
          background: ${disabled ? 'gainsboro' : 'transparent'};
          margin: 0;
          padding: 0;
        }

        .rating li {
          display: inline;
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </ul>
  )
}

function Theme ({ratings: {group = {}, scale}, title}) {
  const [show, setShow] = useState(['hide', 'show'])
  const showToggle = () => {
    const [a, b] = show
    setShow([b, a])
    
  }

  return (
    <figure>
      <figcaption>
        <strong>{title}</strong>
        <span onClick={showToggle}>({show[0]})</span>
      </figcaption>
      <Rating scale={scale} value={group[title]} />
      <Rating disabled={true} scale={scale} value={group[title]} />
    </figure>
  )
}

export default Candidate
