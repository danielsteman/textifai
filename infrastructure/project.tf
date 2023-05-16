resource "google_project" "default" {
  provider = google-beta

  project_id = "${var.project_id}-${var.unique_identifier}"
  name       = "${var.project_name}-${var.unique_identifier}"

  billing_account = "01C220-00DCED-92B0FE"

  labels = {
    "firebase" = "enabled"
  }
}

resource "google_service_account" "service_account" {
  provider     = google-beta.gcloud-user
  project      = google_project.default.project_id
  account_id   = "terraform"
  display_name = "Terraform"
}

data "google_client_openid_userinfo" "gcloud-user" {
  provider = google-beta.gcloud-user
}

resource "google_service_account_iam_member" "grant-token-iam" {
  provider           = google-beta.gcloud-user
  service_account_id = google_service_account.service_account.id
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = "user:${data.google_client_openid_userinfo.gcloud-user.email}"
}

resource "time_sleep" "delay_token_creation" {
  depends_on = [
    google_service_account_iam_member.grant-token-iam,
    google_service_account.service_account,
  ]

  create_duration = "30s"
}

data "google_service_account_access_token" "default" {
  provider = google-beta.gcloud-user
  #   project                = google_project.default.project_id
  target_service_account = google_service_account.service_account.email
  scopes                 = ["userinfo-email", "cloud-platform"]
  lifetime               = "300s"
  depends_on = [
    google_service_account_iam_member.grant-token-iam,
    google_service_account.service_account,
    time_sleep.delay_token_creation
  ]
}

resource "google_project_service" "default" {
  provider = google-beta.gcloud-user
  project  = google_project.default.project_id
  for_each = toset([
    "cloudbilling.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "firebase.googleapis.com",
    "firebasestorage.googleapis.com",
    "serviceusage.googleapis.com",
    "identitytoolkit.googleapis.com",
  ])
  service = each.key

  disable_on_destroy = false
}

resource "google_firebase_project" "default" {
  provider = google-beta.gcloud-user
  project  = google_project.default.project_id

  depends_on = [
    google_project_service.default
  ]
}