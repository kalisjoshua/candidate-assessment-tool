import {useEffect, useState} from "react"

import cycle from "modules/cycle"
import simpleSDK from "modules/simpleSDK"

const bff = simpleSDK("http://localhost:3000/api")
const reviewer = ((key = "reviewer") => ({
  get: () => localStorage.getItem(key),
  set: (val) => localStorage.setItem(key, val),
}))()

function Candidate ({candidate, ratingScale, survey}) {
  if (!candidate) return null

  ratingScale = ratingScale
    .map(({questions, score}) => ({score, text: questions}))

  // **** survey = Category / Topic / Question **** //

  const assessmentsURL = candidate.links
    .find(({rels}) => rels.includes("describes"))?.href
  const categoryToggles = Object.keys(survey)
    .reduce((acc, topic) => {
      const [state, set] = useState(false)

      acc[topic] = {
        get icon() {return `[ ${state ? "+" : "-"} ]`},
        get value() {return state},
        toggle() {set(!state)},
      }

      return acc
    }, {})
  const [myRatings, setMyRatings] = useState({})
  const [summary, setSummary] = useState({})
  const summaryCylce = cycle(() => {
    bff.GET(assessmentsURL)
      .then(({summary}) => {
        if (summary) {
          setSummary(summary)
        }
      })
    
    return () => summaryCycle.stop()
  })

  useEffect(() => {
    document.title = `${candidate.name} - Candidate Assessment`

    if (!reviewer.get()) {
      reviewer.set(Math.random().toString(36).slice(2))
    }

    bff.headers({
      "x-reviewer": reviewer.get(),
    })

    bff.GET(assessmentsURL)
      .then((assessmentSummary) => {
        if (assessmentSummary[reviewer.get()]) {
          setMyRatings(assessmentSummary[reviewer.get()])
        }

        summaryCylce.start()
      })
  }, ["only run this effect once per app/page load; don't check any props for changes"])

  return (
    <fragment>
      <hr />

      <h2>{candidate.name}</h2>

      {Object.keys(survey)
        .map((category, key) => (
          <section key={key}>
            <h3>{categoryTogglerIcon(categoryToggles[category])} {category}
              <span>{summary[category]}</span>
            </h3>

            {categoryToggles[category].value && questions({
              myRatings: myRatings[category],
              ratingScale,
              submitRating: (topic, rating) => {
                const reset = rating === myRatings?.[category]?.[topic]

                const body = {...myRatings}

                body[category] = {
                  ...body[category],
                  [topic]: reset ? 0 : rating,
                }

                summaryCylce.delay()

                bff.POST(assessmentsURL, {body})
                  .then(({summary}) => {
                    console.log(summary)
                    setSummary(summary)
                  })

                setMyRatings(body)
              },
              topics: survey[category],
            })}

          </section>
        ))}

      <style jsx>{`
      h3 span {
        float: right;
      }
      `}</style>
    </fragment>
  )
}

function categoryTogglerIcon({ icon, toggle }) {

  return (
    <span onClick={toggle}>
      {icon}
      <style jsx>{`
        span {
          cursor: pointer;
          transition: 300ms;
          user-select: none;
        }
        span:hover {
          background: cornflowerBlue;
        }
      `}</style>
    </span>
  )
}

async function getStaticPaths () {
  const paths = (await bff.GET("/candidates"))
    .map(({href}) => href)

  return {paths, fallback: true}
}

async function getStaticProps ({params: {id}}) {
  const candidate = await bff.GET(`/candidates/${id}`)
  const meta = await bff.GET()

  delete meta.links

  return {props: (candidate ? {candidate, ...meta} : {...meta})}
}

function questions ({myRatings, ratingScale, submitRating, topics}) {

  return (
    <ol>
      {Object.keys(topics)
        .map((topic) => (
          <li>
            {topic}
            {rating({
              myRating: myRatings?.[topic],
              ratingScale,
              submitRating: (score) => submitRating(topic, score),
            })}

            <ul>{topics[topic].map((text) => <li>{text}</li>)}</ul>
          </li>
        ))}

      <style jsx>{`
        ol > li {
          margin: 0;
          padding: 2ex;
        }
        ol > li:nth-child(2n+1) {
          background: rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </ol>
  )
}

function rating ({myRating, ratingScale, submitRating}) {

  return (
    <ol>
      {ratingScale
        .map(({score, text}) => (
          <li onClick={() => submitRating(score)} title={text}>
            {myRating && myRating >= score ? "★" : "☆"}
          </li>
        ))}

      <style jsx>{`
        ol {
          float: right;
          font-size: 150%;
        }
        ol:before {
          content: "${myRating || "0"}";
          padding: 0 1ex;
        }
        li {
          border-radius: 3px;
          cursor: pointer;
          display: inline;
          line-height: 0;
          margin: 0;
          padding: .75ex .5ex .25ex;
          user-select: none;
        }
        li + li {
          margin-left: 1ex;
        }
        li:hover {
          transition: 300ms;
        }
        li:nth-of-type(1):hover {background: red;}
        li:nth-of-type(2):hover {background: orange;}
        li:nth-of-type(3):hover {background: blue;}
        li:nth-of-type(4):hover {background: green;}
      `}</style>
    </ol>
  )
}

export default Candidate
export {
  getStaticPaths,
  getStaticProps,
}
