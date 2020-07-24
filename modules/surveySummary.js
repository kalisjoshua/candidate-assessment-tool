const average = (ar) => ar.reduce((a, b) => a + b) / ar.length
const surveySummary = (survey) => summarize(merge(survey))

function merge (obj) {
    
  return Object.keys(obj)
    .reduce((acc, reviewer) => {

      Object.keys(obj[reviewer])
        .forEach((category) => {
          acc[category] = acc[category] || {}
          const review = obj[reviewer][category]

          Object.keys(review)
            .forEach((topic) => {
              const rating = review[topic]

              acc[category][topic] = acc[category][topic]
                ? [...acc[category][topic], rating]
                : [rating]
            })
        })

      return acc
    }, {})
}

function summarize (obj) {
    
  return Object.keys(obj)
    .reduce((acc, category) => {
      const ratings = Object.keys(obj[category])
        .map((topic) => {
          const ratings = obj[category][topic]
          
          return average(ratings)
        })

      return {...acc, [category]: average(ratings).toFixed(2)}
    }, {})
}

export default surveySummary
