import { visit } from 'unist-util-visit'

const containerTypes = ['tip', 'warning', 'danger', 'info', 'details']

const containerConfig = {
  tip: {
    title: '提示',
    className: 'custom-container tip'
  },
  warning: {
    title: '注意',
    className: 'custom-container warning'
  },
  danger: {
    title: '警告',
    className: 'custom-container danger'
  },
  info: {
    title: '信息',
    className: 'custom-container info'
  },
  details: {
    title: '详情',
    className: 'custom-container details'
  }
}

export function remarkContainer() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === 'containerDirective') {
        const type = node.name

        if (!containerTypes.includes(type)) {
          return
        }

        const config = containerConfig[type]
        const data = node.data || (node.data = {})

        let title = config.title

        const firstChild = node.children[0]
        if (firstChild?.data?.directiveLabel === true) {
          const labelText = firstChild.children
            ?.map((child) => child.value || '')
            .join('')
          if (labelText) {
            title = labelText
          }
          node.children.shift()
        }

        data.hName = type === 'details' ? 'details' : 'div'
        data.hProperties = {
          className: config.className
        }

        if (type === 'details') {
          node.children.unshift({
            type: 'paragraph',
            data: {
              hName: 'summary',
              hProperties: { className: 'custom-container-title' }
            },
            children: [{ type: 'text', value: title }]
          })
        } else {
          node.children.unshift({
            type: 'paragraph',
            data: {
              hName: 'p',
              hProperties: { className: 'custom-container-title' }
            },
            children: [{ type: 'text', value: title }]
          })
        }
      }
    })
  }
}
