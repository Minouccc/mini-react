import { createFiber } from "./ReactFiber";
import { isArray, isStringOrNumber, updateNode } from "./utils";

// 原生标签
export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);
    updateNode(wip.stateNode, wip.props);
  }

  reconcileChildren(wip, wip.props.children);
  console.log(wip, "wip");
}

export function updateFunctionComponent() {}

export function updateClassComponent() {}

export function updateFragmentComponent() {}

export function updateHostTextComponent() {}

// 协调（diff）
function reconcileChildren(wip, children) {
  const newChildren = isArray(children) ? children : [children];
  let previousNewFiber = null;
  if (isStringOrNumber(children)) {
    return;
  }
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    if (newChild === null) {
      continue;
    }
    const newFiber = createFiber(newChild, wip);
    if (previousNewFiber === null) {
      // head node
      wip.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }
}
