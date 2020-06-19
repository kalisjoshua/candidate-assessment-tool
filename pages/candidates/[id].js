// Name, Candidate
//
// Competence          Culture             Other...?
// * * * * *           * * * * *           * * * * *
//
// Notes                                           ^
// _________________________________________________
//
// Questions          [Competence] [Culture] [Other]
//
// 1. How?                              [Competence]
//
// Score: * * * * *
// Notes: __________________________________________
//
// 2. What?                                [Culture]
//
// Score: * * * * *
// Notes: __________________________________________
//
// 3. ...

const getAll = () => fetch('http://localhost:3000/api/candidates')
  .then((res) => res.json())

async function getStaticPaths () {
  const paths = (await getAll())
    .map(({href}) => href)

  return {paths, fallback: false}
}

async function getStaticProps ({params: {id}}) {
  const [candidate] = (await getAll())
    .filter(({href}) => href.split('/').includes(id))

  return {props: {candidate}}
}

function Candidate ({candidate}) {

  return (
    <fragment>
      <pre>{JSON.stringify(candidate, null, 4)}</pre>
      <style jsx>{``}</style>
    </fragment>
  )
}

export default Candidate

export {
  getStaticPaths,
  getStaticProps,
}
