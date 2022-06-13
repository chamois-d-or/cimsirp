import MyComponent from '../../../../../slices/ecommerce/ProductListWithCta';

export default {
  title: 'slices/ecommerce/ProductListWithCta'
}


export const _DefaultSlice = () => <MyComponent slice={{"variation":"default-slice","name":"Default slice","slice_type":"product_list_with_cta","items":[{"productLink":{"link_type":"Web","url":"http://twitter.com"}},{"productLink":{"link_type":"Web","url":"https://slicemachine.dev"}},{"productLink":{"link_type":"Web","url":"http://google.com"}},{"productLink":{"link_type":"Web","url":"http://twitter.com"}},{"productLink":{"link_type":"Web","url":"https://slicemachine.dev"}}],"primary":{"title":[{"type":"heading1","text":"Embrace dynamic content","spans":[]}],"description":[{"type":"paragraph","text":"Velit commodo mollit deserunt. Cillum non officia tempor nisi consectetur pariatur excepteur. Sit nisi labore tempor fugiat nostrud anim.","spans":[]}],"link":{"link_type":"Web","url":"https://prismic.io"}},"id":"_DefaultSlice"}} />
_DefaultSlice.storyName = 'Default slice'

export const _CustomProducts = () => <MyComponent slice={{"variation":"customProducts","name":"Custom Products","slice_type":"product_list_with_cta","items":[{"productLink":{"link_type":"Web","url":"http://google.com"}},{"productLink":{"link_type":"Web","url":"https://prismic.io"}},{"productLink":{"link_type":"Web","url":"https://slicemachine.dev"}}],"primary":{"title":[{"type":"heading1","text":"Reintermediate bricks-and-clicks blockchains","spans":[]}],"description":[{"type":"paragraph","text":"Tempor quis est qui ea sint excepteur consequat duis incididunt id nostrud.","spans":[]}],"link":{"link_type":"Web","url":"http://twitter.com"}},"id":"_CustomProducts"}} />
_CustomProducts.storyName = 'Custom Products'
