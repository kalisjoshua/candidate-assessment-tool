import {useEffect} from "react"

import Head from "next/head"
import Link from "next/link"

import cycle from "modules/cycle"
import pubsubnub from "modules/pubsubnub"
import simpleSDK from "modules/simpleSDK"

import globalStyles from "styles/global"

const bff = simpleSDK("http://localhost:3000/api")
const channel = pubsubnub()
let polling = false
const reviewer = ((key = "reviewer") => ({
  get: () => localStorage.getItem(key),
  set: (val) => localStorage.setItem(key, val),
}))()

function Page ({Component}) {
  const title = "Candidate Assessment Tool"

  useEffect(() => {
    if (!reviewer.get()) {
      reviewer.set(Math.random().toString(36).slice(2)) // create reviewer ID
    }

    // persist reviewer ID in SDK
    bff.headers({
      "Content-Type": "application/json",
      "x-reviewer": reviewer.get(),
    })

    channel.pub("init") // let the page know it can begin making API requests
  }, ["just once"])

  channel.sub("polling", (href) => {
    if (!polling) {
      polling = true

      cycle(() => {
        bff.GET(href)
          .then(({summary}) => {
            if (summary) {
              channel.pub("summary", summary)
            }
          })
      }).start()
    }
  })

  return (
    <div className="container">
      <Head>
        <title>{title}</title>
      </Head>

      <header>
        <h1>{title}</h1>

        <nav>
          <ul>
            <li><Link href="/"><a>Home</a></Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <Component bff={bff} channel={channel}/>
      </main>

      <footer>
        <hr />
      </footer>

      <style jsx>{`
      .container {
        margin: 1ex;
      }
      `}</style>

      <style jsx global>{globalStyles}</style>
    </div>
  )
}

export default Page
