import { $e } from '../$e';
import { Chapter } from '../../Data';
import { CHAPTER_FAILED, GO_TO_MENU, NEXT_CHAPTER, PREVIOUS_CHAPTER } from '../constant/messages';
import { AutoCache } from '../data/AutoCache';
import { authorInfoMap, ChapterContext, relativePathLookUpMap } from '../data/data';
import { chapterHref, pageHref, tagSearchHref } from '../data/hrefs';
import { updateChapterProgress } from '../data/readingProgress';
import { earlyAccess, gestureSwitchChapter, showAbandonedChapters } from '../data/settings';
import { DebugLogger } from '../DebugLogger';
import { Event } from '../Event';
import { h } from '../hs';
import { SwipeDirection, swipeEvent } from '../input/gestures';
import { ArrowKey, arrowKeyPressEvent, escapeKeyPressEvent } from '../input/keyboard';
import { getTextNodes, id } from '../util/DOM';
import { formatRelativePath } from '../util/formatRelativePath';
import { removePotentialSuffix } from '../util/string';
import { tagSpan } from '../util/tag';
import { smartThrottle } from '../util/throttle';
import { resetUrlArgumentsTo } from '../util/urlArguments';
import { addPushHelperBlock } from './pushHelper';
import { loadChapterComments } from './commentsControl';
import { Content, ContentBlock, ContentBlockSide, ContentBlockStyle, focus, newContent, Side } from './contentControl';
import { followQuery } from './followQuery';
import { Layout, setLayout } from './layoutControl';
import { enterMenuMode } from './menuControl';
import { isAnyModalOpened, Modal } from './modalControl';
import { resetProgressIndicator, setNavbarPath, setProgressIndicator } from './navbarControl';
import { processElements } from './processElements';
import { addPreloaderBlock } from './preloaderBlock';

type Selection = [number, number, number, number];

const debugLogger = new DebugLogger('Chapter Control');

export const loadChapterEvent = new Event<string>();

/** This is only used for determining the direction of animation when changing chapter. */
let lastChapterCtx: ChapterContext | null = null;

const select = (textNodes: Array<Text>, [
  anchorNodeIndex,
  anchorOffset,
  focusNodeIndex,
  focusOffset,
]: Selection) => {
  const anchorNode = textNodes[anchorNodeIndex];
  const focusNode = textNodes[focusNodeIndex];
  if (anchorNode === undefined || focusNode === undefined) {
    return;
  }
  document.getSelection()!.setBaseAndExtent(
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset,
  );
  const element = anchorNode.parentElement;
  if (element !== null && (typeof element.scrollIntoView) === 'function') {
    element.scrollIntoView();
  }
};

export function canChapterShown(chapter: Chapter) {
  return (earlyAccess.getValue() || !chapter.isEarlyAccess)
    && (!chapter.hidden)
    && (showAbandonedChapters.getValue() || !chapter.abandoned);
}

function findNextChapter(chapterCtx: ChapterContext) {
  const index = chapterCtx.inFolderIndex;
  const folderChapters = chapterCtx.folder.children;
  for (let i = index + 1; i < folderChapters.length; i++) {
    const child = folderChapters[i];
    if (child.type !== 'folder' && canChapterShown(child)) {
      return child;
    }
  }
  return null;
}

function findPreviousChapter(chapterCtx: ChapterContext) {
  const index = chapterCtx.inFolderIndex;
  const folderChapters = chapterCtx.folder.children;
  for (let i = index - 1; i >= 0; i--) {
    const child = folderChapters[i];
    if (child.type !== 'folder' && canChapterShown(child)) {
      return child;
    }
  }
  return null;
}

function getChapterRelativeLink(chapter: Chapter) {
  return `${window.location.pathname}#/chapter/${chapter.htmlRelativePath}`;
}

function navigateToChapter(chapter: Chapter) {
  window.location.href = getChapterRelativeLink(chapter);
}

const chaptersCache = new AutoCache<string, string>(
  chapterHtmlRelativePath => {
    const url = `./chapters/${chapterHtmlRelativePath}`;
    debugLogger.log(`Loading chapter from ${url}.`);
    return fetch(url).then(response => response.text());
  },
  new DebugLogger('Chapters Cache'),
);

function updateNavbar(htmlRelativePath: string) {
  setNavbarPath([
    {
      display: '所有书目',
      hash: '#/menu/书目选择/所有书目',
    },
    ...htmlRelativePath.split('/').map((segment, index, split) => {
      segment = segment.replace(/-/g, ' ');
      if (index === split.length - 1) {
        // Last element
        return {
          display: removePotentialSuffix(segment, '.html'),
          hash: null,
        };
      } else {
        return {
          display: segment,
          hash: `#/menu/书目选择/所有书目/${split.slice(0, index + 1).join('/')}`,
        };
      }
    })
  ]);
}

