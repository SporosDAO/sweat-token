import { PageProvider, PageContext, usePage } from './index'
import { MainMenuItems, DaoMenuItems, SecondaryMenuItems } from './menu'

import { act, render, screen, userEvent, waitFor, renderHook } from '../../../test'
import * as reactRouter from 'react-router-dom'
import React from 'react'
import { chainId } from 'wagmi'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom')
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
    useParams: () => ({ daoId: undefined, chainId: '5' })
  }
})

describe('PageProvider menu components', () => {
  it('renders main app menu', async () => {
    await render({
      ui: <MainMenuItems />
    })
    let homeButton: any
    await waitFor(async () => {
      homeButton = screen.getByTestId('home-button')
      await expect(homeButton).toBeVisible()
    })
    await act(async () => {
      await userEvent.click(homeButton)
      await expect(mockNavigate).toHaveBeenCalledTimes(1)
      await expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('renders DAO sub-menu for an unknown DAO', async () => {
    jest.spyOn(reactRouter, 'useParams').mockReturnValueOnce({ daoId: undefined, chainId: '5' })
    await act(async () => {
      await render({
        ui: <DaoMenuItems />
      })
    })
    let peopleButton: any
    await waitFor(async () => {
      peopleButton = await screen.getByTestId('people-button')
      await expect(peopleButton).toBeVisible()
    })
    await act(async () => {
      await userEvent.click(peopleButton)
      await expect(mockNavigate).toHaveBeenCalledTimes(1)
      await expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('renders secondary menu items', async () => {
    await render({
      ui: <SecondaryMenuItems />
    })
    await waitFor(async () => {
      await expect(screen.getByTestId('help-link')).toBeVisible()
    })
  })
})
