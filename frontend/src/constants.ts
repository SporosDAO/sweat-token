interface Owner {
  name: string
  homepageUrl: string
  docsUrl: string
  helpUrl: string
}

export const OWNER: Owner = {
  name: 'Sporos DAO',
  homepageUrl: 'https://www.sporosdao.xyz/',
  docsUrl: 'https://www.notion.so/SporosDAO-963e89779ebb45c5b717c478ef739627',
  helpUrl: 'https://discord.gg/jHnx3AC2'
}

export const getDaoUrl = (daoId: string, ...parts: string[]): string => {
  return ['', 'dao', daoId, ...parts].join('/')
}

export const getDaoProjectUrl = (daoId: string, projectId?: string, ...parts: string[]): string => {
  const subpath = ['projects']
  if (projectId) subpath.push(projectId)
  if (parts.length) subpath.push(...parts)
  return getDaoUrl(daoId, ...subpath)
}
