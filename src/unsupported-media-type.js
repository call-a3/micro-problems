import declareProblem from './index'

const { handler, decorator, Problem } = declareProblem({
  status: 415,
  title: 'Unsupported Media Type',
  detail:
    'The Content-Type you provided as the format of your request body is not supported. Check if you can provide your request entity in one of the supported Content-Types.',
})

export { handler, decorator, Problem }
