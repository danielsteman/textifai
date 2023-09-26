module "cloud-run" {
  source  = "GoogleCloudPlatform/cloud-run/google"
  version = "0.9.1"

  service_name = "web"
  project_id   = google_project.default.project_id
  location     = var.location
  image        = ""
}