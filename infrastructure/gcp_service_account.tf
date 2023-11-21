resource "google_service_account" "tfc" {
  account_id   = "tf-cloud"
  display_name = "Service Account"
  project      = google_project.default.id
}

resource "google_service_account" "tfc_dev" {
  account_id   = "tf-cloud"
  display_name = "Service Account"
  project      = google_project.dev.id
}

resource "google_project_iam_binding" "owner" {
  project = google_project.default.project_id
  role    = "roles/owner"

  members = [
    google_service_account.tfc.member
  ]
}

resource "google_project_iam_binding" "owner_dev" {
  project = google_project.default.project_id
  role    = "roles/owner"

  members = [
    google_service_account.tfc-dev.member
  ]
}
