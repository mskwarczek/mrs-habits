import React from 'react';
import styled from 'styled-components';

import type { IHabitTemplate } from '../../types';
import { FormField } from '../../components';
import { Creator, ICreatorSteps } from '../Creator';
import { flexWrappers } from '../../styles/mixins';
import { createHabit, addUserHabit } from '../../store';

const StyledFieldsGroup = styled.div`
  ${flexWrappers.cLine};
  gap: ${({ theme }) => theme.space.s};
  width: 100%;
`;

export const habitCreatorSteps = ({ state, changeValue }: ICreatorSteps) => {
  return [
    {
      component: (
        <FormField
          key={'creator-field-name'}
          id={'creator-field-name'}
          name={'name'}
          type={'text'}
          value={state.result?.name}
          required
          label={'Name:'}
          description={
            'How would you like to name your new habit? Use something simple and meaningful, like "Everyday jogging", "Weekly garden cleaning" or "Another day without a cigarette"'
          }
          onChange={(e: React.FormEvent<HTMLInputElement>) => changeValue(e)}
        />
      ),
      isValid: (result: IHabitTemplate) =>
        typeof result.name === 'string' && result.name.length > 0,
    },
    {
      component: (
        <StyledFieldsGroup key={'creator-field-frequency'}>
          <FormField
            id={'creator-field-freq-type'}
            name={'frequency.type'}
            type={'select'}
            options={[
              { value: '', text: 'Select option' },
              { value: 'DAILY', text: 'Every day (continuously)' },
              {
                value: 'WEEKLY',
                text: 'At least one time per week (Mon - Sun)',
              },
              {
                value: 'X-PER-WEEK',
                text: 'Several times per week (Mon - Sun)',
              },
            ]}
            required
            label={'Frequency:'}
            description={'What is the frequency of your new habit?'}
            value={state.result?.frequency?.type}
            onChange={(e: React.FormEvent<HTMLSelectElement>) => changeValue(e)}
          />
          {state.result?.frequency?.category === 'X-PER-PERIOD' && (
            <FormField
              id={'creator-field-freq-value'}
              name={'frequency.value'}
              type={'number'}
              step={'1'}
              min={'1'}
              max={'7'}
              required
              label={'Minimum realizations:'}
              description={
                'How many realizations should be your minimum in given period'
              }
              value={state.result?.frequency?.value}
              onChange={(e: React.FormEvent<HTMLSelectElement>) =>
                changeValue(e)
              }
              externalIsValid={
                state.result.frequency.value.match(/^[1-9]\d*$/) ? true : false
              }
            />
          )}
        </StyledFieldsGroup>
      ),
      isValid: (result: IHabitTemplate) =>
        result.frequency &&
        result.frequency.type.length > 0 &&
        (result.frequency.category === 'STANDARD' ||
          (result.frequency.category === 'X-PER-PERIOD' &&
            !!result.frequency.value.match(/^[1-9]\d*$/))),
    },
    {
      component: (
        <FormField
          key={'creator-field-start-date'}
          id={'creator-field-start-date'}
          name={'startDate'}
          type={'date'}
          value={state.result?.startDate}
          required
          label={'Start date:'}
          description={
            'When are you starting? Select a date in the past if you are already following your new habit.'
          }
          onChange={(e: React.FormEvent<HTMLInputElement>) => changeValue(e)}
        />
      ),
      isValid: (result: IHabitTemplate) =>
        typeof result.startDate === 'string' && result.startDate.length > 0,
    },
    {
      component: (
        <FormField
          key={'creator-field-end-date'}
          id={'creator-field-end-date'}
          name={'endDate'}
          type={'date'}
          value={state.result?.endDate}
          label={'End date:'}
          description={
            'Is there a date in the future when you would like to remove or modify this habit? If so, then provide it here. When time comes, we will notify you that your habit needs an update.'
          }
          externalIsValid={
            !state.result?.endDate ||
            (typeof state.result?.endDate === 'string' &&
              typeof state.result?.startDate === 'string' &&
              (state.result?.endDate.length === 0 ||
                (state.result?.endDate.length > 0 &&
                  state.result?.endDate >= state.result?.startDate)))
          }
          onChange={(e: React.FormEvent<HTMLInputElement>) => changeValue(e)}
        />
      ),
      isValid: (result: IHabitTemplate) =>
        !result.endDate ||
        (typeof result.endDate === 'string' &&
          typeof result.startDate === 'string' &&
          (result.endDate.length === 0 ||
            (result.endDate.length > 0 && result.endDate >= result.startDate))),
    },
    {
      component: (
        <FormField
          key={'creator-field-default-realization-value'}
          id={'creator-field-default-realization-value'}
          name={'defaultDayStatus'}
          type={'select'}
          options={[
            { value: '', text: 'Select option' },
            {
              value: 'DONE',
              text: 'Done',
              disabled:
                state.result?.frequency?.type === 'DAILY' ? false : true,
            },
            {
              value: 'EMPTY',
              text: 'Empty',
              disabled:
                state.result?.frequency?.type === 'DAILY' ? true : false,
            },
            {
              value: 'NOT-DONE',
              text: 'Not done',
              disabled:
                state.result?.frequency?.type === 'DAILY' ? false : true,
            },
          ]}
          required
          label={'Default habit status:'}
          description={
            'Your habit can be marked as "done", "empty" or "not done" for each day it is applied. Evey new day is maked as "empty". If you do not change state of a "daily" habit to "done" or "not done" by the end of the day, it will update to this value automatically. Other types of habits will always keep "empty" status unless changed by the user.'
          }
          value={state.result?.defaultDayStatus}
          onChange={(e: React.FormEvent<HTMLSelectElement>) => changeValue(e)}
        />
      ),
      isValid: (result: IHabitTemplate) =>
        typeof result.defaultDayStatus === 'string' &&
        result.defaultDayStatus.length > 0,
    },
    {
      component: (
        <FormField
          key={'creator-field-description'}
          id={'creator-field-description'}
          name={'description'}
          type={'textarea'}
          value={state.result?.description}
          label={'Description:'}
          description={'Short description or notes about your new habit'}
          onChange={(e: React.FormEvent<HTMLInputElement>) => changeValue(e)}
        />
      ),
    },
    {
      component: (
        <div key={'creator-field-done'}>
          <p>All done</p>
        </div>
      ),
    },
  ];
};

const HabitCeator = () => {
  return (
    <Creator
      stepsData={habitCreatorSteps}
      documentCreationFn={createHabit}
      helperFn={addUserHabit}
    />
  );
};

export default HabitCeator;
