import fs from "fs"
import path from "path"

const location = path.join(process.cwd(), "db.json")
const store = JSON.parse(fs.readFileSync(location, "utf8"))

const persist = (data) => fs.writeFileSync(location, JSON.stringify(data), "utf8")

export default {
  get: (key) => store[key],
  put: (key, data) => {
    store[key] = data

    persist(store)

    return store[key]
  },
}

// *** TEST DATA *** //
if (false) {
  store["candidates"] = [
    {
        "id": "moaczk",
        "name": "Book, Derrial \"Shepherd\""
    },
    {
        "id": "h2t1ta",
        "name": "Cobb, Jayne"
    },
    {
        "id": "3sjmcd",
        "name": "Early, Jubal"
    },
    {
        "id": "w7loxg",
        "name": "Frye, Kaylee"
    },
    {
        "id": "5o7u2u",
        "name": "Reynolds, Malcolm"
    },
    {
        "id": "ibf8k5",
        "name": "Serra, Inara"
    },
    {
        "id": "qxzih1",
        "name": "Tam, River"
    },
    {
        "id": "biwgyi",
        "name": "Tam, Simon"
    },
    {
        "id": "syd3vp",
        "name": "Washburne, Hoban"
    },
    {
        "id": "d6v2o7",
        "name": "Washburne, Zoe"
    }
  ]

  // store["competencies"] = {
  //   Culture: [
  //     // 'How do you demonstrate behaviors that are in line with our ISMs',
  //     'Attitude and behavior are in line with the ISMs?',
  //     // 'How do you demonstrate behavior that is in line with your team standards',
  //     'Attitude and behavior are in line with team standards?',
  //   ],
  //   Competency: [
  //     // 'How do you demonstrate the skills expected for your role?',
  //     'Skill level is at or above expected level?',
  //     // 'How do you actively work to develop your skills and reach your career goals?',
  //     'Actively works to develop skills and reach career goals?',
  //   ],
  //   Contribution: [
  //     // 'How have you impacted the team\'s ability to achieve their goals?',
  //     'Contributes to the ability of the team to achieve their goals?',
  //     // 'How often do you deliver on your goals, assignments and deadlines?',
  //     'Deliver on goals, assignments and deadlines?',
  //   ],
  // }

  store["assessments"] = {}

  store["ratingScale"] = [
    {
      competencies: 'I would not want to work with this person in any context.',
      questions: 'I was put off by their response.',
      score: -2,
    },
    {
      competencies: 'I would not want this person on my team.',
      questions: 'I don\'t think their response was very good.',
      score: -1,
    },
    {
      competencies: 'I think this person would fit somewhere within our organization.',
      questions: 'I think their response was ok.',
      score: 1,
    },
    {
      competencies: 'I want this person on my team.',
      questions: 'I am very impressed with the response.',
      score: 2,
    },
  ]

  store["survey"] = `
    # Communication
      + Give us an example of a time when you were going to miss a deadline.
        - What did you communicate?
        - With whom did you communicate?
        - What was the outcome?
      + Tell us about the most challenging project you were a part of.
        - What made it a challenge?
        - How did you contribute?
        - If you could do it again what would you change?
      + Tell us about a time you were presented an idea that you knew had a better solution.
        - How did you handle it?
        - What was the result?
        - What did you learn?
      + Walk us through a time your business partner gave you additional projects on top of your workload.
        - How did you prioritize?
        - How did you communicate this to your business partner?
        - What was the result?
    # Teamwork
      + Describe a time you positively imfluenced another team member.
        - What led you to this action?
        - How did the team member respond?
      + Tell us about a time you had to deliver some difficult feedback.
        - Who was involved?
        - How was the feedback received?
        - What happened as a result?
      + Share a time when your team was failing to meet a deadline.
        - How did you handle it?
        - What was the response from those involved?
        - What was the outcome?
      + Walk us through a time when you built trust with a new team member.
        - What did you do?
        - What was the result?
    # Emotional Intelligence
      + Tell us about a stressful situation you dealt with professionally.
        - How did you handle it?
        - Were you able to change your situation?
      + Tell us about a time you received feedback that you did not agree with regarding your own performance.
        - What was your response?
        - what did you do because of this feedback?
        - How do you like to receive feedback?
      + Walk us through one of your professional failures.
        - How did you handle the situation?
        - What did you learn from it?
    # Coachability
      + Tell us about a person who has mentored you in your career.
        - How did they mentor you?
        - What was the impact the made?
      + Give us an example of what a previous leader said was one of your weaknesses.
        - How did you feel about that feedback?
        - What was your response?
      + Tell us about a time you received some constructive criticism.
        - Did you agree with it?
        - What was your reaction?
        - What did you change because of this feedback?
    # Initiative
      + Walk us through an initiative that you started and drove to completion.
        - What was your contribution?
        - Explain the outcome.
      + Describe a situcation when you reached a point in a project where you were unable to move forward.
        - What was your approach?
        - How did you overcome this challenge?
      + Tell us about what you like least about a previous job.
        - What did you do to change it?
        - If not, why?
    # Professional Development
      + Give us an example of a step you took toward your own professional development.
        - What led up to this situation?
        - How did this improve your career?
      + Walk us through a time you felt you exceeded expectations at work.
        - What made you fo above and beyond?
        - Did your leader recofnize your work ethic?
      + Describe what you do to continue improving your skills.
        - What do you want to focus on?
        - What are the next steps?
        - What would you like to see because of this improvement?
    # Critical Thinking
      + Describe a time when you found a creative way to overcome an obstacle.
        - Was anyone else involved?
        - What was the impact?
      + Tell us about a process improvement you've made?
        - What was the follow-through?
        - What did you do to ensure this was implemented?
        - Was anyone else involved?
      + Walk us through a time when you identified and prevented a major issue.
        - How did you recognize the potential issue?
        - What took place to resolve it?
    # Time Management
      + Tell us about a time when you had to manage multiple projects at the same time.
        - How did you prioritize?
        - How did you manage the responsibilitieis?
        - What was the result?
      + Describe the tools, or strategies, you use to keep yourself organized.
        - Why does this work for you?
        - How do you avoid wasting time?
      + Tell us about a time when you had to choose between projects.
        - How did you determine which one to choose?
        - What ledd you to that decision?
        - Do you feel that was the best choice?
  `.trim().split('\n')
    .reduce(({ category, survey, topic }, str) => {
      const [_, leader, text] = str.trim().match(/^([-#+])\s+(.*)$/)

      switch (leader) {
        case "#":
          survey[category = text] = {}
          break
        case "+":
          survey[category][topic = text] = []
          break
        case "-":
          survey[category][topic].push(text)
          break
      }

      return { category, survey, topic }
    }, {current: '', survey: {}})["survey"]

  persist(store)
}
