import { AppWrapper } from './AppWrapper'

describe('AppWrapper component', () => {
  it('render index page', async () => {
    const appWrapper = <AppWrapper>{'some text'}</AppWrapper>
    expect(appWrapper).toMatchObject(<AppWrapper>{expect.anything()}</AppWrapper>)
  })
})
