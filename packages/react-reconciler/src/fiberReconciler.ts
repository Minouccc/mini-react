import { Container } from "hostConfig";
import { FiberNode, FiberRootNode } from "./fiber";
import { HostRoot } from "./workTags";
import {
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
  UpdateQueue,
} from "./updateQueue";
import { ReactElement } from "shared/ReactTypes";
import { scheduleUpdateOnFiber } from "./workLoop";

/**
 * ReactDOM.createRoot()中调用
 * 1. 创建fiberRootNode 和 hostRootFiber。并建立联系
 * @param {Container} container
 */
export function createContainer(container: Container) {
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  const fiberRootNode = new FiberRootNode(container, hostRootFiber);
  hostRootFiber.updateQueue = createUpdateQueue();
  return fiberRootNode;
}

/**
 * ReactDOM.createRoot().render 中调用更新
 * 1. 创建update, 并将其推到enqueueUpdate中
 */
export function updateContainer(
  element: ReactElement | null,
  root: FiberRootNode
) {
  const hostRootFiber = root.current;
  const update = createUpdate<ReactElement | null>(element);
  enqueueUpdate(
    hostRootFiber.updateQueue as UpdateQueue<ReactElement | null>,
    update
  );
  // 插入更新后，进入调度
  scheduleUpdateOnFiber(hostRootFiber);
  return element;
}
