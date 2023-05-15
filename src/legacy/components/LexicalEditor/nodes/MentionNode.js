function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly &&
      (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })),
      keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2
      ? ownKeys(Object(source), !0).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(
          target,
          Object.getOwnPropertyDescriptors(source),
        )
      : ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(
            target,
            key,
            Object.getOwnPropertyDescriptor(source, key),
          );
        });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, 'string');
  return typeof key === 'symbol' ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (typeof input !== 'object' || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || 'default');
    if (typeof res !== 'object') return res;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (hint === 'string' ? String : Number)(input);
}
import { TextNode } from 'lexical';
function convertMentionElement(domNode) {
  const textContent = domNode.textContent;
  if (textContent !== null) {
    const node = $createMentionNode(textContent);
    return {
      node,
    };
  }
  return null;
}
const mentionStyle = 'background-color: rgba(24, 119, 232, 0.2)';
export class MentionNode extends TextNode {
  static getType() {
    return 'mention';
  }
  static clone(node) {
    return new MentionNode(node.__mention, node.__text, node.__key, node.__id);
  }
  static importJSON(serializedNode) {
    const node = $createMentionNode(serializedNode.mentionName);
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }
  constructor(mentionName, text, key, _id) {
    super(text !== null && text !== void 0 ? text : mentionName, key);
    this.__mention = mentionName;
    this.__id = _id;
  }
  exportJSON() {
    return _objectSpread(
      _objectSpread({}, super.exportJSON()),
      {},
      {
        mentionName: this.__mention,
        type: 'mention',
        version: 1,
      },
    );
  }
  createDOM(config) {
    const dom = super.createDOM(config);
    dom.style.cssText = mentionStyle;
    dom.className = 'mention';
    return dom;
  }
  exportDOM() {
    const element = document.createElement('a');
    // console.debug(this);
    element.setAttribute('data-lexical-mention', 'true');
    element.setAttribute('href', `/profile/${this.__id}`);
    element.textContent = this.__text;
    return {
      element,
    };
  }

  //   element: 'a',
  //   attributes: {id: data?.mention ? data?.mention?._id : data?._id,
  //
  //     href: data?.mention
  //       ? `/profile/${data?.mention?._id}`
  // : data?.href || data?.url,
  // },

  isSegmented() {
    return false;
  }
  static importDOM() {
    return {
      span: domNode => {
        if (!domNode.hasAttribute('data-lexical-mention')) {
          return null;
        }
        return {
          conversion: convertMentionElement,
          priority: 1,
        };
      },
    };
  }
  isTextEntity() {
    return true;
  }
  isToken() {
    return true;
  }
}
export function $createMentionNode(mentionName, mention, key, _id) {
  const mentionNode = new MentionNode(mentionName, null, null, _id);
  mentionNode.setMode('segmented').toggleDirectionless();
  return mentionNode;
}
export function $isMentionNode(node) {
  return node instanceof MentionNode;
}
