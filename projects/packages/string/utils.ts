/**
 * @packageDocumentation
 * @module string
 */

import { isNumber } from "../number/utils";

/**
 * 일치하는 모든 문자를 변경
 * @param text 소스 문자열
 * @param find 검색 문자열
 * @param replace 치환 문자열
 */
export function replaceAll(
  text: string,
  find: string,
  replace: string = ""
): string {
  if (!text) return text;
  if (!find) return text;
  return text.split(find).join(replace);
}

/**
 * 태그 문자열에서 태그를 모두 제거
 * @param tagText 소스 문자열
 * @param removeTabSpace 탭 문자를 제거할지 여부
 */
export function removeTag(
  tagText: string,
  removeTabSpace: boolean = true
): string {
  let refine = tagText.replace(/(<([^>]+)>)/gi, "");
  if (removeTabSpace) refine = replaceAll(refine, "\t", "");
  return refine;
}

/**
 * 소스 문자열의 맨 앞 문자를 대문자로 변경
 * @param text 소스 문자열
 */
export function toUpperCaseHead(text: string): string {
  const head = text.substring(0, 1).toUpperCase();
  const tail = text.substring(1, text.length);
  return `${head}${tail}`;
}

/**
 * 소스 문자열의 언더바(_)를 카멜 케이스로 변경
 * @param text 소스 문자열
 */
export function toCamelFromSnake(text: string): string {
  return text.replace(/([_][a-z])/gi, $1 => {
    return $1.toUpperCase().replace("_", "");
  });
}

/**
 * 소스 문자열의 하이픈(-)을 카멜 케이스로 변경
 * @param text 소스 문자열
 */
export function toCamelFromKebab(text: string): string {
  return text.replace(/([-][a-z])/gi, $1 => {
    return $1.toUpperCase().replace("-", "");
  });
}

/**
 * 소스 문자열을 단어 단위로 분리
 * @param text 소스 문자열
 */
export function toWordArray(text: string): string[] {
  const refine = [];
  const strReg = /\s*\S*/g;
  let word = strReg.exec(text)[0].trim();
  while (word) {
    if (word === "") break;
    refine.push(word);
    word = strReg.exec(text)[0].trim();
  }
  return refine;
}

/**
 * 지정된 인덱스에 문자를 삽입
 * @param text 소스 문자열
 * @param index 삽입될 인덱스
 * @param addText 삽입될 문자열
 */
export function insert(text: string, index: number, addText: string): string {
  let head = null;
  let tail = null;
  let refine;
  if (isNumber(index)) {
    const textLen = text.length;
    const safeIndex = index < 0 ? 0 : Math.min(index, textLen);
    head = text.substring(0, safeIndex);
    tail = text.substring(safeIndex, textLen);
    refine = `${head}${addText}${tail}`;
  } else {
    refine = text;
  }
  return refine;
}

/**
 * 문자열 좌측에 지정된 갯 수 만큼 문자 삽입
 * @param text 소스 문자열
 * @param addText 추가될 문자열
 * @param expectCount 합쳐진 문자열 수
 */
export function padStart(
  text: string | number,
  addText: string,
  expectCount: number = 1
): string {
  let refine;
  if (typeof text === "string" || typeof text === "number") {
    refine = text.toString();
    const len = refine.length;
    const count = expectCount - len;
    const adds = Array.from(Array(count)).map(() => addText);
    refine = `${adds.join("")}${text}`;
    if (expectCount < refine.length) {
      refine = refine.substring(refine.length - expectCount, refine.length);
    }
  } else {
    refine = text;
  }
  return refine;
}

/**
 * 문자열 우측에 지정된 갯 수 만큼 문자 삽입
 * @param text 소스 문자열
 * @param addText 추가될 문자열
 * @param expectCount 합쳐진 문자열 수
 */
export function padEnd(
  text: string | number,
  addText: string,
  expectCount: number = 1
): string {
  let refine;
  if (typeof text === "string" || typeof text === "number") {
    refine = text.toString();
    const len = refine.length;
    const count = expectCount - len;
    const adds = Array.from(Array(count)).map(() => addText);
    refine = `${text}${adds.join("")}`;
    if (expectCount < refine.length) {
      refine = refine.substring(0, expectCount);
    }
  } else {
    refine = text;
  }
  return refine;
}

/**
 * 지정된 시간 숫자 앞에 0을 채워야 하는 경우 0을 채움.
 * (예: 2 -> 02, 9 -> 09, 10 -> 10)
 * @param time 시간 표시용 숫자 | 문자
 */
export function leadingTime(time: string | number): string {
  let refine;
  if (isNumber(time)) {
    const safeNum = Number(time);
    refine = 0 <= safeNum && safeNum < 10 ? `0${safeNum}` : time.toString();
  } else {
    refine = time;
  }
  return refine;
}

/**
 * 가격 포맷 옵션
 */
export interface CurrencyPriceOption {
  /**
   * 소숫점 까지 표시되어야 하는 경우 지정된 숫자만큼 표시
   * (예: fixed = 1 -> 99.0, fixed = 2 -> 99.00)
   */
  fixed?: number;

