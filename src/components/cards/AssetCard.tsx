import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import Image from 'next/image'

import { Badge, Card, Group, createStyles } from '@mantine/core'

import { useCurrencyValue } from 'src/hooks/useCurrencyValue'
import { selectUserRentCalculation } from 'src/store/features/settings/settingsSelector'
import { UserRealtoken } from 'src/store/features/wallets/walletsSelector'
import { RentCalculation } from 'src/types/RentCalculation'

import {
  Divider,
  RentStatusTag,
  RmmStatusTag,
  SubsidyStatusTag,
} from '../commons'
import moment from 'moment'

const useStyles = createStyles({
  disabled: {
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      color: 'white',
      textAlign: 'center',
      fontWeight: 500,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 2,
    },

    '&:after': {
      content: 'attr(data-value)',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: 'white',
      fontWeight: 500,
      zIndex: 3,
    },
  },
  imageContainer: {
    height: '150px',
    position: 'relative',

    '& > span': {
      height: '100% !important',
      width: '100% !important',
    },
  },
  textBold: {
    fontWeight: 500,
  },
  textSm: {
    fontSize: '14px',
  },
  textLocation: {
    fontSize: '12px',
    textAlign: 'center',
  },
  groupApart: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    '& > *': {
      boxSizing: 'border-box',
      flexGrow: 0,
    },
  },
  clickable: {
    cursor: 'pointer',
    transition: 'transform 0.1s ease-in-out',
    '&:hover': {
      transform: 'scale(1.03)',
    },
  },
})

interface AssetCardProps {
  value: UserRealtoken
  onClick?: (id: string) => unknown
}

const AssetCardComponent: FC<AssetCardProps> = (props) => {
  const { t: tNumbers } = useTranslation('common', { keyPrefix: 'numbers' })
  const { t } = useTranslation('common', { keyPrefix: 'assetCard' })

  const rentCalculation = useSelector(selectUserRentCalculation)

  const realtimeDate = moment("2024_01_01", "YYYY_MM_DD");
  const rentStartDate = new Date(props.value.rentStartDate.date)
  const isDisabled =
    rentCalculation.state === 'realtime' && rentStartDate > realtimeDate.toDate()

  const { classes } = useStyles()
  const rentNotStarted = t('rentNotStarted')
  const isSubsidized =
    props.value.subsidyStatus !== 'no' && props.value.subsidyStatusValue

  // In Dollars
  const value = props.value.value
  const weeklyAmount = props.value.amount * props.value.netRentDayPerToken * 7
  const yearlyAmount = props.value.amount * props.value.netRentYearPerToken
  const totalInvestment = props.value.totalInvestment

  return (
    <Card
      shadow={'sm'}
      radius={'md'}
      withBorder={true}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      className={props.onClick ? classes.clickable : undefined}
      onClick={() => props.onClick?.(props.value.id)}
    >
      <Card.Section>
        <div
          className={
            classes.imageContainer + ' ' + (isDisabled ? classes.disabled : '')
          }
          data-value={rentNotStarted}
        >
          <Image
            src={props.value.imageLink[0]}
            width={400}
            height={300}
            objectFit={'cover'}
            alt={props.value.fullName}
          />
        </div>
      </Card.Section>

      <Group position={'apart'} mt={'md'}>
        <div className={classes.textBold}>{props.value.shortName}</div>
        <Badge variant={'light'}>{useCurrencyValue(value)}</Badge>
      </Group>

      <Group position={'left'} mt={'xs'}>
        <RentStatusTag value={props.value} />
        <SubsidyStatusTag value={props.value} />
        {props.value.isRmmAvailable ? <RmmStatusTag /> : null}
      </Group>

      <Divider height={1} my={'xs'} />

      <div className={classes.groupApart}>
        <div className={classes.textSm}>{t('tokens')}</div>
        <div className={classes.textSm}>
          {tNumbers('decimal', { value: props.value.amount })}
          {' / '}
          {tNumbers('integer', { value: props.value.totalTokens })}
        </div>
      </div>

      <div className={classes.groupApart}>
        <div className={classes.textSm}>{t('apr')}</div>
        <div className={classes.textSm}>
          {tNumbers('percent', { value: props.value.annualPercentageYield })}
        </div>
      </div>

      <div className={classes.groupApart}>
        <div className={classes.textSm}>{t('weekly')}</div>
        <div className={classes.textSm}>{useCurrencyValue(weeklyAmount)}</div>
      </div>

      <div className={classes.groupApart}>
        <div className={classes.textSm}>{t('yearly')}</div>
        <div className={classes.textSm}>{useCurrencyValue(yearlyAmount)}</div>
      </div>

      <div className={classes.groupApart}>
        <div className={classes.textSm}>{t('rentedUnits')}</div>
        <div className={classes.textSm}>
          {tNumbers('integer', { value: props.value.rentedUnits })}
          {' / '}
          {tNumbers('integer', { value: props.value.totalUnits })}
          {` (${tNumbers('percentInteger', {
            value: (props.value.rentedUnits / props.value.totalUnits) * 100,
          })})`}
        </div>
      </div>

      {isSubsidized && (
        <div className={classes.groupApart}>
          <div className={classes.textSm}>{t('subsidy')}</div>
          <div className={classes.textSm}>
            {tNumbers('percentInteger', {
              value:
                (props.value.subsidyStatusValue / props.value.grossRentMonth) *
                100,
            })}
          </div>
        </div>
      )}

      <div className={classes.groupApart}>
        <div className={classes.textSm}>{t('propertyValue')}</div>
        <div className={classes.textSm}>
          {useCurrencyValue(totalInvestment)}
        </div>
      </div>

      <div className={classes.groupApart}>
        <div className={classes.textSm}>{t('rentStartDate')}</div>
        <div className={classes.textSm}>
          {rentStartDate.toLocaleDateString()}
        </div>
      </div>

      <div style={{ flex: '1 1 auto' }} />
      <Divider height={1} my={'xs'} />

      <div className={classes.textLocation}>{props.value.fullName}</div>
    </Card>
  )
}

export const AssetCard = memo(AssetCardComponent)
