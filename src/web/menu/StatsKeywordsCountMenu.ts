import { data } from '../data/data';
import { ItemDecoration, Menu } from '../Menu';
import { shortNumber } from '../util/shortNumber';

export class StatsKeywordsCountMenu extends Menu {
  public constructor(urlBase: string) {
    super(urlBase);
    this.addItem('添加其他关键词', {
      button: true,
      link: 'https://github.com/CrystalTechStudio/Library/blob/main/src/builder/keywords.ts',
      decoration: ItemDecoration.ICON_LINK,
    });
    data.keywordsCount.forEach(([keyword, count]) => {
      this.addItem(`${keyword}：${shortNumber(count, 2)}`);
    });
  }
}
