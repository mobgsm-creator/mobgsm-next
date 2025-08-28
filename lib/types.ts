export interface Product {
  product_links: string 
  product_name: string
  brand_name: string
  price: string
  mrp: string
  discount: string
  status: string
  payment_options: string
  rating: string
  reviews: string
  img_link: string
  flag: number
  country: string
  store_logo: string
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
  country: string
}

export interface BNPLProvider {
  Name: string
  Website: string
  NBFC_Partner: string[]
  Credit_Limit: string
  Interest_Rate: string
  KYC: boolean
  Image_URL: string
  country: string
}

export interface reloadly {
  id : number, 
  operator : string, 
  sendable_values : string, 
  discount : string, 
  fx : string, 
  code : string, 
  flag : string,
  img_link : string
  operator_id: number

}

export type Device = {
  id: number;
  name: string;
  name_url: string;
  brand_name: string;
  image: string;
};