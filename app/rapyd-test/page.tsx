"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function RapydTestPage() {
  const [response, setResponse] = useState<any>(null)//eslint-disable-line
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("wallets")

  const [walletData, setWalletData] = useState({
    ewallet_reference_id: "",
    contact_email: "",
    contact_first_name: "",
    contact_last_name: "",
    contact_phone: "",
    contact_country: "US",
  })
  const [walletId, setWalletId] = useState("")

  const [paymentData, setPaymentData] = useState({
    amount: "",
    currency: "USD",
    payment_method_type: "us_debit_visa_card",
    country: "US",
  })
  const [paymentId, setPaymentId] = useState("")

  const [payoutData, setPayoutData] = useState({
    ewallet: "",
    amount: "",
    currency: "USD",
    payout_method_type: "us_general_bank",
    beneficiary_first_name: "",
    beneficiary_last_name: "",
    beneficiary_country: "US",
  })
  const [payoutId, setPayoutId] = useState("")

  const [transferData, setTransferData] = useState({
    source_ewallet: "",
    destination_ewallet: "",
    amount: "",
    currency: "USD",
  })
  const [transferId, setTransferId] = useState("")

  const makeRequest = async (url: string, method = "GET", body?: any) => {//eslint-disable-line
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const config: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      }

      if (body && method !== "GET") {
        config.body = JSON.stringify(body)
      }

      const res = await fetch(url, config)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`)
      }

      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rapyd API Testing Interface</h1>
        <p className="text-muted-foreground">Test all Rapyd API endpoints with clearly labeled inputs and buttons</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="wallets">Wallets</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
              <TabsTrigger value="transfers">Transfers</TabsTrigger>
            </TabsList>

            <TabsContent value="wallets" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Management</CardTitle>
                  <CardDescription>Create and manage wallets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="wallet-ref-id">Reference ID</Label>
                      <Input
                        id="wallet-ref-id"
                        value={walletData.ewallet_reference_id}
                        onChange={(e) => setWalletData({ ...walletData, ewallet_reference_id: e.target.value })}
                        placeholder="wallet_ref_123"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">Contact Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={walletData.contact_email}
                        onChange={(e) => setWalletData({ ...walletData, contact_email: e.target.value })}
                        placeholder="user@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-first-name">First Name</Label>
                      <Input
                        id="contact-first-name"
                        value={walletData.contact_first_name}
                        onChange={(e) => setWalletData({ ...walletData, contact_first_name: e.target.value })}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-last-name">Last Name</Label>
                      <Input
                        id="contact-last-name"
                        value={walletData.contact_last_name}
                        onChange={(e) => setWalletData({ ...walletData, contact_last_name: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-phone">Phone Number</Label>
                      <Input
                        id="contact-phone"
                        value={walletData.contact_phone}
                        onChange={(e) => setWalletData({ ...walletData, contact_phone: e.target.value })}
                        placeholder="+1234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-country">Country</Label>
                      <Select
                        value={walletData.contact_country}
                        onValueChange={(value) => setWalletData({ ...walletData, contact_country: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      makeRequest("/api/rapyd/wallets/create", "POST", {
                        ewallet_reference_id: walletData.ewallet_reference_id,
                        contact: {
                          email: walletData.contact_email,
                          first_name: walletData.contact_first_name,
                          last_name: walletData.contact_last_name,
                          phone_number: walletData.contact_phone,
                          contact_type: "personal",
                          address: {
                            country: walletData.contact_country,
                          },
                        },
                      })
                    }
                    disabled={loading}
                    className="w-full"
                  >
                    Create Wallet
                  </Button>

                  <Separator />

                  <div>
                    <Label htmlFor="wallet-id-retrieve">Wallet ID to Retrieve</Label>
                    <div className="flex gap-2">
                      <Input
                        id="wallet-id-retrieve"
                        value={walletId}
                        onChange={(e) => setWalletId(e.target.value)}
                        placeholder="ewallet_xxx"
                      />
                      <Button
                        onClick={() => makeRequest(`/api/rapyd/wallets/${walletId}`)}
                        disabled={loading || !walletId}
                      >
                        Get Wallet
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={() => makeRequest(`/api/rapyd/wallets/${walletId}/transactions`)}
                    disabled={loading || !walletId}
                    variant="outline"
                    className="w-full"
                  >
                    Get Wallet Transactions
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Management</CardTitle>
                  <CardDescription>Create and manage payments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="payment-country">Country for Payment Methods</Label>
                    <div className="flex gap-2">
                      <Select
                        value={paymentData.country}
                        onValueChange={(value) => setPaymentData({ ...paymentData, country: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() =>
                          makeRequest(
                            `/api/rapyd/payment-methods/${paymentData.country}?currency=${paymentData.currency}`,
                          )
                        }
                        disabled={loading}
                      >
                        Get Payment Methods
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="payment-amount">Amount</Label>
                      <Input
                        id="payment-amount"
                        type="number"
                        value={paymentData.amount}
                        onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                        placeholder="100.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="payment-currency">Currency</Label>
                      <Select
                        value={paymentData.currency}
                        onValueChange={(value) => setPaymentData({ ...paymentData, currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="payment-method-type">Payment Method Type</Label>
                    <Input
                      id="payment-method-type"
                      value={paymentData.payment_method_type}
                      onChange={(e) => setPaymentData({ ...paymentData, payment_method_type: e.target.value })}
                      placeholder="us_debit_visa_card"
                    />
                  </div>

                  <Button
                    onClick={() =>
                      makeRequest("/api/rapyd/payments/create", "POST", {
                        amount: Number.parseFloat(paymentData.amount),
                        currency: paymentData.currency,
                        payment_method: {
                          type: paymentData.payment_method_type,
                          fields: {},
                        },
                        description: "Test payment",
                      })
                    }
                    disabled={loading || !paymentData.amount}
                    className="w-full"
                  >
                    Create Payment
                  </Button>

                  <Separator />

                  <div>
                    <Label htmlFor="payment-id-retrieve">Payment ID to Retrieve</Label>
                    <div className="flex gap-2">
                      <Input
                        id="payment-id-retrieve"
                        value={paymentId}
                        onChange={(e) => setPaymentId(e.target.value)}
                        placeholder="payment_xxx"
                      />
                      <Button
                        onClick={() => makeRequest(`/api/rapyd/payments/${paymentId}`)}
                        disabled={loading || !paymentId}
                      >
                        Get Payment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payouts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payout Management</CardTitle>
                  <CardDescription>Create and manage payouts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="payout-country">Country for Payout Methods</Label>
                    <div className="flex gap-2">
                      <Select
                        value={payoutData.beneficiary_country}
                        onValueChange={(value) => setPayoutData({ ...payoutData, beneficiary_country: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => makeRequest(`/api/rapyd/payouts/method-types/${payoutData.beneficiary_country}`)}
                        disabled={loading}
                      >
                        Get Payout Methods
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      makeRequest(
                        `/api/rapyd/payouts/required-fields?payout_method_type=${payoutData.payout_method_type}&beneficiary_country=${payoutData.beneficiary_country}&payout_currency=${payoutData.currency}`,
                      )
                    }
                    disabled={loading}
                    variant="outline"
                    className="w-full"
                  >
                    Get Required Fields for Payout
                  </Button>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="payout-ewallet">Source Wallet ID</Label>
                      <Input
                        id="payout-ewallet"
                        value={payoutData.ewallet}
                        onChange={(e) => setPayoutData({ ...payoutData, ewallet: e.target.value })}
                        placeholder="ewallet_xxx"
                      />
                    </div>
                    <div>
                      <Label htmlFor="payout-amount">Amount</Label>
                      <Input
                        id="payout-amount"
                        type="number"
                        value={payoutData.amount}
                        onChange={(e) => setPayoutData({ ...payoutData, amount: e.target.value })}
                        placeholder="100.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="payout-currency">Currency</Label>
                      <Select
                        value={payoutData.currency}
                        onValueChange={(value) => setPayoutData({ ...payoutData, currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="payout-method-type">Payout Method Type</Label>
                      <Input
                        id="payout-method-type"
                        value={payoutData.payout_method_type}
                        onChange={(e) => setPayoutData({ ...payoutData, payout_method_type: e.target.value })}
                        placeholder="us_general_bank"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="beneficiary-first-name">Beneficiary First Name</Label>
                      <Input
                        id="beneficiary-first-name"
                        value={payoutData.beneficiary_first_name}
                        onChange={(e) => setPayoutData({ ...payoutData, beneficiary_first_name: e.target.value })}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="beneficiary-last-name">Beneficiary Last Name</Label>
                      <Input
                        id="beneficiary-last-name"
                        value={payoutData.beneficiary_last_name}
                        onChange={(e) => setPayoutData({ ...payoutData, beneficiary_last_name: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      makeRequest("/api/rapyd/payouts/create", "POST", {
                        ewallet: payoutData.ewallet,
                        amount: Number.parseFloat(payoutData.amount),
                        currency: payoutData.currency,
                        payout_method_type: payoutData.payout_method_type,
                        payout_method: {
                          type: payoutData.payout_method_type,
                          fields: {},
                        },
                        beneficiary: {
                          first_name: payoutData.beneficiary_first_name,
                          last_name: payoutData.beneficiary_last_name,
                          address: {
                            country: payoutData.beneficiary_country,
                          },
                        },
                        description: "Test payout",
                      })
                    }
                    disabled={loading || !payoutData.ewallet || !payoutData.amount}
                    className="w-full"
                  >
                    Create Payout
                  </Button>

                  <Separator />

                  <div>
                    <Label htmlFor="payout-id-retrieve">Payout ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="payout-id-retrieve"
                        value={payoutId}
                        onChange={(e) => setPayoutId(e.target.value)}
                        placeholder="payout_xxx"
                      />
                      <Button
                        onClick={() => makeRequest(`/api/rapyd/payouts/${payoutId}`)}
                        disabled={loading || !payoutId}
                      >
                        Get Payout
                      </Button>
                      <Button
                        onClick={() => makeRequest(`/api/rapyd/payouts/${payoutId}`, "DELETE")}
                        disabled={loading || !payoutId}
                        variant="destructive"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transfers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Management</CardTitle>
                  <CardDescription>Transfer funds between wallets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="source-wallet">Source Wallet ID</Label>
                      <Input
                        id="source-wallet"
                        value={transferData.source_ewallet}
                        onChange={(e) => setTransferData({ ...transferData, source_ewallet: e.target.value })}
                        placeholder="ewallet_xxx"
                      />
                    </div>
                    <div>
                      <Label htmlFor="destination-wallet">Destination Wallet ID</Label>
                      <Input
                        id="destination-wallet"
                        value={transferData.destination_ewallet}
                        onChange={(e) => setTransferData({ ...transferData, destination_ewallet: e.target.value })}
                        placeholder="ewallet_yyy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="transfer-amount">Amount</Label>
                      <Input
                        id="transfer-amount"
                        type="number"
                        value={transferData.amount}
                        onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                        placeholder="50.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="transfer-currency">Currency</Label>
                      <Select
                        value={transferData.currency}
                        onValueChange={(value) => setTransferData({ ...transferData, currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      makeRequest("/api/rapyd/transfers/create", "POST", {
                        source_ewallet: transferData.source_ewallet,
                        destination_ewallet: transferData.destination_ewallet,
                        amount: Number.parseFloat(transferData.amount),
                        currency: transferData.currency,
                        metadata: {
                          description: "P2P transfer",
                        },
                      })
                    }
                    disabled={
                      loading ||
                      !transferData.source_ewallet ||
                      !transferData.destination_ewallet ||
                      !transferData.amount
                    }
                    className="w-full"
                  >
                    Create Transfer
                  </Button>

                  <Separator />

                  <div>
                    <Label htmlFor="transfer-id-retrieve">Transfer ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="transfer-id-retrieve"
                        value={transferId}
                        onChange={(e) => setTransferId(e.target.value)}
                        placeholder="transfer_xxx"
                      />
                      <Button
                        onClick={() => makeRequest(`/api/rapyd/transfers/${transferId}`)}
                        disabled={loading || !transferId}
                      >
                        Get Transfer
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        makeRequest("/api/rapyd/transfers/response", "POST", {
                          id: transferId,
                          status: "accept",
                          metadata: { merchant_defined: "accepted" },
                        })
                      }
                      disabled={loading || !transferId}
                      variant="outline"
                      className="flex-1"
                    >
                      Accept Transfer
                    </Button>
                    <Button
                      onClick={() =>
                        makeRequest("/api/rapyd/transfers/response", "POST", {
                          id: transferId,
                          status: "decline",
                          metadata: { merchant_defined: "declined" },
                        })
                      }
                      disabled={loading || !transferId}
                      variant="outline"
                      className="flex-1"
                    >
                      Decline Transfer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                API Response
                {loading && <Badge variant="secondary">Loading...</Badge>}
                {error && <Badge variant="destructive">Error</Badge>}
                {response && !error && <Badge variant="default">Success</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-destructive font-medium">Error:</p>
                  <p className="text-sm text-destructive/80">{error}</p>
                </div>
              )}

              {response && (
                <div className="space-y-2">
                  <Textarea
                    value={JSON.stringify(response, null, 2)}
                    readOnly
                    className="min-h-[400px] font-mono text-sm"
                  />
                </div>
              )}

              {!response && !error && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No response yet. Make an API call to see results here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
