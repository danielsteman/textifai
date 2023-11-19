# Creates a new Google Cloud project.
resource "google_project" "default" {
  for_each = var.environment_id

  provider = google-beta

  project_id = "${var.project_name}-${each.value}"
  name       = "${var.project_name}-${each.value}"
  # Required for any service that requires the Blaze pricing plan
  # (like Firebase Authentication with GCIP)
  billing_account = var.billing_account

  # Required for the project to display in any list of Firebase projects.
  labels = {
    "firebase" = "enabled"
  }
}

# Enables required APIs.
resource "google_project_service" "default" {
  provider = google-beta
  project  = google_project.default["prod"].project_id
  for_each = toset([
    "cloudbilling.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "firebase.googleapis.com",
    # Enabling the ServiceUsage API allows the new project to be quota checked from now on.
    "serviceusage.googleapis.com",
    # Enabling GCIP
    "identitytoolkit.googleapis.com",
    "firestore.googleapis.com"
  ])
  service = each.key

  # Don't disable the service if the resource block is removed by accident.
  disable_on_destroy = false
}

# Enables required APIs.
resource "google_project_service" "default" {
  provider = google-beta
  project  = google_project.default["dev"].project_id
  for_each = toset([
    "cloudbilling.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "firebase.googleapis.com",
    # Enabling the ServiceUsage API allows the new project to be quota checked from now on.
    "serviceusage.googleapis.com",
    # Enabling GCIP
    "identitytoolkit.googleapis.com",
    "firestore.googleapis.com"
  ])
  service = each.key

  # Don't disable the service if the resource block is removed by accident.
  disable_on_destroy = false
}
