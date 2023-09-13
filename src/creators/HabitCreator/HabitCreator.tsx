import React, { useReducer } from 'react';
import styled from 'styled-components';

import { FormField, Button } from '../../components';
import {
  TRootState,
  useAppDispatch,
  useAppSelector,
  createHabit,
  IHabit,
  TStandardHabitFreq,
  THabitFreq,
} from '../../store';

enum CreatorActions {
  NEXT_STEP = 'NEXT_STEP',
  PREV_STEP = 'PREV_STEP',
  CLOSE = 'CLOSE',
  CHANGE_VALUE = 'CHANGE_VALUE',
  ADD_META_DATA = 'ADD_META_DATA',
}

type TCreatorAction =
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

export interface IHabitCreatorState {
  step: number;
  template?: string;
  result?: IHabit;
}

const initialHabitCreatorState = {
  step: 1,
  result: {
    frequency: {
      category: 'STANDARD',
      type: 'DAILY',
    } as THabitFreq,
    startDate: new Date().toString(),
  },
};

export const habitCreatorReducer = (
  state: IHabitCreatorState,
  action: TCreatorAction,
): IHabitCreatorState => {
  const { type, payload } = action;
  switch (type) {
    case CreatorActions.PREV_STEP:
      return {
        ...state,
        step: state.step >= 2 ? state.step - 1 : 1,
      };
    case CreatorActions.NEXT_STEP:
      return {
        ...state,
        step: state.step + 1,
      };
    case CreatorActions.CLOSE:
      return initialHabitCreatorState;
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

const StyledFieldsGroup = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
`;

interface ICreatorStepProps {
  state: IHabitCreatorState;
  changeValue: (e: React.FormEvent<HTMLInputElement>) => void;
}

const CreatorStep = ({ state, changeValue }: ICreatorStepProps) => {
  switch (state.step) {
    case 1:
      return (
        <FormField
          id={'creator-field-name'}
          name={'name'}
          type={'text'}
          value={state.result?.name}
          required
          label={'Name:'}
          description={
            'How would you like to name your new habit? Use something simple and meaningful, like "Everyday jogging", "Weekly garden cleaning" or "Another day without a cigarette"'
          }
          onChange={(e) => changeValue(e)}
        />
      );
    case 2:
      return (
        <FormField
          id={'creator-field-start-date'}
          name={'startDate'}
          type={'date'}
          value={state.result?.startDate}
          label={'Start date:'}
          description={
            'When are you starting? Select a date in the past if you are already following your new habit.'
          }
          onChange={(e) => changeValue(e)}
        />
      );
    case 3:
      return (
        <FormField
          id={'creator-field-end-date'}
          name={'endDate'}
          type={'date'}
          value={state.result?.endDate}
          label={'End date:'}
          description={
            'Is there a date in the future when you would like to remove or modify this habit? If so, then provide it here. When time comes, we will notify you that your habit needs an update.'
          }
          onChange={(e) => changeValue(e)}
        />
      );
    case 4:
      return (
        <StyledFieldsGroup>
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
            onChange={(e) => changeValue(e)}
          />
          {/* {state.result?.frequency?.category === 'TIMES'
          ? <Input
            id={'new-habit-freq-value'}
            name={'frequency.value'}
            type={'number'}
            value={state.result?.frequency?.value}
            onChange={(e) => changeTextValue(e)}
          />
          : state.result?.frequency?.category === 'SPECIFIC'
          ? <Input
            id={'new-habit-freq-value'}
            name={'frequency.value'}
            type={'number'}
            value={state.result?.frequency?.value}
            onChange={(e) => changeTextValue(e)}
          />
          : null
        } */}
        </StyledFieldsGroup>
      );
    // case 5: return (
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
    //     onChange={(e) => changeValue(e)}
    //   />
    case 5:
      return (
        <FormField
          id={'creator-field-description'}
          name={'description'}
          type={'textarea'}
          value={state.result?.description}
          label={'Description:'}
          description={'Short description or notes about your new habit'}
          onChange={(e) => changeValue(e)}
        />
      );
    case 6:
      return (
        <div>
          <p>All done</p>
        </div>
      );
    default:
      return null;
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

const HabitCreator = () => {
  const appDispatch = useAppDispatch();
  const user = useAppSelector((state: TRootState) => state.auth);
  const [state, dispatch] = useReducer(
    habitCreatorReducer,
    initialHabitCreatorState,
  );

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
    appDispatch(createHabit(state.result))
      .unwrap()
      // .then((result) => {
      //   if (user.uid && result.id) {
      //     appDispatch(addUserHabit({ userId: user.uid, habitId: result.id }));
      //   }
      // })
      .then(() =>
        dispatch({
          type: CreatorActions.CLOSE,
        }),
      );
  };

  return (
    <StyledWrapper>
      <CreatorStep
        state={state}
        changeValue={changeValue}
      />
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
        {state.step < 5 && (
          <Button
            text={'Continue'}
            action={nextStep}
          />
        )}
        {state.step === 5 && (
          <Button
            text={'Go to summary'}
            action={() => {
              addMetaData();
              nextStep();
            }}
          />
        )}
        {state.step === 6 && (
          <Button
            text={'Finish'}
            action={finish}
          />
        )}
      </StyledBttonsGroup>
    </StyledWrapper>
  );
};

export default HabitCreator;
