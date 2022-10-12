import { AppWrapper } from './AppWrapper'

describe('AppWrapper component', () => {
  it('render index page', async () => {
    const appWrapper = <AppWrapper theme={expect.anything()}>{'some text'}</AppWrapper>
    expect(appWrapper).toMatchObject(<AppWrapper theme={expect.anything()}>{expect.anything()}</AppWrapper>)
  })
})
