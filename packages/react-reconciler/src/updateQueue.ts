import { Action } from "shared/ReactTypes";

/**
 * 更新方式
 * this.setState(xxx) / this.setState(x => xx)
 */
export interface Update<State> {
  action: Action<State>;
}

export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null;
  };
}

/**
 * 创建更新
 * @param {Action<State>} action
 * @returns {Update<State>}
 */
export const createUpdate = <State>(action: Action<State>): Update<State> => {
  return {
    action,
  };
};

/**
 * 初始化updateQueue
 * @returns {UpdateQueue<State>}
 */
export const createUpdateQueue = <State>() => {
  return {
    shared: {
      pending: null,
    },
  } as UpdateQueue<State>;
};

/**
 * 更新update
 * @param {UpdateQueue<State>} updateQueue
 * @param {Update<State>} update
 */
export const enqueueUpdate = <State>(
  updateQueue: UpdateQueue<State>,
  update: Update<State>
) => {
  updateQueue.shared.pending = update;
};

/**
 * 消费updateQueue
 */
export const processUpdateQueue = <State>(
  baseState: State,
  pendingUpdate: Update<State> | null
): {
  memoizedState: State;
} => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizedState: baseState,
  };
  if (pendingUpdate !== null) {
    const action = pendingUpdate.action;
    if (action instanceof Function) {
      // baseState 1 update (x) => 4x  -> memoizedState 4
      result.memoizedState = action(baseState);
    } else {
      // baseState 1 update 2 -> memoizedState 2
      result.memoizedState = action;
    }
  }
  return result;
};
