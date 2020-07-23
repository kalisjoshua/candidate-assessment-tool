import {useEffect, useState} from "react"

import simpleSDK from "modules/simpleSDK"

const bff = simpleSDK("http://localhost:3000/api")
const reviewer = ((key = "reviewer") => ({
  get: () => localStorage.getItem(key),
  set: (val) => localStorage.setItem(key, val),
}))()

function Candidate ({candidate, ratings, topics}) {
  if (!candidate) return null

  // **** Topic > Situation > Question(s) **** //

  // this is a mess and I am sorry for my choices
  const reviewersRatings = Object.keys(topics)
    .reduce((acc, topic) => ({...acc, [topic]: topics[topic].reduce((a, [situation]) => ({...a, [situation]: 0}), {})}), {})

  // console.log(candidate)
  const [myRatings, setMyRatings] = useState(reviewersRatings)
  const topicToggles = Object.keys(topics)
    .reduce((acc, topic) => {
      const [state, set] = useState(false)

      acc[topic] = {
        get icon() {return `[ ${state ? "+" : "-"} ]`},
        get value() {return state},
        toggle() {set(!state)},
      }

      return acc
    }, {})

  useEffect(() => {
    document.title = `${candidate.name} - Candidate Assessment Tool`

    if (!reviewer.get()) {
      reviewer.set(Math.random().toString(36).slice(2))
    }

    if (candidate.evaluations?.[reviewer.get()]) {
      setMyRatings(candidate.evaluations[reviewer.get()])
    }
  })

  return (
    <fragment>
      <hr />

      <h2>{candidate.name}</h2>

      {Object.keys(topics)
        .map((topic) => (
          <section className="topic">
            <h3>{topicTogglerIcon(topicToggles[topic])} {topic}</h3>

            {topicToggles[topic].value && questions({
              list: topics[topic],
              myRatings: myRatings[topic],
              ratingsScale: ratings
                .map(({questions, score}) => ({score, text: questions})),
              submitRating: (situation, rating) => {
                const reset = rating === myRatings[topic][situation]

                const newState = {...myRatings}
                newState[topic][situation] = reset ? 0 : rating

                bff.put(candidate.href, {
                  body: {
                    reviewer: reviewer.get(),
                    scores: myRatings,
                  }
                })

                setMyRatings(newState)
              },
            })}

          </section>
        ))}

      <style jsx>{`
      `}</style>
    </fragment>
  )
}

async function getStaticPaths () {
  const paths = (await bff.get("/candidates"))
    .map(({href}) => href)

  return {paths, fallback: true}
}

async function getStaticProps ({params: {id}}) {
  const candidate = await bff.get(`/candidates/${id}`)
  const meta = await bff.get()

  delete meta.links

  return {props: (candidate ? {candidate, ...meta} : {...meta})}
}

function questions ({list, myRatings, ratingsScale, submitRating}) {

  return (
    <ol className="topics">
      {list
        .map(([situation, ...questions]) => (
          <li>
            {situation}
            {rating({
              myRating: myRatings[situation],
              ratingsScale,
              submitRating: (score) => submitRating(situation, score),
            })}

            <ul>
              {questions
                .map((text) => <li>{text}</li>)}
            </ul>
          </li>
        ))}

      <style jsx>{`
        .topics > li {
          margin: 0;
          padding: 2ex;
        }
        .topics > li:nth-child(2n+1) {
          background: rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </ol>
  )
}

function rating ({myRating, ratingsScale, situation, submitRating}) {

  return (
    <ol>
      {ratingsScale
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

function topicTogglerIcon ({icon, toggle}) {

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

export default Candidate
export {
  getStaticPaths,
  getStaticProps,
}
