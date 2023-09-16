import React, { useReducer } from 'react';
import styled from 'styled-components';

import { Button } from '../components';
import {
  TRootState,
  useAppDispatch,
  useAppSelector,
  IHabit,
  TStandardHabitFreq,
  IGoal,
} from '../store';

enum CreatorActions {
  NEXT_STEP = 'NEXT_STEP',
  PREV_STEP = 'PREV_STEP',
  CLOSE = 'CLOSE',
  CHANGE_VALUE = 'CHANGE_VALUE',
  ADD_META_DATA = 'ADD_META_DATA',
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
          createdBy: string;
        };
      };
    };

type TCreatorResult = IHabit;

export interface ICreatorState {
  step: number;
  template?: string;
  result?: TCreatorResult;
}

export interface ICreatorSteps {
  state: ICreatorState;
  changeValue: (e: React.FormEvent<HTMLInputElement>) => void;
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
                payload.value === 'HOURLY' ||
                payload.value === 'DAILY' ||
                payload.value === 'WEEKLY' ||
                payload.value === 'MONTHLY' ||
                payload.value === 'YEARLY'
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
  stepsData: ({ state, changeValue }: ICreatorSteps) => React.ReactElement[];
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

  const changeValue = (e: React.FormEvent<HTMLInputElement>) => {
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
          createdBy: user.uid,
        },
      },
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
      {collection[state.step]}
      <StyledBttonsGroup>
        {state.step > 1 ? (
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
          />
        )}
        {state.step === collection.length - 2 && (
          <Button
            text={'Go to summary'}
            action={() => {
              addMetaData();
              nextStep();
            }}
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
