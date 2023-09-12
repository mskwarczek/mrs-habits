import React, { useState } from 'react';
import styled from 'styled-components';

import { Button, FormField } from '../components';
import {
  TRootState,
  useAppDispatch,
  useAppSelector,
  createGoal,
  addUserGoal,
  IGoal,
} from '../store';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: left;
  width: 600px;
`;

const NewGoalPage = () => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  const dispatch = useAppDispatch();
  const user = useAppSelector((state: TRootState) => state.auth);

  const handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleStartDateChange = (e: React.FormEvent<HTMLInputElement>) => {
    setStartDate(e.currentTarget.value);
  };

  const handleEndDateChange = (e: React.FormEvent<HTMLInputElement>) => {
    setEndDate(e.currentTarget.value);
  };

  const handleDescriptionChange = (e: React.FormEvent<HTMLInputElement>) => {
    setDescription(e.currentTarget.value);
  };

  const handleSaveGoal = () => {
    const newGoalObj: IGoal = {
      name,
      createdAt: new Date().toString(),
      createdBy: user.uid,
      owner: user.uid,
      startDate,
      endDate,
      description,
    };
    dispatch(createGoal(newGoalObj))
      .unwrap()
      .then((result) => {
        if (user.uid && result.id) {
          dispatch(addUserGoal({ userId: user.uid, goalId: result.id }));
        }
        // some nav here
      });
  };

  return (
    <main>
      Create a new goal
      <StyledWrapper>
        <FormField
          id={'new-goal-name'}
          type={'text'}
          value={name}
          required
          label={'Goal name: '}
          onChange={(e) => handleNameChange(e)}
        />
        <FormField
          id={'new-goal-start-date'}
          type={'date'}
          value={startDate}
          label={'When are you starting: '}
          onChange={(e) => handleStartDateChange(e)}
        />
        <FormField
          id={'new-goal-end-date'}
          type={'date'}
          value={endDate}
          label={'When do you plan to fulfill your goal?: '}
          onChange={(e) => handleEndDateChange(e)}
        />
        <FormField
          id={'new-goal-description'}
          type={'textarea'}
          value={description}
          label={'Describe your goal: '}
          onChange={(e) => handleDescriptionChange(e)}
        />
      </StyledWrapper>
      <Button
        text={'Save goal'}
        action={handleSaveGoal}
        disabled={!name.length}
        title={
          !name.length ? 'Please fill the goal name field' : 'Save new goal!'
        }
      />
    </main>
  );
};

export default NewGoalPage;
