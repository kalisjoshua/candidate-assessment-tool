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

/*
  The data from the API can provide how many people have responded as an indicator
  to the user of how many people have made a decision without divulging what their
  decision actually is. Then, once the user submits their score they would be able
  to see the aggregate score of everyone.

  The number of users who have responded could "fill up" the background of the
  group score indicator.
  {
    ratings: {
      "Communication": {
        respondants: 4,
        score: 1.25,
      },
      "Teamwork": {
        respondants: 4,
        score: 1.25,
      },
      "Emotional Inteligence": {
        respondants: 4,
        score: 1.25,
      },
      "Coachability": {
        respondants: 4,
        score: 1.25,
      },
      "Initiative": {
        respondants: 4,
        score: 1.25,
      },
      "Professional Development": {
        respondants: 4,
        score: 1.25,
      },
      "Critical Thinking": {
        respondants: 4,
        score: 1.25,
      },
      "Time Management": {
        respondants: 4,
        score: 1.25,
      },
    }
  }
*/

function Candidate ({candidate, questions, ratings, themes}) {
  const ratingsForThemes = {
    group: candidate.ratings,
    scale: ratings,
  }

  useEffect(() => {
    document.title = `${candidate.name} - Candidate Assessment Tool`
  })

  if (!candidate) {

    return null
  } else {

    return (
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

        <ol>
          {questions
            .map(({followups, theme, title}, i) => (
              <li key={i}>
                {title}
                <em style={{float: "right"}}>[{theme}]</em>
                <ul>
                  {followups.map((question) => <li key="question">{question}</li>)}
                </ul>
              </li>
            ))
          }
        </ol>

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
  }
}

function Rating (props) {
  const {disabled, scale, value} = props
  const isSelected = (score) => value >= +score
    ? "selected"
    : ""

  return (
    <ul className={`rating `}>
      {scale.map(({score}) => <li className={isSelected(score)} key={score} title={score} />)}

      <style jsx>{`
        .rating {
          background: ${disabled ? 'gainsboro' : 'transparent'};
          border-radius: 5px;
          display: flex;
          justify-content: space-evenly;
          margin: 0;
          padding: 3px 2ex;
        }

        .rating li {
          cursor: pointer;
          list-style-type: none;
          margin: 0 1ex;
          padding: 0;
        }

        .rating li:before {
          content: "☆";
        }

        .rating li.selected:before {
          content: "★";
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
    <figure className="theme">
      <figcaption>
        <strong>{title}</strong>
        <span onClick={showToggle}>({show[0]} questions)</span>
      </figcaption>

      <section>
        <Rating scale={scale} value={group[title]} />
        <Rating disabled={true} scale={scale} value={group[title]} />
      </section>

      <style jsx>{`
        figcaption {
          display: flex;
        }

        figcaption strong {
          flex-grow: 1;
        }

        figcaption span {
          cursor: pointer;
          user-select: none;
        }

        section {
          display: flex;
          justify-content: space-between;
        }

        .theme {
          margin: 0 4ex;
          padding: 1ex 0 0;
        }

        .theme + .theme {
          border-top: 1px dashed rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </figure>
  )
}

export default Candidate
