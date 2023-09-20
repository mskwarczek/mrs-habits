import {
  IHabitTemplate,
  THabitRealizationValue,
  TStandardHabitFreq,
} from '../store';
import {
  getProperDateString,
  getTimeSinceDate,
  addDays,
} from '../utils/datetime';

export enum CreatorActions {
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

type TCreatorResult = IHabitTemplate;

export interface ICreatorState {
  step: number;
  template?: string;
  result?: TCreatorResult;
}

export const initialCreatorState = {
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
      if (!state.result?.startDate) return state; // TODO: error and / or step change
      if (!state.result?.defaultRealizationValue) return state; // TODO: error and / or step change
      const days = getTimeSinceDate(state.result.startDate).days;
      const realizationArray = [];
      if (days >= 0) {
        const today = new Date().setHours(0, 0, 0, 0);
        const endDate = state.result?.endDate
          ? new Date(state.result?.endDate).setHours(0, 0, 0, 0)
          : false;
        let selectedDay = new Date(state.result?.startDate);
        let selectedDayHours = selectedDay.setHours(0, 0, 0, 0);
        while (
          selectedDayHours <= today &&
          (!endDate || selectedDayHours <= endDate)
        ) {
          const date = getProperDateString(selectedDay);
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

export default creatorReducer;
