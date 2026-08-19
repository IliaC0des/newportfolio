export function splitWords(el: HTMLElement, className = 'word'): HTMLElement[] {
  if (el.dataset['split'] === 'done') {
    return Array.from(el.querySelectorAll<HTMLElement>(`.${className}`));
  }
  const source = el.textContent ?? '';
  const fragment = document.createDocumentFragment();
  const words: HTMLElement[] = [];
  for (const token of source.split(/(\s+)/)) {
    if (!token) continue;
    if (/^\s+$/.test(token)) {
      fragment.appendChild(document.createTextNode(' '));
      continue;
    }

    const span = document.createElement('span');
    span.className = className;
    span.textContent = token;
    span.style.display = 'inline-block';
    fragment.appendChild(span);
    words.push(span);
  }
  el.textContent = '';
  el.appendChild(fragment);
  el.dataset['split'] = 'done';
  return words;
}

export function splitChars(el: HTMLElement): HTMLElement[] {
  if (el.dataset['split'] === 'chars') {
    return Array.from(el.querySelectorAll<HTMLElement>('.char'));
  }
  const source = el.textContent ?? '';
  const fragment = document.createDocumentFragment();
  const chars: HTMLElement[] = [];
  for (const word of source.split(/(\s+)/)) {
    if (!word) continue;
    if (/^\s+$/.test(word)) {
      fragment.appendChild(document.createTextNode(' '));
      continue;
    }

    const wrap = document.createElement('span');
    wrap.className = 'word';
    wrap.style.display = 'inline-block';
    wrap.style.whiteSpace = 'nowrap';
    for (const char of Array.from(word)) {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char;
      span.style.display = 'inline-block';
      wrap.appendChild(span);
      chars.push(span);
    }
    fragment.appendChild(wrap);
  }
  el.textContent = '';
  el.appendChild(fragment);
  el.dataset['split'] = 'chars';
  return chars;
}