function addAuthorsInfoBlock(content: Content, chapter: Chapter) {
  if (chapter.authors.length > 0) {
    const $authorsDiv = h('.authors',
      h('h3', '本文作者'),
      h('.outer-container',
        ...chapter.authors.map(authorRole => {
          const authorInfo = authorInfoMap.get(
            authorRole.name
          ) ?? {
            name: authorRole.name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authorRole.name)}`,
          };
          return h('.author-container',
            {
              onclick: () => {
                window.history.pushState(null, document.title, pageHref(`author/${authorInfo.name}`));
                followQuery();
              },
            },
            h('img.avatar', {
              src: authorInfo.avatar,
            }),
            h('.author-role-container',
              h('.role', authorRole.role),
              h('.name', authorInfo.name),
            ),
          );
        }),
        h('.reprint', {
          href: '#',
          onclick: ((event: any) => {
            event.preventDefault();
            const modal = new Modal(h('div',
              h('h1', '转载须知'),
              h('p',
                '晶体图书馆内所有文章均以 ',
                h('a.regular', {
                  target: '_blank',
                  href: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
                  rel: 'noopener noreferrer',
                }, 'CC BY-NC-ND 4.0'),
                ' 协议发布。转载时请注明以下信息：',
              ),
              h('pre.wrapping', h('code',
                '本文内容摘自晶体图书馆（https://crystaltechstudio.github.io/Library）。' +
                  chapter.authors.map(authorInfo => authorInfo.role + '：' + authorInfo.name).join('，') +
                  '。本文以 CC BY-NC-ND 4.0 协议发布，转载请注明上述所有信息。'
              )),
              h('.button-container', [
                h('div', {
                  onclick: () => {
                    modal.close();
                  },
                }, '我知道了'),
              ]),
            ));
            modal.setDismissible();
            modal.open();
          }),
        }, h('div', '转载须知')),
      ),
    ) as HTMLDivElement;
    content.addBlock({ initElement: $authorsDiv, side: ContentBlockSide.LEFT });
  }
}

function addTagInfoBlock(content: Content, chapter: Chapter) {
  if (chapter.tags !== undefined) {
    content.addBlock({
      initElement: (
        <div className='tags'>
          <h3>本文标签</h3>
          { chapter.tags.map(tag => (
            <a href={ tagSearchHref(tag) }>
              { tagSpan(tag, false) }
            </a>
          )) }
        </div>
      ) as HTMLDivElement,
      side: ContentBlockSide.LEFT,
    });
  } else if (!chapter.htmlRelativePath.includes('META')) {
    content.addBlock({
      initElement: (
        <div>
          <h3>本文标签缺失</h3>
          <p>本文目前没有标签。</p>
        </div>
      ),
      side: ContentBlockSide.LEFT,
    });
  }
}

function loadChapter(
  chapterHtmlRelativePath: string,
  selection?: Selection,
  side: Side = Side.LEFT,
) {
  debugLogger.log('Load chapter', chapterHtmlRelativePath, 'with selection', selection);
  loadChapterEvent.emit(chapterHtmlRelativePath);
  const chapterCtx = relativePathLookUpMap.get(chapterHtmlRelativePath)!;
  lastChapterCtx = chapterCtx;

  document.title = formatRelativePath(chapterHtmlRelativePath) + ' - 晶体图书馆';
  window.history.replaceState(null, document.title);

  updateNavbar(chapterHtmlRelativePath);

  const content = newContent(side);

  maybeAddEarlyAccessWarning(chapterCtx, content);
  maybeAddAbandonedWarning(chapterCtx, content);
  maybeAddDevelopDocWarning(chapterCtx, content);
  const loadingBlock = addPreloaderBlock(content);

  setLayout(Layout.MAIN);

  function loadPrevChapter() {
    const previousChapter = findPreviousChapter(chapterCtx);
    if (previousChapter !== null) {
      navigateToChapter(previousChapter);
    }
  }
  function loadNextChapter() {
    const nextChapter = findNextChapter(chapterCtx);
    if (nextChapter !== null) {
      navigateToChapter(nextChapter);
    }
  }

  registerSwipeEvents(loadPrevChapter, loadNextChapter, content);
  registerArrowKeyEvents(loadPrevChapter, loadNextChapter, content);
  attachEscapeEvent(content);
  chaptersCache.get(chapterHtmlRelativePath).then(text => {
    if (content.isDestroyed) {
      debugLogger.log('Chapter loaded, but abandoned since the original ' +
        'content page is already destroyed.');
      return;
    }
    debugLogger.log('Chapter loaded.');

    loadingBlock.directRemove();
    content.appendLeftSideContainer();
    const mainBlock = insertContent(content, text, chapterCtx.chapter);
    const postMainBlock = mainBlock ?? content.addBlock();
    content.appendRightSideContainer();
    addAuthorsInfoBlock(content, chapterCtx.chapter);
    addTagInfoBlock(content, chapterCtx.chapter);
    addPushHelperBlock(content, chapterCtx.chapter);

    const textNodes = getTextNodes(postMainBlock.element);
    restoreSelections(selection, textNodes);
    registerSelectionChangeListener(textNodes, content);
    addPageSwitcherBlock(chapterCtx, postMainBlock);
    startUpdatingProgressBar(mainBlock, content, chapterCtx);

    // Re-focus the rect so it is arrow-scrollable
    setTimeout(() => {
      focus();
    }, 1);
    loadChapterComments(chapterCtx, content);
  }).catch(error => {
    debugLogger.error(`Failed to load chapter.`, error);
    loadingBlock.element.innerText = CHAPTER_FAILED;
  });
}

export enum ErrorType {
  COMPILE,
  RUNTIME,
  INTERNAL,
}

function registerSelectionChangeListener(textNodes: Array<Text>, content: Content) {
  const selectionChangeListener = getSelectionChangeListener(textNodes);
  document.addEventListener('selectionchange', selectionChangeListener);
  content.leavingEvent.once(() => {
    document.removeEventListener('selectionchange', selectionChangeListener);
  });
}

function restoreSelections(selection: Selection | undefined, textNodes: Array<Text>) {
  if (selection !== undefined) {
    if (id('warning') === null) {
      select(textNodes, selection);
    } else {
      id('warning').addEventListener('click', () => {
        select(textNodes, selection);
      });
    }
  }
}

function maybeAddAbandonedWarning(chapterCtx: ChapterContext, content: Content) {
  if (chapterCtx.chapter.abandoned) {
    content.addBlock({
      initElement: (
        <div>
          <h1>弃坑警告</h1>
          <p>本文作者已弃坑，文章内容并不完整。</p>
        </div>
      ),
      style: ContentBlockStyle.WARNING,
    });
  }
}

function maybeAddEarlyAccessWarning(chapterCtx: ChapterContext, content: Content) {
  if (chapterCtx.chapter.isEarlyAccess) {
    content.addBlock({
      initElement: (
        <div>
          <h1>编写中章节</h1>
          <p>请注意，本文正在编写中，因此可能会含有未完成的句子或是尚未更新的信息。</p>
        </div>
      ),
      style: ContentBlockStyle.WARNING,
    });
  }
}

function maybeAddDevelopDocWarning(chapterCtx: ChapterContext, content: Content) {
  if (chapterCtx.chapter.htmlRelativePath.startsWith('开发文档留档/')) {
    content.addBlock({
      initElement: (
        <div>
          <h1>本文是开发文档的留档</h1>
          <p>请注意，留档为原开发文档的镜像，可能无法及时更新，请以官方文档为主。</p>
        </div>
      ),
      style: ContentBlockStyle.WARNING,
    });
    if (chapterCtx.chapter.translated) {
      content.addBlock({
        initElement: (
          <div>
            <p>该文档已基于原文档的基础翻译完成。</p>
          </div>
        ),
        style: ContentBlockStyle.WARNING,
      });
    }
  }
}

function addPageSwitcherBlock(chapterCtx: ChapterContext, postMainBlock: ContentBlock) {
  const prevChapter = findPreviousChapter(chapterCtx);
  const nextChapter = findNextChapter(chapterCtx);
  postMainBlock.element.appendChild(h('div.page-switcher', [
    // 上一章
    (prevChapter !== null)
      ? h('a', {
        href: getChapterRelativeLink(prevChapter),
      }, PREVIOUS_CHAPTER)
      : null,

    // 返回菜单
    h('a', {
      href: window.location.pathname,
      onclick: (event: MouseEvent) => {
        event.preventDefault();
        enterMenuMode();
      },
    }, GO_TO_MENU),

    // 下一章
    (nextChapter !== null)
      ? h('a', {
        href: getChapterRelativeLink(nextChapter),
      }, NEXT_CHAPTER)
      : null,
  ]));
}

function startUpdatingProgressBar(mainBlock: ContentBlock | undefined, content: Content, chapterCtx: ChapterContext) {
  if (mainBlock !== undefined) {
    const updateProgress = smartThrottle(() => {
      const scrollableRange = mainBlock.element.clientHeight - content.$element.clientHeight;
      let progress;
      if (scrollableRange > 0) {
        progress = (content.$element.scrollTop - mainBlock.element.offsetTop) / scrollableRange;
      } else {
        progress = (content.$element.scrollTop + content.$element.clientHeight) > (mainBlock.element.offsetTop + mainBlock.element.clientHeight) ? 1 : 0;
      }
      progress = Math.min(progress, 1);
      progress = Math.max(progress, 0);
      setProgressIndicator(progress);
      updateChapterProgress(chapterCtx.chapter.htmlRelativePath, progress)
        .catch(error => debugLogger.warn(`Failed to save chapter progress for ${chapterCtx.chapter.htmlRelativePath}:`, error));
    }, 100);
    content.scrollEvent.on(() => {
      updateProgress();
    });
    content.leavingEvent.on(() => {
      resetProgressIndicator();
    });
  }
}

function getSelectionChangeListener(textNodes: Array<Text>) {
  return smartThrottle(() => {
    const selection = document.getSelection();
    const urlArguments = new Map<string, string>();
    if (selection !== null) {
      const anchor = ((selection.anchorNode instanceof HTMLElement)
        ? selection.anchorNode.firstChild
        : selection.anchorNode) as Text;
      const anchorNodeIndex = textNodes.indexOf(anchor);
      const focus = ((selection.focusNode instanceof HTMLElement)
        ? selection.focusNode.firstChild
        : selection.focusNode) as Text;
      const focusNodeIndex = textNodes.indexOf(focus);
      if ((anchorNodeIndex !== -1) && (focusNodeIndex !== -1) &&
        !(anchorNodeIndex === focusNodeIndex && selection.anchorOffset === selection.focusOffset)) {
        if ((anchorNodeIndex < focusNodeIndex) ||
          (anchorNodeIndex === focusNodeIndex && selection.anchorOffset < selection.focusOffset)) {
          urlArguments.set('selection', `${anchorNodeIndex},${selection.anchorOffset},${focusNodeIndex},${selection.focusOffset}`);
        } else {
          urlArguments.set('selection', `${focusNodeIndex},${selection.focusOffset},${anchorNodeIndex},${selection.anchorOffset}`);
        }
      }
    }
    resetUrlArgumentsTo(urlArguments);
  }, 250);
}

function attachEscapeEvent(content: Content) {
  escapeKeyPressEvent.onUntil(() => {
    if (isAnyModalOpened()) {
      return;
    }
    enterMenuMode();
  }, content.leavingEvent);
}

function registerArrowKeyEvents(loadPrevChapter: () => void, loadNextChapter: () => void, content: Content) {
  arrowKeyPressEvent.onUntil(arrowKey => {
    if (isAnyModalOpened()) {
      return;
    }
    if (arrowKey === ArrowKey.LEFT) {
      loadPrevChapter();
    } else if (arrowKey === ArrowKey.RIGHT) {
      loadNextChapter();
    }
  }, content.leavingEvent);
}

function registerSwipeEvents(loadPrevChapter: () => void, loadNextChapter: () => void, content: Content) {
  swipeEvent.onUntil(direction => {
    if (!gestureSwitchChapter.getValue()) {
      return;
    }
    if (isAnyModalOpened()) {
      return;
    }
    if (direction === SwipeDirection.TO_RIGHT) {
      // 上一章
      loadPrevChapter();
    } else if (direction === SwipeDirection.TO_LEFT) {
      // 下一章
      loadNextChapter();
    }
  }, content.leavingEvent);
}

function insertContent(content: Content, text: string, chapter: Chapter) {
  switch (chapter.type) {
    case 'Markdown':
      return loadMarkdown(content, text);
  }
}

function loadMarkdown(content: Content, text: string) {
  const block = content.addBlock();
  block.element.innerHTML = text;
  processElements(block.element);
  return block;
}

function followQueryToChapter(relativePath: string, args: Map<string, string>): boolean {
  const chapterCtx = relativePathLookUpMap.get(relativePath);
  if (chapterCtx === undefined) {
    // Cannot find chapter
    return false;
  }
  const side = (
    lastChapterCtx !== null &&
    chapterCtx.inFolderIndex < lastChapterCtx.inFolderIndex
  ) ? Side.LEFT : Side.RIGHT;

  const selection: Array<number> = args.has('selection')
    ? args.get('selection')!.split(',').map(str => +str)
    : [];
  if (selection.length !== 4 || !selection.every(
    num => (num >= 0) && (num % 1 === 0) && (!Number.isNaN(num)) && (Number.isFinite(num)),
  )) {
    loadChapter(relativePath, undefined, side);
  } else {
    loadChapter(
      relativePath,
      selection as [number, number, number, number],
      side,
    );
  }
  return true;
}

export function chapterPathHandler(path: string, args: Map<string, string>) {
  const handled = followQueryToChapter(path, args);
  return handled;
}
