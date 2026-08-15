import { describe, expect, test } from 'vitest'

import { createEnterpriseNavigationModel } from '../navigation'
import type { EnterpriseNavigationLabels } from '../types'

const origins = {
  www: 'https://www.doohuan.com',
  aips: 'https://aips.doohuan.com',
  api: 'https://api.doohuan.com',
}

const labels: EnterpriseNavigationLabels = {
  about: '关于',
  aips: '智搜货通',
  api: 'API',
  home: '首页',
  features: '功能',
  pricing: '定价',
  download: '下载',
  apiOverview: '产品介绍',
  apiModels: '模型广场',
  apiDocs: '文档',
  signIn: '登录',
  register: '注册',
  dashboard: '控制台',
  navigation: '主导航',
  closeNavigation: '关闭导航',
}

describe('createEnterpriseNavigationModel', () => {
  test('builds canonical product links from one source', () => {
    const model = createEnterpriseNavigationModel(origins, labels)

    expect(model.about.href).toBe('https://www.doohuan.com/about')
    expect(model.aips.map((item) => item.href)).toEqual([
      'https://aips.doohuan.com/',
      'https://aips.doohuan.com/features',
      'https://aips.doohuan.com/pricing',
      'https://aips.doohuan.com/download',
    ])
    expect(model.api.map((item) => item.href)).toEqual([
      'https://api.doohuan.com/',
      'https://api.doohuan.com/models',
      'https://api.doohuan.com/doc',
    ])
  })

  test('localizes www and AIPS links without changing API routes', () => {
    const model = createEnterpriseNavigationModel(origins, labels, '/en')

    expect(model.about.href).toBe('https://www.doohuan.com/en/about')
    expect(model.aips[0]?.href).toBe('https://aips.doohuan.com/en')
    expect(model.aips[1]?.href).toBe(
      'https://aips.doohuan.com/en/features'
    )
    expect(model.api[2]?.href).toBe('https://api.doohuan.com/doc')
  })
})
