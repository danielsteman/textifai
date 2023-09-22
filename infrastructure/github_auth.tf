resource "google_service_account" "github" {
  account_id   = "githubactions"
  display_name = "Github Actions Service Account"
  project = google_project.default.project_id
}

resource "google_project_iam_binding" "artifact_reader" {
  project = google_project.default.project_id
  role    = "roles/artifactregistry.reader"

  members = [
    google_service_account.github.member
  ]
}

resource "google_project_iam_binding" "artifact_writer" {
  project = google_project.default.project_id
  role    = "roles/artifactregistry.writer"

  members = [
    google_service_account.github.member
  ]
}

resource "google_project_iam_binding" "token_creator" {
  project = google_project.default.project_id
  role    = "roles/iam.serviceAccountTokenCreator"

  members = [
    google_service_account.github.member
  ]
}
