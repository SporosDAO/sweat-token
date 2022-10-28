import { DaoMenuItems } from './menu'

import { act, render, screen, userEvent, waitFor } from '../../../test'
import * as reactRouter from 'react-router-dom'
import React from 'react'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom')
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
    useParams: () => ({ daoId: '123', chainId: '5' })
  }
})

describe('PageProvider component', () => {
  it.only('renders DAO sub-menu for a known DAO', async () => {
    jest.spyOn(reactRouter, 'useParams').mockReturnValue({ daoId: '123', chainId: '5' })
    await render({
      ui: <DaoMenuItems />
    })
    let peopleButton: any
    await waitFor(async () => {
      peopleButton = await screen.getByTestId('people-button')
      await expect(peopleButton).toBeVisible()
    })
    await act(async () => {
      await userEvent.click(peopleButton)
      await expect(mockNavigate).toHaveBeenCalledTimes(1)
      await expect(mockNavigate).toHaveBeenCalledWith('/dao/chain/5/address/123/people/')
    })
  })
})
