import crypto from "crypto"

const accessKey = process.env.RAPYD_ACCESS_KEY
const secretKey = process.env.RAPYD_SECRET_KEY
const baseUrl = process.env.RAPYD_BASE_URL || "https://sandboxapi.rapyd.net"
export interface RapydSignature {
  salt: string
  timestamp: number
  signature: string
  accessKey: string
  idempotency: string
}

export function generateSignature(method: string, urlPath: string, body: any = null): RapydSignature {//eslint-disable-line @typescript-eslint/no-explicit-any
  if (!accessKey || !secretKey) {
    throw new Error("RAPYD_ACCESS_KEY and RAPYD_SECRET_KEY must be set in environment variables")
  }

  const salt = crypto.randomBytes(8).toString("hex")
  const timestamp = Math.round(Date.now() / 1000)
  const idempotency = Date.now().toString()

  let bodyString = ""
  if (body) {
    bodyString = JSON.stringify(body)
    bodyString = bodyString === "{}" ? "" : bodyString
  }

  const toSign = method.toLowerCase() + urlPath + salt + timestamp + accessKey + secretKey + bodyString

  const hash = crypto.createHmac("sha256", secretKey)
  hash.update(toSign)
  const signature = Buffer.from(hash.digest("hex")).toString("base64")

  return {
    salt,
    timestamp,
    signature,
    accessKey,
    idempotency,
  }
}

export async function rapydRequest(method: string, urlPath: string, body?: any) {//eslint-disable-line @typescript-eslint/no-explicit-any
  const { salt, timestamp, signature, accessKey, idempotency } = generateSignature(method, urlPath, body)

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    access_key: accessKey,
    salt,
    timestamp: timestamp.toString(),
    signature,
    idempotency,
  }

  const config: RequestInit = {
    method: method.toUpperCase(),
    headers,
  }

  if (body && (method.toUpperCase() === "POST" || method.toUpperCase() === "PUT")) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(baseUrl + urlPath, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(`Rapyd API Error: ${data.status?.message || "Unknown error"}`)
  }

  return data
}
// Wallet Management Types
export interface CreateWalletRequest {
  ewallet_reference_id: string
  metadata?: Record<string, any>//eslint-disable-line @typescript-eslint/no-explicit-any
  type?: string
  contact?: {
    phone_number?: string
    email?: string
    first_name?: string
    last_name?: string
    mothers_name?: string
    contact_type: string
    address?: {
      name?: string
      line_1?: string
      line_2?: string
      line_3?: string
      city?: string
      state?: string
      country: string
      zip?: string
      phone_number?: string
      metadata?: Record<string, any>//eslint-disable-line @typescript-eslint/no-explicit-any
      canton?: string
      district?: string
    }
    identification_type?: string
    identification_number?: string
    date_of_birth?: string
    country?: string
    nationality?: string
    business_details?: Record<string, any>//eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

export interface TransferRequest {
  source_ewallet: string
  amount: number
  currency: string
  destination_ewallet: string
  metadata?: Record<string, any>//eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface PaymentRequest {
  amount: number
  currency: string
  payment_method: {
    type: string
    fields?: Record<string, any>//eslint-disable-line @typescript-eslint/no-explicit-any
  }
  capture?: boolean
  description?: string
  metadata?: Record<string, any>//eslint-disable-line @typescript-eslint/no-explicit-any
  ewallet?: string
}

export interface PayoutRequest {
  ewallet: string
  amount: number
  currency: string
  payout_method_type: string
  payout_method: {
    type: string
    fields: Record<string, any>//eslint-disable-line @typescript-eslint/no-explicit-any
  }
  sender?: {
    first_name: string
    last_name: string
    address: {
      country: string
      [key: string]: any//eslint-disable-line @typescript-eslint/no-explicit-any
    }
  }
  beneficiary: {
    first_name: string
    last_name: string
    address: {
      country: string
      [key: string]: any//eslint-disable-line @typescript-eslint/no-explicit-any
    }
    [key: string]: any//eslint-disable-line @typescript-eslint/no-explicit-any
  }
  description?: string
  metadata?: Record<string, any>//eslint-disable-line @typescript-eslint/no-explicit-any
}
