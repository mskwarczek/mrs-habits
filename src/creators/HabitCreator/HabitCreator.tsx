import React from 'react';
import styled from 'styled-components';

import { FormField } from '../../components';
import { Creator, ICreatorSteps } from '../Creator';
import { createHabit, addUserHabit } from '../../store';

const StyledFieldsGroup = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
`;

export const habitCreatorSteps = ({ state, changeValue }: ICreatorSteps) => {
  return [
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
    />,
    <FormField
      key={'creator-field-start-date'}
      id={'creator-field-start-date'}
      name={'startDate'}
      type={'date'}
      value={state.result?.startDate}
      label={'Start date:'}
      description={
        'When are you starting? Select a date in the past if you are already following your new habit.'
      }
      onChange={(e: React.FormEvent<HTMLInputElement>) => changeValue(e)}
    />,
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
      onChange={(e: React.FormEvent<HTMLInputElement>) => changeValue(e)}
    />,
    <StyledFieldsGroup key={'creator-field-frequency'}>
      <FormField
        id={'creator-field-freq-type'}
        name={'frequency.type'}
        type={'select'}
        options={[
          { value: 'HOURLY', text: 'Once per hour' },
          { value: 'DAILY', text: 'Once a day or continuously' },
          { value: 'WEEKLY', text: 'Once a week' },
          { value: 'MONTHLY', text: 'Once a month' },
          { value: 'YEARLY', text: 'Every year' },
        ]}
        label={'Frequency:'}
        description={'What is the frequency of your new habit?'}
        value={state.result?.frequency?.type}
        onChange={(e: React.FormEvent<HTMLInputElement>) => changeValue(e)}
      />
    </StyledFieldsGroup>,
    <FormField
      key={'creator-field-description'}
      id={'creator-field-description'}
      name={'description'}
      type={'textarea'}
      value={state.result?.description}
      label={'Description:'}
      description={'Short description or notes about your new habit'}
      onChange={(e: React.FormEvent<HTMLInputElement>) => changeValue(e)}
    />,
    <div key={'creator-field-done'}>
      <p>All done</p>
    </div>,
  ];
};

{
  /* {state.result?.frequency?.category === 'TIMES'
? <Input
  id={'new-habit-freq-value'}
  name={'frequency.value'}
  type={'number'}
  value={state.result?.frequency?.value}
  onChange={(e: React.FormEvent<HTMLInputElement>) => changeTextValue(e)}
/>
: state.result?.frequency?.category === 'SPECIFIC'
? <Input
  id={'new-habit-freq-value'}
  name={'frequency.value'}
  type={'number'}
  value={state.result?.frequency?.value}
  onChange={(e: React.FormEvent<HTMLInputElement>) => changeTextValue(e)}
/>
: null
} */
}

//   <FormField
//     id={'creator-field-measurement-type'}
//     name={'measurement.type'}
//     type={'select'}
//     options={[
//       { value: 'BOOL', text: 'Done / Not done' },
//       { value: 'NOTE_1_5', text: 'Note from 1 to 5' },
//     ]}
//     label={'Measurement:'}
//     description={'How is your progress going to be measured'}
//     value={state.result?.frequency?.type}
//     onChange={(e: React.FormEvent<HTMLInputElement>) => changeValue(e)}
//   />

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
