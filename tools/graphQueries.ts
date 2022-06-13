//This query gets related tabs for the menu
export const menuGraphQuery = `{
    menu{
      topPromoBanner
      logo
      menuTabs{
        menuTab{
          ...onmenu-tab{
            title
            slices{
              ...onmenu_sub_tab{
                variation{
                  ...ondefault-slice{
                    primary{
                      sectionTitle
                    }
                    items{
                      subSectionTitle
                      subSectionLink
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`

  //This query gets product data for home-page
  export const productListGraphQuery = `{
    home-page{
      slices{
        ...onproduct_list_with_cta{
          variation{
            ...ondefault-slice{
              primary{
                ...primaryFields
              }
              items{
                productLink{
                  ...productLinkFields
                }
              }
            }
            ...oncustomProducts{
              primary{
                ...primaryFields
              }
              items{
                productLink{
                  ...productLinkFields
                }
              }
            }
          }
        }
      }
    }
  }`

  //This query gets product data for home-page
  export const productListProductPageGraphQuery = `{
    product-page{
      slices{
        ...onproduct_list_with_cta{
          variation{
            ...ondefault-slice{
              primary{
                ...primaryFields
              }
              items{
                productLink{
                  ...productLinkFields
                }
              }
            }
          }
        }
      }
    }
  }`

  //This query gets product data for home-page
  export const categoryPageGraphQuery = `{
    category-page{
      meta_title
      meta_description
      products{
        product{
          product
        }
      }
      slices
    }
  }`

  //This query gets product data for home-page
  export const AbTestingBlogPageGraphQuery = `{
    blog-page{
      title
      category
      description
      variants{
        bucket
        variant{
          ...on blog-page {
            ...blog-pageFields
          }
        }
      }
      slices
    }
  }`