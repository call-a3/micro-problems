import declareProblem from '../src/index'

const problemDescription = {
  title: 'Something went wrong',
  status: 500,
  detail: 'There is nothing you can do',
}

describe('micro-problems', () => {
  it('should return an Error subclass', () => {
    const { Problem } = declareProblem(problemDescription)
    expect(new Problem()).toBeInstanceOf(Error)
  })

  it('should return an HTTP handler', () => {
    const { handler } = declareProblem(problemDescription)
    const res = {
      setHeader: jest.fn(),
      getHeader: jest.fn(() => true),
      end: jest.fn(),
    }
    handler(null, res)
    expect(res).toHaveProperty('statusCode', 200)
    expect(res.setHeader).toHaveBeenCalled()
    expect(res.setHeader.mock.calls).toMatchSnapshot('setHeader calls')
    expect(res.end).toHaveBeenCalledTimes(1)
    expect(res.end.mock.calls[0]).toMatchSnapshot('body')
  })

  describe('decorator', () => {
    const { Problem, decorator } = declareProblem(problemDescription)
    it('should call the wrapped handler', async () => {
      const fn = jest.fn()
      const decorated = decorator(fn)
      await decorated(null, null)
      expect(fn).toHaveBeenCalled()
    })
    it('should catch the Problem thrown from the wrapped handler', async () => {
      const fn = jest.fn(() => {
        throw new Problem('This instance could not be helped', {
          meta: 'void',
        })
      })
      const res = {
        setHeader: jest.fn(),
        getHeader: jest.fn(() => true),
        end: jest.fn(),
      }
      const decorated = decorator(fn)
      await decorated(null, res)
      expect(res).toHaveProperty('statusCode', problemDescription.status)
      expect(res.setHeader).toHaveBeenCalled()
      expect(res.setHeader.mock.calls).toMatchSnapshot('setHeader calls')
      expect(res.end).toHaveBeenCalledTimes(1)
      expect(res.end.mock.calls[0]).toMatchSnapshot('body')
    })
    it('should throw other Error thrown from the wrapped handler', async () => {
      const fn = jest.fn(() => {
        throw new Error('generic error')
      })
      const res = {
        setHeader: jest.fn(),
        getHeader: jest.fn(() => true),
        end: jest.fn(),
      }
      const decorated = decorator(fn)
      await expect(decorated(null, res)).rejects.toThrowErrorMatchingSnapshot()
    })
  })
})
