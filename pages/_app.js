import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import Link from 'next/link'

import globalStyles from 'styles/global'

class Candidates extends App {
  render () {
    const {Component, pageProps} = this.props

    return (
      <div className="container">
        <Head>
          <title>Candidate Assessment Tool</title>
        </Head>

        <header>
          <h1>Candidate Assessment Tool</h1>

          <nav>
            <ul>
              <li><Link href="/"><a>Home</a></Link></li>
              <li><Link href="/api/test-data"><a>Load Test Data</a></Link></li>
            </ul>
          </nav>
        </header>

        <main>
          <Component {...pageProps} />
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
}

export default Candidates