  /**
   * 가격 표시 중간에 들어가 대치 문자
   */
  replaceChar?: string;
}

/**
 * 지정된 숫자(문자)를 가격 표시용 문자로 변경
 * (예: 1000 -> 1,000)
 * @param price 가격 문자 | 숫자
 * @param options 옵션
 */
export function toCurrencyFormat(
  price: string | number,
  options: CurrencyPriceOption = {}
): string {
  if (!isNumber(price)) {
    return String(price);
  }
  const { fixed = 0, replaceChar = "," } = options;
  const safeStr = String(price);
  let refine = "";
  let splits = safeStr.split(".");
  let decimal = "";
  let normal = splits[0];
  normal = Number(normal)
    .toFixed(1)
    .replace(/\d(?=(\d{3})+\.)/g, `$&${replaceChar}`);
  normal = normal.substring(0, normal.length - 2);

  const hasPoint = /\./.test(safeStr);
  if (hasPoint) {
    decimal = splits[1];
  }

  if (0 < fixed) {
    const decimalLen = decimal.length;
    if (decimalLen < fixed) {
      const pad = Array.from(Array(fixed - decimalLen))
        .map(() => "0")
        .join("");
      decimal = `${decimal}${pad}`;
    } else {
      decimal = decimal.substring(0, fixed);
    }
    refine = `${normal}.${decimal}`;
  } else {
    refine = hasPoint ? `${normal}.${decimal}` : normal;
  }
  return refine;
}

/**
 * 지정된 소스 문자열이 기준 수를 넘어가면 좌, 우로 잘라내고 사이에 대체 문자를 삽입.
 * @param text 소스 문자열
 * @param max 잘라낼 기준 수
 * @param alternative 잘라낸 문자열 사이에 들어갈 문자열
 */
export function toEllipsisMiddle(
  text: string,
  max: number = 50,
  alternative: string = "..."
): string {
  if (!text) return text;
  let refine = text.toString();
  const strLen = refine.length;
  if (max < strLen) {
    const half = Math.floor(max / 2);
    let strStart = refine.substring(0, half);
    let strEnd = refine.substring(strLen - half, strLen);
    refine = `${strStart}${alternative}${strEnd}`;
  }
  return refine;
}

/**
 * 지정된 소스 문자열이 기준 수를 넘어가면 마지막을 잘라내고 문자를 삽입.
 * (예: abcdefghijklmn -> abcd...)
 * @param text 소스 문자열
 * @param max 잘라낼 기준 수
 * @param alternative 잘라낸 문자열 마지막에 들어갈 문자열
 */
export function toEllipsisEnd(
  text: string,
  max: number = 50,
  alternative: string = "..."
): string {
  if (!text) return null;
  let refine = text.toString();
  const strLen = refine.length;
  if (max < strLen) {
    refine = `${refine.substring(0, max)}${alternative}`;
  }
  return refine;
}

/**
 * @hidden
 */
let _domParser: DOMParser = null;

/**
 * 엔티티 코드로 변형된 html 을 태그 문자열로 변경
 * (예: &lt;&nbsp;1&amp;2&nbsp;&gt; -> < 1&2 >)
 * @param source 소스 문자열
 */
export function refineSafeHtmlText(source: string): string {
  let refine = "";
  try {
    if (!_domParser) _domParser = new DOMParser();
    const dom = _domParser.parseFromString(source, "text/html");
    refine = dom.body.textContent;
  } catch (err) {
    refine = source;
  }
  return refine;
}

/**
 * html 문자열의 엔티티 처리
 * @param text 소스(html) 문자열
 */
export function escape(text: string): string {
  return text.replace(/[<>&]/g, function(match) {
    switch (match) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      default:
        return match;
    }
  });
}

/**
 * 시작 공백 제거
 * @param {string} text 소스 문자열
 */
export function trimStart(text: string) {
  return text.replace(/^(\u2800|&#10240;|\s)+/g, "");
}

/**
 * 끝 공백 제거
 * @param {string} text 소스 문자열
 */
export function trimEnd(text: string) {
  return text.replace(/(\u2800|&#10240;|\s)+$/g, "");
}

/**
 * u+2800, &#10240 을 일반 문자 공백으로 치환
 * @param {string} text 소스 문자열
 */
export function refineWhitespace(text: string) {
  return text.replace(/(\u2800|&#10240;)/g, " ");
}

/**
 * allow 이상 연속되는 줄바꿈을 제거
 * @param text
 * @param [allow=2]
 */
export function collapseMultiline(text: string, allow: number = 2) {
  const separate = text.split(/\n/);
  const refine: string[] = [];
  const testReg: RegExp = /[^\s]/;
  let cnt: number = 0;
  separate.forEach((str: string) => {
    const isBreak = !testReg.test(str);
    if (isBreak) {
      cnt++;
      if (cnt < allow) {
        refine.push(str);
      }
    } else {
      refine.push(str);
      cnt = 0;
    }
  });
  return refine.join("\n");
}
