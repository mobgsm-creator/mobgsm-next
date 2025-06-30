export interface Product {
  product_links: string
  product_name: string
  brand: string
  price: string
  mrp: string
  discount: string
  status: string
  payment_options: string
  rating: string
  reviews: string
  img_link: string
  flag: number
}

export interface ESIMPlan {
  name: string
  price?: string
  price_range?: string
  data?: string
  validity?: string
  voice?: string
  sms?: string
  details?: string
  benefits?: string[]
  features?: string[]
  link: string
  type?: string
}

export interface ESIMProvider {
  provider: string
  type: string[]
  plans: ESIMPlan[]
  img_link: string
}

export interface BNPLProvider {
  Name: string
  Website: string
  NBFC_Partner: string[]
  Credit_Limit: string
  Interest_Rate: string
  KYC: boolean
  Image_URL: string
}
