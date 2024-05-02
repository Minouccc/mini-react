import type { Props, Key, Ref, ReactElement } from "shared/ReactTypes";
import { FunctionComponent, HostComponent, type WorkTag } from "./workTags";
import { Flags, NoFlags } from "./fiberFlags";
import { Container } from "./hostConfig";

export class FiberNode {
  /** fiber 标签 证明是什么类型fiber */
  tag: WorkTag;
  /** key调和子节点时候用到 */
  key: Key;
  /** 指向对应的真实dom元素，类组件指向组件实例，可以被ref获取 */
  stateNode: any;
  /** dom元素是对应的元素类型，比如div，组件指向组件对应的类或者函数 */
  type: any;
  /** 指向父级fiber */
  return: FiberNode | null;
  /** 指向兄弟fiber */
  sibling: FiberNode | null;
  /** 指向子级fiber */
  child: FiberNode | null;
  /** 索引 */
  index: number;
  /** ref指向，ref函数，或者ref对象 */
  ref: Ref;
  /** 在一次更新中，代表element创建 */
  pendingProps: Props;
  /** 记录上一次更新完毕后的props */
  memoizedProps: Props | null;
  /** 类组件保存state信息，函数组件保存hooks信息，dom元素为null */
  memoizedState: any;
  /** 双缓存树，指向缓存的fiber。更新阶段，两颗树互相交替 */
  alternate: FiberNode | null;
  /** 副作用标识 */
  flags: Flags;
  /** 子树中的副作用 */
  subtreeFlags: Flags;
  /** 类组件存放setState更新队列，函数组件存放 */
  updateQueue: unknown;

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    this.tag = tag;
    this.pendingProps = pendingProps;
    this.key = key;
    this.stateNode = null; // dom引用
    this.type = null; // 组件本身  FunctionComponent () => {}

    // 树状结构
    this.return = null; // 指向父fiberNode
    this.sibling = null; // 兄弟节点
    this.child = null; // 子节点
    this.index = 0; // 兄弟节点的索引

    this.ref = null;

    // 工作单元
    this.pendingProps = pendingProps; // 等待更新的属性
    this.memoizedProps = null; // 正在工作的属性
    this.memoizedState = null;
    this.updateQueue = null;

    this.alternate = null; // 双缓存树指向(workInProgress 和 current切换）

    this.flags = NoFlags; // 副作用标识
    this.subtreeFlags = NoFlags; // 子树中的副作用
  }
}

export class FiberRootNode {
  container: Container; // 不同环境的不同的节点 在浏览器环境 就是 root节点
  current: FiberNode;
  finishedWork: FiberNode | null; // 递归完成后的hostRootFiber
  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container;
    this.current = hostRootFiber;
    hostRootFiber.stateNode = this;
    this.finishedWork = null;
  }
}

export const createWorkInProgress = (
  current: FiberNode,
  pendingProps: Props
): FiberNode => {
  let wip = current.alternate;

  if (wip === null) {
    //mount
    wip = new FiberNode(current.tag, pendingProps, current.key);
    wip.stateNode = current.stateNode;

    wip.alternate = current;
    current.alternate = wip;
  } else {
    //update
    wip.pendingProps = pendingProps;
    // 清掉副作用（上一次更新遗留下来的）
    wip.subtreeFlags = NoFlags;
    wip.flags = NoFlags;
  }

  wip.type = current.type;
  wip.updateQueue = current.updateQueue;
  wip.child = current.child;
  wip.memoizedProps = current.memoizedProps;
  wip.memoizedState = current.memoizedState;
  return wip;
};

export function createFiberFromElement(element: ReactElement): FiberNode {
  const { type, key, props } = element;
  let fiberTag: WorkTag = FunctionComponent;

  if (typeof type === "string") {
    // <div/>  type : 'div'
    fiberTag = HostComponent;
  } else if (typeof type !== "function" && __DEV__) {
    console.log("未定义的type类型", element);
  }
  const fiber = new FiberNode(fiberTag, props, key);
  fiber.type = type;
  return fiber;
}
