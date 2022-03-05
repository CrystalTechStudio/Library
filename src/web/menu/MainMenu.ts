import { Menu } from '../Menu';
import { ChaptersMenu } from './ChaptersMenu';
import { SettingsMenu } from './SettingsMenu';
import { StyleMenu } from './StyleMenu';
import { ThanksMenu } from './ThanksMenu';

export class MainMenu extends Menu {
  public constructor(urlBase: string) {
    super(urlBase);
    this.container.classList.add('main');
    this.buildSubMenu('书目选择', ChaptersMenu).build();
    this.buildSubMenu('鸣谢列表', ThanksMenu).build();
    this.buildSubMenu('阅读器样式', StyleMenu).build();
    this.addItem('源代码', { button: true, link: 'https://github.com/CrystalTechStudio/Library' });
    this.buildSubMenu('设置', SettingsMenu).build();
  }
}
