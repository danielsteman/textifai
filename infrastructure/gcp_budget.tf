data "google_billing_account" "account" {
  billing_account = var.billing_account
}

resource "google_billing_budget" "budget" {
  billing_account = data.google_billing_account.account.id
  display_name = "Textifai Billing Budget"
  amount {
    specified_amount {
      currency_code = "USD"
      units = "10"
    }
  }
  threshold_rules {
      threshold_percent =  0.5
  }
}