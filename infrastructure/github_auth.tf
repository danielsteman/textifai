resource "google_service_account" "github" {
  for_each = var.environment_id

  account_id   = "githubactions"
  display_name = "Github Actions Service Account"
  project      = google_project.default[each.key].project_id
}

resource "google_project_iam_binding" "artifact_reader" {
  for_each = var.environment_id

  project = google_project.default[each.key].project_id
  role    = "roles/artifactregistry.reader"

  members = [
    google_service_account.github[each.key].member
  ]
}

resource "google_project_iam_binding" "artifact_writer" {
  for_each = var.environment_id

  project = google_project.default[each.key].project_id
  role    = "roles/artifactregistry.writer"

  members = [
    google_service_account.github[each.key].member
  ]
}

resource "google_project_iam_binding" "token_creator" {
  for_each = var.environment_id

  project = google_project.default[each.key].project_id
  role    = "roles/iam.serviceAccountTokenCreator"

  members = [
    google_service_account.github[each.key].member
  ]
}
