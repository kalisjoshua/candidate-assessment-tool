import {Fragment, useState, useEffect} from "react"

// **** survey = Category / Topic / Question **** //

function Candidate ({bff, candidate, channel}) {
  const {href, name, ratingScale, survey} = candidate
  const [assessment, setAssessment] = useState(candidate.assessment || {})
  const [summary, setSummary] = useState(candidate.summary || {})
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

  channel.pub("polling", href)
  channel.sub("summary", setSummary)

  useEffect(() => {
    document.title = `${name} - Candidate Assessment`
  }, ["name"])

  return (
    <Fragment>
      <hr />
      <h2>{name}</h2>
      
      {Object.keys(survey)
        .map((category, key) => (
          <section key={key}>
            <h3>{categoryTogglerIcon(categoryToggles[category])} {category}
              <span>{summary[category]}</span>
            </h3>

            {categoryToggles[category].value && questions({
              assessment: assessment[category],
              ratingScale,
              submitRating: (topic, rating) => {
                const body = {...assessment}
                const reset = rating === assessment?.[category]?.[topic]

                body[category] = body[category] || {}
                body[category][topic] = reset ? 0 : rating

                bff.PATCH(href, {body}).then(setSummary)

                setAssessment(body)
              },
              topics: survey[category],
            })}

            <style jsx>{`
            h3 span {
              float: right;
            }
            `}</style>
          </section>
        ))}
    </Fragment>
  )
}

function categoryTogglerIcon({icon, toggle}) {

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

function questions ({assessment, ratingScale, submitRating, topics}) {

  return (
    <ol>
      {Object.keys(topics)
        .map((topic) => (
          <li>
            {topic}
            {rating({
              myRating: assessment?.[topic],
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

function Page ({bff, channel}) {
  const [candidate, update] = useState(false)

  channel.sub("init", async () => {
    update(await bff.GET(location.pathname))
  })

  return candidate && (<Candidate {...{bff, candidate, channel}} />)
}

function rating ({myRating, ratingScale, submitRating}) {

  return (
    <ol>
      {ratingScale
        .map(({rating, text}) => (
          <li onClick={() => submitRating(rating)} title={text}>
            {myRating && myRating >= rating ? "★" : "☆"}
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

export default Page
