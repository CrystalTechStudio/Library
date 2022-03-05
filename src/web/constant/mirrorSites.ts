export interface MirrorSite {
  name: string;
  origin: string;
  provider: string;
  technology: string;
}

export const mirrorSites: Array<MirrorSite> = [
];

export const mainSite: MirrorSite = {
  name: '主站',
  origin: 'https://crystaltechstudio.github.io/Library',
  provider: 'Crystal Moling',
  technology: 'Github Pages',
};

export const mirrorSitesPlusMainSite: Array<MirrorSite> = [mainSite, ...mirrorSites];
