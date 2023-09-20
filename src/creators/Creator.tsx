import React, { useReducer } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Button } from '../components';
import {
  ICreatorState,
  CreatorActions,
  creatorReducer,
  initialCreatorState,
} from './creatorReducer';
import {
  TRootState,
  useAppDispatch,
  useAppSelector,
  IHabit,
  closeCreatorModal,
} from '../store';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 600px;
  gap: ${({ theme }) => theme.space.m};
`;

const StyledBttonsGroup = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export interface ICreatorSteps {
  state: ICreatorState;
  changeValue: (
    e: React.FormEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

interface ICreatorProps {
  stepsData: ({
    state,
    changeValue,
  }: ICreatorSteps) => { component: React.ReactElement; isValid?: any }[]; // TODO
  documentCreationFn: any; // TODO
  helperFn?: any; // TODO
}

export const Creator = ({
  stepsData,
  documentCreationFn,
  helperFn,
}: ICreatorProps) => {
  const reduxDispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const user = useAppSelector((state: TRootState) => state.auth);
  const [state, dispatch] = useReducer(creatorReducer, initialCreatorState);

  const changeValue = (
    e: React.FormEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    dispatch({
      type: CreatorActions.CHANGE_VALUE,
      payload: {
        field: e.currentTarget.name,
        value: e.currentTarget.value,
      },
    });
  };

  const prevStep = () => {
    dispatch({
      type: CreatorActions.PREV_STEP,
    });
  };

  const nextStep = () => {
    dispatch({
      type: CreatorActions.NEXT_STEP,
    });
  };

  const close = () => {
    dispatch({
      type: CreatorActions.CLOSE,
    });
    reduxDispatch(closeCreatorModal());
  };

  const addMetaData = () => {
    if (!user.data) return;
    dispatch({
      type: CreatorActions.ADD_META_DATA,
      payload: {
        owner: user.data.uid,
        meta: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: user.data.uid,
        },
      },
    });
  };

  const addRealizationData = () => {
    dispatch({
      type: CreatorActions.ADD_REALIZATION_DATA,
    });
  };

  const finish = () => {
    if (!state.result) return;
    appDispatch(documentCreationFn(state.result))
      .unwrap()
      .then((result: IHabit) => {
        if (user.data)
          appDispatch(helperFn({ userId: user.data.uid, habitId: result.id }));
      })
      .then(() => {
        dispatch({
          type: CreatorActions.CLOSE,
        });
        reduxDispatch(closeCreatorModal());
      });
  };

  const collection = stepsData({ state, changeValue });

  return (
    <StyledWrapper>
      {collection[state.step].component}
      <StyledBttonsGroup>
        {state.step > 0 ? (
          <Button
            text={'Back'}
            action={prevStep}
          />
        ) : (
          <Button
            text={'Cancel'}
            action={close}
          />
        )}
        {state.step < collection.length - 2 && (
          <Button
            text={'Continue'}
            action={nextStep}
            disabled={
              Object.prototype.hasOwnProperty.call(
                collection[state.step],
                'isValid',
              ) && collection[state.step].isValid(state.result) === false
            }
          />
        )}
        {state.step === collection.length - 2 && (
          <Button
            text={'Go to summary'}
            action={() => {
              addMetaData();
              addRealizationData();
              nextStep();
            }}
            disabled={
              Object.prototype.hasOwnProperty.call(
                collection[state.step],
                'isValid',
              ) && collection[state.step].isValid(state.result) === false
            }
          />
        )}
        {state.step === collection.length - 1 && (
          <Button
            text={'Finish'}
            action={finish}
          />
        )}
      </StyledBttonsGroup>
    </StyledWrapper>
  );
};

export default Creator;
