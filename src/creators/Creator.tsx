import React, { useReducer } from 'react';
import styled from 'styled-components';

import { Button } from '../components';
import {
  TRootState,
  useAppDispatch,
  useAppSelector,
  IHabit,
  THabitRealizationValue,
  TStandardHabitFreq,
} from '../store';
import { getTimeSinceDate, addDays } from '../utils/datetime';

enum CreatorActions {
  NEXT_STEP = 'NEXT_STEP',
  PREV_STEP = 'PREV_STEP',
  CLOSE = 'CLOSE',
  CHANGE_VALUE = 'CHANGE_VALUE',
  ADD_META_DATA = 'ADD_META_DATA',
  ADD_REALIZATION_DATA = 'ADD_REALIZATION_DATA',
}

export type TCreatorAction =
  | { type: CreatorActions.NEXT_STEP; payload?: undefined }
  | { type: CreatorActions.PREV_STEP; payload?: undefined }
  | { type: CreatorActions.CLOSE; payload?: undefined }
  | {
      type: CreatorActions.CHANGE_VALUE;
      payload: {
        field: string;
        value: string;
      };
    }
  | {
      type: CreatorActions.ADD_META_DATA;
      payload: {
        owner: string;
        meta: {
          createdAt: string;
          updatedAt: string;
          createdBy: string;
        };
      };
    }
  | { type: CreatorActions.ADD_REALIZATION_DATA; payload?: undefined };

type TCreatorResult = IHabit;

export interface ICreatorState {
  step: number;
  template?: string;
  result?: TCreatorResult;
}

export interface ICreatorSteps {
  state: ICreatorState;
  changeValue: (
    e: React.FormEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

const initialCreatorState = {
  step: 0,
  result: {},
};

export const creatorReducer = (
  state: ICreatorState,
  action: TCreatorAction,
): ICreatorState => {
  const { type, payload } = action;
  switch (type) {
    case CreatorActions.PREV_STEP:
      return {
        ...state,
        step: state.step >= 1 ? state.step - 1 : 1,
      };
    case CreatorActions.NEXT_STEP:
      return {
        ...state,
        step: state.step + 1,
      };
    case CreatorActions.CLOSE:
      return initialCreatorState;
    case CreatorActions.CHANGE_VALUE: {
      const nested = payload.field.split('.');
      if (nested.length > 1) {
        switch (nested[0]) {
          case 'frequency':
            if (nested[1] === 'type') {
              if (
                payload.value === '' ||
                // || payload.value === 'HOURLY'
                payload.value === 'DAILY' ||
                payload.value === 'WEEKLY'
                // || payload.value === 'MONTHLY' ||
                // || payload.value === 'YEARLY'
              ) {
                return {
                  ...state,
                  result: {
                    ...state.result,
                    frequency: {
                      category: 'STANDARD',
                      type: payload.value as TStandardHabitFreq,
                    },
                  },
                };
              } else return state;
            } else return state;
          default:
            return state;
        }
      }
      return {
        ...state,
        result: {
          ...state.result,
          [payload.field]: payload.value,
        },
      };
    }
    case CreatorActions.ADD_META_DATA:
      return {
        ...state,
        result: {
          ...state.result,
          owner: action.payload.owner,
          meta: action.payload.meta,
        },
      };
    case CreatorActions.ADD_REALIZATION_DATA: {
      // TODO: this works only for days dow
      if (!state.result?.startDate) return state; // TODO: error and / or step change
      if (!state.result?.defaultRealizationValue) return state; // TODO: error and / or step change
      const days = getTimeSinceDate(state.result.startDate).days;
      const realizationArray = [];
      if (days >= 0) {
        const today = new Date().setHours(0, 0, 0, 0);
        let selectedDay = new Date(state.result?.startDate);
        let selectedDayHours = selectedDay.setHours(0, 0, 0, 0);
        while (selectedDayHours <= today) {
          const date = selectedDay.toString();
          const dayStatus: THabitRealizationValue =
            selectedDayHours < today
              ? state.result?.defaultRealizationValue
              : 'EMPTY';
          realizationArray.push({
            date,
            dayStatus,
          });
          selectedDay = addDays(selectedDay, 1);
          selectedDayHours = selectedDay.setHours(0, 0, 0, 0);
        }
      }
      return {
        ...state,
        result: {
          ...state.result,
          realization: realizationArray,
        },
      };
    }
    default:
      return state;
  }
};

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
  };

  const addMetaData = () => {
    if (!user.uid) return;
    dispatch({
      type: CreatorActions.ADD_META_DATA,
      payload: {
        owner: user.uid,
        meta: {
          createdAt: new Date().toString(),
          updatedAt: new Date().toString(),
          createdBy: user.uid,
        },
      },
    });
  };

  const addRealizationData = () => {
    if (!user.uid) return;
    dispatch({
      type: CreatorActions.ADD_REALIZATION_DATA,
    });
  };

  const finish = () => {
    if (!state.result) return;
    appDispatch(documentCreationFn(state.result))
      .unwrap()
      .then((result: IHabit) => {
        if (user.uid && result.id) {
          appDispatch(helperFn({ userId: user.uid, habitId: result.id }));
        }
      })
      .then(() =>
        dispatch({
          type: CreatorActions.CLOSE,
        }),
      );
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
