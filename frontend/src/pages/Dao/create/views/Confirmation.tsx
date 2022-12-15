import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useFormContext } from 'react-hook-form'

import Header from '../../../../components/Header'
import { CardContent, Checkbox, FormControlLabel, Link, useTheme } from '@mui/material'
import { AlertIcon, CheckIcon } from '../../../../components/Icons'
import { Controller } from 'react-hook-form'
import { useNetwork } from 'wagmi'
import { Box } from '@mui/system'

const Confirmation: React.FC<any> = (props) => {
  const { palette } = useTheme()
  const { getValues, control } = useFormContext()
  const { name, symbol, founders, voting } = getValues()
  const { chain } = useNetwork()

  return (
    <>
      <Header
        title="Confirmation"
        subtitle="Please make sure your name and token symbol are correct. Note: we know getting started can seem confusing, so we help take the guess work out of it by providing  default settings. All of these settings can be adjusted after you deploy your LLC."
      />
      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ ml: '4px', mt: '24px' }}>
            Structure
          </Typography>
          <Divider orientation="horizontal" />
          <Typography variant="caption" color={palette.text.secondary} m="0">
            Legal Structure
          </Typography>
          <Typography variant="subtitle2" m="0">
            Delaware Series LLC
          </Typography>
          <Typography variant="subtitle1" sx={{ ml: '4px', mt: '24px' }}>
            Name
          </Typography>
          <Divider orientation="horizontal" />
          <Typography variant="caption" color={palette.text.secondary} m="0">
            On-Chain name
          </Typography>
          <Typography m="0" variant="subtitle2" sx={{ display: 'flex' }} data-testid="dao-name">
            {name}
          </Typography>
          <Typography variant="subtitle2" color={palette.warning.dark} sx={{ display: 'flex', mt: '16px' }}>
            <AlertIcon sx={{ mr: '14px' }} /> DAO Name cannot be changed later.
          </Typography>
          <Divider orientation="horizontal" sx={{ m: '16px 0' }} />
          <Typography variant="caption" color={palette.text.secondary} m="0">
            Token symbol
          </Typography>
          <Typography variant="subtitle2" data-testid="token-symbol">
            {symbol}
          </Typography>
          <Typography variant="subtitle2" color={palette.warning.dark} sx={{ display: 'flex', mt: '16px' }}>
            <AlertIcon sx={{ mr: '14px' }} /> DAO Symbol cannot be changed later.
          </Typography>
          <Divider orientation="horizontal" />
          <Typography variant="caption" color={palette.text.secondary} m="0">
            Deploying on
          </Typography>
          <Typography variant="subtitle2" data-testid="chain-name">
            {chain?.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ ml: '4px', mt: '24px' }}>
            Governance
          </Typography>
          <Divider orientation="horizontal" />
          <Typography display="flex" variant="caption" color={palette.text.secondary} m="0">
            Voting Period
            <Tooltip
              arrow
              title={
                <Typography variant="caption">
                  This is the time period proposals for your company will be live for.
                </Typography>
              }
            >
              <img
                src="/icons/info-icon.svg"
                alt="Information Tooltip Icon"
                style={{ marginLeft: '9px', cursor: 'pointer', fill: 'none' }}
              />
            </Tooltip>
          </Typography>
          <Typography variant="subtitle2" m="0">
            {voting.period.hours} hour(s)
          </Typography>
          <Divider orientation="horizontal" sx={{ m: '16px 0' }} />
          <Typography display="flex" variant="caption" color={palette.text.secondary} m="0">
            Quorum
            <Tooltip
              arrow
              title={
                <Typography variant="caption">
                  This is the percentage of your LLC's tokens that need to vote on a proposal for it to be valid
                </Typography>
              }
            >
              <img
                src="/icons/info-icon.svg"
                alt="Information Tooltip Icon"
                style={{ marginLeft: '9px', cursor: 'pointer', fill: 'none' }}
              />
            </Tooltip>
          </Typography>
          <Typography variant="subtitle2" m="0">
            {voting.quorum}%
          </Typography>
          <Divider orientation="horizontal" sx={{ m: '16px 0' }} />
          <Typography display="flex" variant="caption" color={palette.text.secondary} m="0">
            Approval Needed
            <Tooltip
              arrow
              title={
                <Typography variant="caption">
                  This is the percentage of tokens that need to vote 'Yes' on a proposal for it to pass
                </Typography>
              }
            >
              <img
                src="/icons/info-icon.svg"
                alt="Information Tooltip Icon"
                style={{ marginLeft: '9px', cursor: 'pointer', fill: 'none' }}
              />
            </Tooltip>
          </Typography>
          <Typography variant="subtitle2" m="0">
            {voting.approval}%
          </Typography>
          <Typography variant="subtitle1" sx={{ ml: '4px', mt: '24px' }}>
            Token Features
          </Typography>
          <Divider orientation="horizontal" />
          <Grid item display="flex" alignItems="center" justifyContent="space-between" mb="5px">
            <Typography display="flex" variant="subtitle2">
              Redemption
              <Tooltip
                arrow
                title={
                  <Typography variant="caption">
                    Allows token holders to burn or 'ragequit' their LLC's tokens for a proportionate share of
                    whitelisted treasury assets.
                  </Typography>
                }
              >
                <img
                  src="/icons/info-icon.svg"
                  alt="Information Tooltip Icon"
                  style={{ marginLeft: '9px', cursor: 'pointer', fill: 'none' }}
                />
              </Tooltip>
            </Typography>
            <Grid item display="flex" alignItems="center" gap="10px">
              <CheckIcon sx={{ mt: '4px' }} />
              <Typography variant="caption">No</Typography>
            </Grid>
          </Grid>
          <Grid item display="flex" alignItems="center" justifyContent="space-between">
            <Typography display="flex" variant="subtitle2">
              Transferrable
              <Tooltip
                arrow
                title={
                  <Typography variant="caption">
                    Tokens will be locked to the original recipient and will not be transferable until a proposal making
                    such a change is approved. Sporos requires your tokens be non-transferrable for U.S. compliance
                    reasons. While this setting can be changed after you create your LLC, we recommend consulting with
                    an attorney as it may change the legal standing of your entity.
                  </Typography>
                }
              >
                <img
                  src="/icons/info-icon.svg"
                  alt="Information Tooltip Icon"
                  style={{ marginLeft: '9px', cursor: 'pointer', fill: 'none' }}
                />
              </Tooltip>
            </Typography>
            <Grid item display="flex" alignItems="center" gap="10px">
              <CheckIcon sx={{ mt: '4px' }} />
              <Typography variant="caption">No</Typography>
            </Grid>
          </Grid>
          {founders?.map((founder: any, index: number) => (
            <Box key={index}>
              <Typography variant="subtitle1" sx={{ ml: '4px', mt: '24px' }}>
                Founder
              </Typography>
              <Divider orientation="horizontal" />
              <Typography variant="caption" color={palette.text.secondary}>
                Address
              </Typography>
              <Typography variant="subtitle2" data-testid={`founder.${index}.address`}>
                {founder.address}
              </Typography>
              <Divider orientation="horizontal" />
              <Typography variant="caption" color={palette.text.secondary}>
                Tokens
              </Typography>
              <Typography variant="subtitle2" data-testid={`founder.${index}.initialTokens`}>
                {founder.initialTokens}
              </Typography>
              <Divider orientation="horizontal" />
              <Typography variant="caption" color={palette.text.secondary}>
                Email
              </Typography>
              <Typography variant="subtitle2" data-testid={`founder.${index}.email`}>
                {founder.email}
              </Typography>
            </Box>
          ))}
          <Divider orientation="horizontal" />
          <FormControlLabel
            sx={{ ml: '4px', mt: '24px' }}
            label="Agree with terms of use and privacy policy"
            control={
              <Controller
                name="terms"
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Checkbox
                    inputRef={ref}
                    ref={ref}
                    checked={value}
                    onBlur={onBlur}
                    onChange={(event) => {
                      // console.debug('checkbox onchange (old value, new value): ', value, event)
                      onChange(event) // data send back to hook form
                    }}
                    inputProps={{ 'aria-label': 'Terms Checkbox' }}
                    data-testid="terms"
                  />
                )}
              />
            }
          />
          <Typography variant="subtitle2">
            In order to continue you will have to accept our terms and conditions. You can read them{' '}
            <Link href="https://sporosdao.xyz/terms-and-conditions/" rel="noopener" target="_blank">
              here
            </Link>
            .
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}

export default Confirmation
