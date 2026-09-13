export interface ContentFrontmatter {
  title: string
  description?: string
  slug?: string
  heroImage?: string
  eyebrow?: string
  order?: number
  published?: boolean
  template?: 'editorial' | 'guide' | 'simple'
}

export interface ContentDocument {
  slug: string
  frontmatter: ContentFrontmatter
  content: string
}

export type ContentCollection = 'pages' | 'education'
