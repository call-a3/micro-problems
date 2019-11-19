import declareProblem from './index'

const { handler, decorator, Problem } = declareProblem({
  status: 406,
  title: 'Not Acceptable',
  detail:
    'The Content-Type you requested can not be provided. Check your Accept header and try to accept and use one of the supported Content-Types.',
})

export { handler, decorator, Problem }
