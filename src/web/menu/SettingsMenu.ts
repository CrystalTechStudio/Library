import { stylePreviewArticle } from '../constant/stylePreviewArticle';
import { newContent, Side } from '../control/contentControl';
import { Layout } from '../control/layoutControl';
import { processElements } from '../control/processElements';
import { animation, BooleanSetting, developerMode, earlyAccess, EnumSetting, fontFamily, gestureSwitchChapter, lite, showAbandonedChapters, useComments } from '../data/settings';
import { ItemDecoration, ItemHandle, Menu } from '../Menu';

export class EnumSettingMenu extends Menu {
  public constructor(urlBase: string, setting: EnumSetting, usePreview: boolean, callback: () => void) {
    super(urlBase, usePreview ? Layout.SIDE : Layout.OFF);
    let currentHandle: ItemHandle;
    if (usePreview) {
      const block = newContent(Side.RIGHT).addBlock();
      block.element.innerHTML = stylePreviewArticle;
      processElements(block.element);
    }
    setting.options.forEach((valueName, value) => {
      const handle = this.addItem(valueName, { button: true, decoration: ItemDecoration.SELECTABLE })
        .onClick(() => {
          currentHandle.setSelected(false);
          handle.setSelected(true);
          setting.setValue(value);
          currentHandle = handle;
          callback();
        });
      if (value === setting.getValue()) {
        currentHandle = handle;
        handle.setSelected(true);
      }
    });
  }
}

export class SettingsMenu extends Menu {
  public constructor(urlBase: string) {
    super(urlBase);

    this.addBooleanSetting('使用动画', animation);
    this.addBooleanSetting('显示编写中章节', earlyAccess);
    this.addBooleanSetting('显示评论', useComments);
    this.addBooleanSetting('手势切换章节（仅限手机）', gestureSwitchChapter);
    this.addEnumSetting('字体', fontFamily, true);
    this.addBooleanSetting('开发人员模式', developerMode);
    this.addBooleanSetting('显示已弃坑章节', showAbandonedChapters);
    this.addBooleanSetting('禁用精简版自动跳转到完整版', lite);
  }
  public addBooleanSetting(label: string, setting: BooleanSetting) {
    const getText = (value: boolean) => `${label}：${value ? '开' : '关'}`;
    const handle = this.addItem(getText(setting.getValue()), { button: true })
      .onClick(() => {
        setting.toggle();
      });
    setting.event.on(newValue => {
      handle.setInnerText(getText(newValue));
    });
  }
  public addEnumSetting(label: string, setting: EnumSetting, usePreview?: true) {
    const getText = () => `${label}：${setting.getValueName()}`;
    const handle = this.buildSubMenu(label, EnumSettingMenu, setting, usePreview === true, () => {
      handle.setInnerText(getText());
    }).setDisplayName(getText()).build();
  }
}
