import declareProblem from './index'

const { handler, decorator, Problem } = declareProblem({
  status: 405,
  title: 'Method Not Allowed',
  detail:
    'The HTTP method you specified is not supported by the requested resource. Check if you should be using one of the supported methods instead.',
})

export { handler, decorator, Problem }
